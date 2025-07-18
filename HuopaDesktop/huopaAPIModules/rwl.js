let root;
let xPointer = "50%";
let yPointer = "50%";
let xPointerNum;
let yPointerNum;
let anchorX = "c";
let anchorY = "c";
let rootEl;
let lastWindowWidth;
let lastWindowHeight;
let frameOrientation = "Horizontal";

return {
    render: async(code) => {
        const rwlSrc = await huopaAPI.getFile("/system/env/moduleSrc/rwlSrc.js");
        const injectedCodeLine = `const injectedCode = ${JSON.stringify(code)};\n`;
        const fullSrc = injectedCodeLine + rwlSrc;
        const dataURL = "data:text/javascript;charset=utf-8," + convToDataURL(fullSrc);

        const scriptEl = document.createElement("script");
        scriptEl.type = "module";
        scriptEl.src = dataURL;
        document.body.append(scriptEl);
        const module = await import(dataURL);
        await renderElemSetup(module.parseData.data);
        lastWindowWidth = await huopaAPI.getRenderedSize(rootEl, "width");
        lastWindowHeight = await huopaAPI.getRenderedSize(rootEl, "height");
    }
}

function convToDataURL(source) {
  return encodeURIComponent(source);
}
async function renderElemSetup(rawData) {
    if (rawData) {
        const data = JSON.parse(rawData);
        root = data.elements[0];
        rootEl = document.createElement("div");
        rootEl.style = `
            width: 100%;
            position: relative;   
            height: 100%;
            width: 100%;
            color: white;
            opacity: 0;
            text-align: center;
        `;
        document.body.append(rootEl);
        await huopaAPI.log(JSON.stringify(root.data.content.elements));
        await renderElems(root.data.content.elements, rootEl);
        rootEl.style.opacity = "1"
;
        
    } else {
        await huopaAPI.warn("No data returned from rwlSrc!")
    }
}

async function renderElems(parentPath, parentId) {
    const children = parentPath;
    for (childIndex in children) {
        const child = children[childIndex];
        let childEl;
        let key;
        if (child.kind === "element") {
            childEl = document.createElement("p");
            childEl.textContent = child.data.value.value;
        } else if (child.kind === "block") {
            key = child?.data?.header?.key.toLowerCase()
            childEl = document.createElement("div");
            if (key === "button") {
                childEl.style = "padding: 0.5em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-color: rgba(105, 105, 105, 0.65); border-style: solid; cursor: pointer;";
            }
            await huopaAPI.log(key);
            if (key === "frame" || key === "section") {
                childEl.style = `width: 100%; height: 100%; border-style: solid; border-color: white;`;
            }

        }
        childEl.style.position = "absolute"
;
        let padding = "5px"; // Default padding
        if (child.data?.header?.attributes) {
            const attrList = child.data.header.attributes;
            for (attrIndex in attrList) {
                const attr = attrList[attrIndex];
                const attrType = attr.key;
                const value = attr?.value?.value;
                if (key === "frame" || key === "section") {
                    if (attrType === "Horizontal" || attrType === "Vertical") {
                        frameOrientation = attrType;
                    }
                } else {
                    if (attrType === "onclick") {
                        childEl.onclick = async() => {
                            await huopaAPI.log("buton clik");
                        };
                    }
                    if (attrType === "id") {
                        childEl.id = value;
                    }
                    if (attrType === "anchor" && key !== "frame" && key !== "section") {
                        
                        xPointer = "50%";
                        yPointer = "50%";

                        xPointerNum = await resolvePosition("50%", "width", parentId);
                        yPointerNum = await resolvePosition("50%", "height", parentId);

                        const val = value.toLowerCase();
                        const pNum = parseFloat(padding);

                        if (val === "c") {
                            anchorX = "c";
                            anchorY = "c";
                        } else if (val === "l") {
                            anchorX = "l";
                            anchorY = "c";
                            xPointer = padding;
                            xPointerNum = pNum;
                        } else if (val === "r") {
                            anchorX = "r";
                            anchorY = "c";
                            xPointer = `calc(100% - ${padding})`;
                            xPointerNum = -1;
                        } else if (val.startsWith("t")) {
                            anchorY = "t";
                            yPointer = padding;
                            yPointerNum = pNum;
                            if (val.endsWith("l")) {
                                anchorX = "l";
                                xPointer = padding;
                                xPointerNum = pNum;
                            } else if (val.endsWith("r")) {
                                anchorX = "r";
                                xPointer = `calc(100% - ${padding})`;
                                xPointerNum = -1;
                            } else {
                                anchorX = "c";
                                xPointer = "50%";
                                xPointerNum = resolvePosition("50%", "width", parentId);
                            }
                        } else if (val.startsWith("b")) {
                            anchorY = "b";
                            yPointer = `calc(100% - 50px - ${padding})`;
                            yPointerNum = -1;
                            if (val.endsWith("l")) {
                                anchorX = "l";
                                xPointer = padding;
                                xPointerNum = pNum;
                            } else if (val.endsWith("r")) {
                                anchorX = "r";
                                xPointer = `calc(100% - ${padding})`;
                                xPointerNum = -1;
                            } else {
                                anchorX = "c";
                                xPointer = "50%";
                                xPointerNum = resolvePosition("50%", "width", parentId);
                            }
                        }
                        
                        
                    }
                    if (attrType === "padding") {
                        const paddingSanitize = document.createElement("div");
                        paddingSanitize.style.padding = value + "px";
    
                        if (paddingSanitize.padding) {
                            padding = value + "px";
                        } else {
                            await huopaAPI.warn("RWL.js Interpretor: Invalid padding value, ignored.");
                        }
                        (paddingSanitize).remove()
                        
                    }
                    if (attrType === "size") {
                        if (child.kind === "element") {
                            childEl.fontSize = value * 1.6 + "px";
                        }  
                    }
                }
                
            }      
        }
        if (anchorX === "c") {
            if (anchorY === "c") {
                childEl.transform = "translate(-50%, -50%)";
            } else {
                childEl.transform = "translateX(-50%)";
            }
        } else if (anchorY === "c") {
            childEl.transform = "translateY(-50%)";
        }
        parentId.append(childEl);
        yPointerNum = await resolvePosition(yPointer, "height", parentId);
        if (!yPointer.includes("%")) {
            let yCalc;
            if (anchorY === "t" || anchorY === "c") {
                yCalc = yPointer;
            } else if (anchorY === "b") {
                const pointerValue = parseFloat(yPointerNum);
                const rootHeight = parseFloat(await huopaAPI.getRenderedSize(parentId, "height"));
                const offset = rootHeight - pointerValue;
                yCalc = `calc(100% - 10px - ${offset}px)`;
                yPointer = yCalc;
            }
            yPointer = yCalc;
            yPointerNum = await resolvePosition(yPointer, "height", parentId);
        }
        childEl.style.left = xPointer
;
        childEl.style.top = yPointer
;
        
        if (child.data?.content?.elements) {
            await renderElems(child.data.content.elements, childEl)
        }
        const elHeight = await huopaAPI.getRenderedSize(childEl, "height");
        const rootHeight = await huopaAPI.getRenderedSize(parentId, "height");
        const paddingNum = parseFloat(padding);
        const totalHeight = elHeight + paddingNum;
        if (!isNaN(yPointerNum) && !isNaN(totalHeight) && !isNaN(rootHeight)) {
            const divAmount = paddingNum / 20 + 1;
            let newY = yPointerNum + totalHeight / divAmount + paddingNum + "px";
            if (parseFloat(newY) + 50 < rootHeight) {
                yPointer = parseFloat(newY) + "px";
            } else {
                yPointer = ((yPointerNum) - totalHeight) + "px";
            }
        } else {
            await huopaAPI.warn("RWL.js Interpreter: One or more dimensions could not be calculated.");
        }
        
        
    }
}
async function resolvePosition(value, axis, parentId) {

    if (value.startsWith("calc(")) {
        const expr = value.slice(5, -1).trim();

        const parts = expr.match(/([\d.]+)(px|%)|[+-]/g);
        if (!parts) {
            await huopaAPI.warn(`resolvePosition: Invalid calc expression "${value}"`);
            return NaN;
        }

        const rootSize = await huopaAPI.getRenderedSize(parentId, axis);

        let total = 0;
        let currentOp = "+";

        for (const part of parts) {
            if (part === "+" || part === "-") {
                currentOp = part;
            } else {
                const match = part.match(/([\d.]+)(px|%)/);
                if (!match) continue;
                let [ , num, unit ] = match;
                num = parseFloat(num);
                const pxValue = unit === "%" ? (num / 100) * rootSize : num;
                total = currentOp === "+" ? total + pxValue : total - pxValue;
            }
        }

        return total;
    } else if (value.endsWith("%")) {
        const rootSize = await huopaAPI.getRenderedSize(parentId, axis);
        const percent = parseFloat(value) / 100;
        return percent * rootSize;
    } else if (value.endsWith("px")) {
        return parseFloat(value);
    } else {
        return parseFloat(value);
    }
}
