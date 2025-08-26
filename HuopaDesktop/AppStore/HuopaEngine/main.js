let file = loadParams;

const versionId = 1.11;

let projectData;
const body = document.createElement("div");
document.body.append(body);

if (!file || !file.endsWith(".json")) {
    mainMenu();
} else {
    projectData = JSON.parse(await huopaAPI.getFile(file));
    loadProj(file);
}
async function mainMenu() {
    await huopaAPI.setTitle("HuopaEngine Hub");
    const createProjButton = document.createElement("button");
    await setAttrs(createProjButton, {
        "style":"padding: 1em; margin: 1em;",
        "textContent":"Create New Project",
        "onclick":() => createProject()
    });
    body.append(createProjButton);
    const files = JSON.parse(await huopaAPI.getFile("/home/projects"));
    if (!files) return;
    for (const proj of files) {
        const projDiv = document.createElement("div");
        await setAttrs(projDiv, {
            "class":"primary",
            "style":"width: calc(100% - 4em); margin: 1em auto; border-radius: 0.5em; padding: 1em; cursor: pointer;",
            "textContent":proj.split("/").pop(),
            "onclick":async() => {
                await huopaAPI.runApp("/home/applications/HuopaEngine.js", proj + "/project.json");
            }
        });
        body.append(projDiv);
    };
}
async function createProject() {
    if (!await huopaAPI.getFile("/home/projects")) await huopaAPI.writeFile("/home/projects", "dir", "[]");
    const name = await huopaAPI.openSaveDialog("/home/projects/myproject");
    const parent = name.split("/").slice(0, -1).join("/");
    if (!huopaAPI.getFile(parent)) { huopaAPI.createNotification("Invalid parent directory!", "Choose a path that has an existing parent directory."); mainMenu(); return; }
    projectData = 
{
    "objects":[
        {
            "name":"Node",
            "type":"Node",
            "id":"0",
            "data":{
                "width":"100",
                "height":"100",
                "fill":"#ffffff",
                "position":[0, 0],
                "layer":"0"
            },
            "scripts":[],
            "children":[]
        }
    ],
    "preferences":{
        "antiAliasing":true,
        "screenWidth":960,
        "screenHeight":540,
        "versionId":versionId,
        "embedFiles":false,
        "hideTitlebar":false
    }
};
    await huopaAPI.writeFile(`${name}/project.json`, "file", JSON.stringify(projectData, null, "    "));
    loadProj(name + "/project.json");
}

async function loadProj(projPath) {
    const opentypeEl = document.createElement("script");
    await setAttrs(opentypeEl, {
        "src":"https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js"
    });
    const validObjTypes = ["square", "image", "text", "node"];
    huopaAPI.setMinWindowSize(725, 300);
    const projName = projPath.split("/").slice(0, -1).pop().replace(".json", "");
    await huopaAPI.setTitle(`HuopaEngine - ${projName}`);
    let save = false;
    const imageCache = {};
    body.innerHTML = "";
    body.append(opentypeEl);
    if (!projectData) {
        const error = document.createElement("h2");
        await setAttrs(error, {
            "style":"margin: 1em auto; text-align: center",
            "textContent":"Project file not found!"
        });
        body.append(error);
        return;
    }
    const inspectorSidebar = document.createElement("div");
    const fileSidebar = document.createElement("div");
    const fileTree = document.createElement("div");
    const projectCanvas = document.createElement("canvas");
    const canvasContainer = document.createElement("div");
    const topControls = document.createElement("div");
    await setAttrs(inspectorSidebar, {
        class: "secondary",
        style: "position: absolute; right: 0; top: 0; height: 100%; width: 18em; border-style: none; border-left-style: solid; overflow-x: hidden; z-index: 2;"
    });
    await setAttrs(fileSidebar, {
        class: "secondary",
        style: "position: absolute; left: 0; top: 0; height: 100%; width: 12em; border-style: none; border-right-style: solid; overflow-x: hidden; x-index: 2;"
    });
    await setAttrs(fileTree, {
        style: "position: absolute; left: 0; top: 2.25em; height: calc(100% - 2.25em); width: 12em; border-style: none; overflow-x: hidden; x-index: 2;"
    });
    await setAttrs(canvasContainer, {
        "style":"position: absolute; left: 12em; top: 3em; overflow: hidden; height: calc(100% - 3em);"
    });
    await setAttrs(projectCanvas, {
        "style":"transform: translate(-50%, calc(-50% - 0.25em)); position: absolute; left: 50%; top: 50%;"
    });
    await setAttrs(topControls, {
        "style":"position: absolute; top: 0; left: 12em; padding: 0; width: calc(100% - 30em); margin: 0; border-style: none; border-bottom-style: solid;",
        "class":"secondary"
    });
    body.append(fileSidebar);
    fileSidebar.append(fileTree);
    body.append(inspectorSidebar);
    body.append(topControls);
    const playButton = document.createElement("button");
    const compileButton = document.createElement("button");
    await setAttrs(playButton, {
        "style":"padding: 0.5em; margin: 0.5em 0.5em; cursor: pointer; display: inline;",
        "textContent":"Play",
        "onclick":() => compileApp()
    });
    await setAttrs(compileButton, {
        "style":"padding: 0.5em; margin: 0.5em 0em; cursor: pointer; display: inline;",
        "textContent":"Build",
        "onclick":() => compileApp(true)
    });
    topControls.append(playButton);
    topControls.append(compileButton);
    canvasContainer.append(projectCanvas)
    body.append(canvasContainer);
    let objectArray = projectData?.objects;
    let objDepth = 0;
    const createElButton = document.createElement("button");
    await setAttrs(createElButton, {
        "style":"background-color: transparent; border-style: none; margin: 0; padding: 1em; padding-bottom: 0.5em;",
        "textContent":"Create element",
        "onclick":async() => {
            objectArray.push({
                "name":"Node",
                "type":"Node",
                "id":objectArray.length,
                "data":{
                    "width":"100",
                    "height":"100",
                    "fill":"#ffffff",
                    "position":[0, 0],
                    "layer":"0"
                },
                "children":[]
            });
            save = true;
            fileTree.innerHTML = "";
            if (objectArray) for (const child in objectArray) {
                const obj = objectArray[Number(child)];
                if (!obj) continue;
                if (!obj.child) {
                    await drawChild(obj);
                }
            }
        }
    });
    fileSidebar.append(createElButton);
    if (objectArray) { for (const child in objectArray) {
        const obj = objectArray[Number(child)];
        if (!obj) continue;
        if (!obj.child) {
            await drawChild(obj);
        }
    } }
    async function drawChild(obj) {
        const div = document.createElement("div");
        await setAttrs(div, {
            textContent:obj.name,
            "class":"primary",
            style:`margin: 0.5em; padding: 0.5em; font-size: small; border-radius: 0.5em; cursor: pointer; width: calc(100% - 2.25em - ${objDepth}px); overflow: hidden;`,
            onclick:() => selectObjInspector(obj.id)
        });
        if (obj.id != null) {
            fileTree.append(div);
            objDepth += 20;
            if (obj?.children) { for (const childId of obj.children) {
                await drawChild(objectArray[Number(childId)]); 
            }}
            objDepth -= 20;
        } else {
            console.log(`[HuopaEngine Editor]: Object with name "${obj.name}" has no id, ignored!`);
        }
    }
    async function selectObjInspector(objId) {
        const obj = objectArray[objId];
        inspectorSidebar.innerHTML = "";
        const name = document.createElement("input");
        const nameLabel = document.createElement("p");
        await setAttrs(nameLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Name"
        });
        await setAttrs(name, {
            "value":obj.name,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "oninput":() => {
                if (name.value) {
                    save = true;
                    objectArray[objId].name = name.value;
                    fileTree.children[objId].textContent = name.value;
                }
            }
        });
        inspectorSidebar.append(nameLabel);
        inspectorSidebar.append(name);
    
        const transformX = document.createElement("input");
        const transformY = document.createElement("input");
        const transformXYLabel = document.createElement("p");
        await setAttrs(transformXYLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Position"
        });
        await setAttrs(transformX, {
            "value":obj.data.position[0],
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"X Position",
            "oninput":() => {
                if (transformX.value) {
                    if (transformX.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformX.style.borderColor = ""; else transformX.style.borderColor = "rgba(200, 0, 0, 0.75)";
                    save = true;
                    objectArray[objId].data.position[0] = transformX.value;
                }
            }
        });
        if (transformX.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformX.style.borderColor = ""; else transformX.style.borderColor = "rgba(200, 0, 0, 0.75)";
        await setAttrs(transformY, {
            "value":obj.data.position[1],
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Y Position",
            "oninput":() => {
                if (transformY.value) {
                    if (transformY.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformY.style.borderColor = ""; else transformY.style.borderColor = "rgba(200, 0, 0, 0.75)";
                    save = true;
                    objectArray[objId].data.position[1] = transformY.value;
                }
            }
        });
        if (transformY.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformY.style.borderColor = ""; else transformY.style.borderColor = "rgba(200, 0, 0, 0.75)";
    
        inspectorSidebar.append(transformXYLabel);
        inspectorSidebar.append(transformX);
        inspectorSidebar.append(transformY);

        const transformW = document.createElement("input");
        const transformH = document.createElement("input");
        const transformWHLabel = document.createElement("p");
        await setAttrs(transformWHLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Scale"
        });
        await setAttrs(transformW, {
            "value":obj.data.width,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Width",
            "oninput":() => {
                if (transformW.value) {
                    if (transformW.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformW.style.borderColor = ""; else transformW.style.borderColor = "rgba(200, 0, 0, 0.75)";
                    save = true;
                    objectArray[objId].data.width = transformW.value;
                }
            }
        });
        if (transformW.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformW.style.borderColor = ""; else transformW.style.borderColor = "rgba(200, 0, 0, 0.75)";
        await setAttrs(transformH, {
            "value":obj.data.height,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Height",
            "oninput":() => {
                if (transformH.value) {
                    if (transformH.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformH.style.borderColor = ""; else transformH.style.borderColor = "rgba(200, 0, 0, 0.75)";
                    save = true;
                    objectArray[objId].data.height = transformH.value;
                }
            }
        });
        if (transformH.value.match(/^(?=.*\d)[\d.\-%]+$/g)) transformH.style.borderColor = ""; else transformH.style.borderColor = "rgba(200, 0, 0, 0.75)";
        const sizeLabel = document.createElement("p");
        await setAttrs(sizeLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Size"
        });
        const sizeInput = document.createElement("input");
        const sizeValue = obj.data.size || 16
        await setAttrs(sizeInput, {
            "value":sizeValue,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Size",
            "oninput":() => {
                if (sizeInput.value) {
                    if (sizeInput.value.match(/^(?=.*\d)[\d.\-%]+$/g)) sizeInput.style.borderColor = ""; else sizeInput.style.borderColor = "rgba(200, 0, 0, 0.75)";
                    save = true;
                    objectArray[objId].data.size = sizeInput.value;
                }
            }
        })
        if (sizeInput.value.match(/^(?=.*\d)[\d.\-%]+$/g)) sizeInput.style.borderColor = ""; else sizeInput.style.borderColor = "rgba(200, 0, 0, 0.75)";
        if (obj.type.toLowerCase() !== "text") {
            inspectorSidebar.append(transformWHLabel);
            inspectorSidebar.append(transformW);
            inspectorSidebar.append(transformH);
        } else {
            inspectorSidebar.append(sizeLabel);
            inspectorSidebar.append(sizeInput)
        }
        
    
        const type = document.createElement("input");
        const typeLabel = document.createElement("p");
        await setAttrs(typeLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Type"
        });
        await setAttrs(type, {
            "value":obj.type,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "oninput":() => {
                if (type.value) {
                    if (validObjTypes.includes(type.value.toLowerCase())) type.style.borderColor = ""; else type.style.borderColor = "rgba(200, 0, 0, 0.75)";
                    save = true;
                    objectArray[objId].type = type.value;
                }
            }
        });
        inspectorSidebar.append(typeLabel);
        inspectorSidebar.append(type);
        const texturePath = document.createElement("input");
        const fillInput = document.createElement("input");
        const outlineInput = document.createElement("input");
        const outlineWidthInput = document.createElement("input");
        const textureLabel = document.createElement("p");
        const textValueInput = document.createElement("input");
        const fontInput = document.createElement("input");
        await setAttrs(textureLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Texture"
        });
        await setAttrs(texturePath, {
            "value":obj.data.texture,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Texture path",
            "oninput":async() => {
                objectArray[objId].data.texture = texturePath.value;
                save = true;
                await new Promise(resolve => setTimeout(resolve, 17));
                if (!imageCache[texturePath.value]?.src.startsWith("https://") || !texturePath.value) texturePath.style.border = ""; else texturePath.style.borderColor = "rgba(200, 0, 0, 0.75)";
            }
        });
        await setAttrs(textValueInput, {
            "value":obj.data.value,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Text value",
            "oninput":async() => {
                objectArray[objId].data.value = textValueInput.value;
                save = true;
            }
        });
        await setAttrs(fontInput, {
            "value":obj.data.font,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Text font",
            "oninput":async() => {
                objectArray[objId].data.font = fontInput.value;
                save = true;
                if (fontInput.value) {
                    await new Promise(resolve => setTimeout(resolve, 17));
                    if (loadedFonts[fontInput.value]) fontInput.style.border = ""; else fontInput.style.borderColor = "rgba(200, 0, 0, 0.75)";
                }
                
            }
        });
        if (!obj.data.texture) texturePath.value = "";
        if (!obj.data.value) textValueInput.value = "";
        if (!obj.data.font) fontInput.value = "";
        if (!imageCache[texturePath.value]?.src.startsWith("https://") || !texturePath.value) texturePath.style.border = ""; else texturePath.style.borderColor = "rgba(200, 0, 0, 0.75)";
        await setAttrs(fillInput, {
            "value":obj.data.fill,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Fill color",
            "oninput":() => {
                objectArray[objId].data.fill = fillInput.value;
                save = true; 
            }
        });
        await setAttrs(outlineInput, {
            "value":obj.data.outlineColor,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Outline color",
            "oninput":() => {
                objectArray[objId].data.outlineColor = outlineInput.value;
                save = true; 
            }
        });
        await setAttrs(outlineWidthInput, {
            "value":obj.data.outlineWidth,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Outline width",
            "oninput":() => {
                objectArray[objId].data.outlineWidth = outlineWidthInput.value;
                save = true; 
            }
        });
        if (!obj.data.outlineColor) outlineInput.value = "";
        if (!obj.data.outlineWidth) outlineWidthInput.value = "";
        if (!obj.data.fill) fillInput.value = "";
        if (obj.type.toLowerCase() !== "node") {
            inspectorSidebar.append(textureLabel);
        }
        if (obj.type?.toLowerCase() === "image") {
            inspectorSidebar.append(texturePath);
        } else if (obj.type?.toLowerCase() === "text") {
            textureLabel.textContent = "Text"
            inspectorSidebar.append(textValueInput);
            inspectorSidebar.append(fillInput);
            inspectorSidebar.append(outlineInput);
            inspectorSidebar.append(outlineWidthInput);
            inspectorSidebar.append(fontInput);
        } else if (obj.type?.toLowerCase() === "node") {} else {
            inspectorSidebar.append(fillInput);
        }
        const layerInput = document.createElement("input");
        const layerLabel = document.createElement("p");
        await setAttrs(layerLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Layer"
        });
        await setAttrs(layerInput, {
            "value":obj.data.layer,
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Object layer",
            "oninput":() => {
                if (layerInput.value) {
                    objectArray[objId].data.layer = layerInput.value;
                    save = true; 
                }
            }
        });
        if (obj.type?.toLowerCase() !== "node") {
            inspectorSidebar.append(layerLabel);
            inspectorSidebar.append(layerInput);
        }
        const scriptAddInput = document.createElement("input");
        const scriptDiv = document.createElement("div");
        const scriptLabel = document.createElement("p");
        await setAttrs(scriptLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Scripts"
        });
        if (objectArray[objId]?.scripts) {
            for (const script of objectArray[objId].scripts) {
                const div = document.createElement("div");
                await setAttrs(div, {
                    "class":"primary",
                    "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block; position: relative; border-radius: 0.5em;",
                    "textContent":script
                });
                const deleteButton = document.createElement("button");
                await setAttrs(deleteButton, {
                    "style":"background-color: transparent; border-style: none; margin: 0; padding: 0; position: absolute; top: 50%; right: 0.5em; transform: translateY(-50%);",
                    "textContent":"x",
                    "onclick":() => {
                        const i = objectArray[objId]?.scripts.indexOf(script);
                        if (i !== -1) {
                            objectArray[objId]?.scripts.splice(i, 1);
                        }
                        save = true;
                        div.remove();
                    }
                });
                div.append(deleteButton);
                scriptDiv.append(div);
            }
        }
        await setAttrs(scriptAddInput, {
            "value":"",
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block;",
            "placeholder":"Type a script path here to add",
            "onkeyup":async(e) => {
                if (scriptAddInput.value) {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    save = true;
                    const script = scriptAddInput.value;
                    objectArray[objId]?.scripts.push(script);
                    scriptAddInput.value = "";
                    const div = document.createElement("div");
                    await setAttrs(div, {
                        "class":"primary",
                        "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block; position: relative; border-radius: 0.5em;",
                        "textContent":script
                    });
                    
                    const deleteButton = document.createElement("button");
                    await setAttrs(deleteButton, {
                        "style":"background-color: transparent; border-style: none; margin: 0; padding: 0; position: absolute; top: 50%; right: 0.5em; transform: translateY(-50%);",
                        "textContent":"x",
                        "onclick":() => {
                            const i = objectArray[objId]?.scripts.indexOf(script);
                            if (i !== -1) {
                                objectArray[objId]?.scripts.splice(i, 1);
                            }
                            save = true;
                            div.remove();
                        }
                    });
                    div.append(deleteButton);
                    scriptDiv.append(div);
                }
            }
        });
        inspectorSidebar.append(scriptLabel);
        inspectorSidebar.append(scriptDiv);
        inspectorSidebar.append(scriptAddInput);
        const createChild = document.createElement("button");
        const del = document.createElement("button");
        const optionsLabel = document.createElement("p");
        await setAttrs(optionsLabel, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":"Options"
        });
        await setAttrs(createChild, {
            "textContent":"Create child element",
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block; margin-bottom: 1.5em;",
            "onclick":() => {
                objectArray.push({
                    "child":obj.id,
                    "name":"Node",
                    "type":"Node",
                    "id":objectArray.length,
                    "data":{
                        "width":"100",
                        "height":"100",
                        "fill":"#ffffff",
                        "position":[0, 0],
                        "layer":"0"
                    },
                    "children":[]
                });
                obj.children.push(objectArray.length - 1);
            }
        })
        await setAttrs(del, {
            "textContent":"Delete element",
            "style":"width: calc(100% - 2.25em); padding: 0.5em; margin: 0.5em auto; display: block; color: rgba(200, 0, 0, 0.75); margin-bottom: 1.5em;",
            "onclick":() => {
                if (obj.child) { 
                    const i = objectArray[Number(obj.child)].children.indexOf(Number(objId));
                    if (i !== -1) objectArray[Number(obj.child)].children.splice(i, 1);
                }
                if (obj.children) {
                    for (const child of obj.children) {
                        objectArray.splice(child.id, 1);
                    }
                }
                objectArray.splice(objId, 1);
                fileTree.children[objId].remove();
                decreaseHigherIds(objId);
                save = true;
                inspectorSidebar.innerHTML = "";
            }
        });
        inspectorSidebar.append(optionsLabel);
        inspectorSidebar.append(del);
    }
    async function saveHandler() {
        while (true) {
            while (!save) {
                await new Promise(resolve => setTimeout(resolve, 250));
            }

            await huopaAPI.setTitle(`HuopaEngine - ${projName} •`);

            const handler = async (e) => {
                if (e.code === "KeyS" && (e.altKey || e.metaKey || e.ctrlKey)) {
                    if (!save) return;
                    save = false;
                    e.preventDefault();
                    await huopaAPI.setTitle(`HuopaEngine - ${projName}`);
                    projectData.objects = objectArray;
                    await huopaAPI.writeFile(projPath, "file", JSON.stringify(projectData));
                    document.removeEventListener("keydown", handler);
                } else {
                }
            };

            document.addEventListener("keydown", handler);

        }
    }
    let canvasCenterX;
    let canvasCenterY;
    let sortedObjArr;
    async function canvasPosUpdater() {
        while (true) {
            const emSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const targetWidth = projectData.preferences.screenWidth;
            const targetHeight = projectData.preferences.screenHeight;
            canvasContainer.style.width = window.innerWidth - emSize * 30 + "px";
            projectCanvas.width = targetWidth;
            projectCanvas.style.width = "100%";
            if (Number(projectCanvas.style.height.replace("px","")) < Number(canvasContainer.style.width.replace("px",""))) {
                const height = canvasContainer.style.width.replace("px","") * targetHeight / targetWidth;
                if (height > window.innerHeight) {
                    projectCanvas.style.width = window.innerHeight * targetWidth / targetHeight + "px";
                }
            } else {
                if (Number(canvasContainer.style.width.replace("px","")) > window.innerHeight) {
                    projectCanvas.style.width = window.innerHeight + "px";
                }
            }
            
        
            
            projectCanvas.height = targetHeight;
            canvasCenterY = projectCanvas.height / 2;
            canvasCenterX = projectCanvas.width / 2;
            objectRenderer();
            await new Promise(resolve => setTimeout(resolve, 16));
        }
    }
    saveHandler();
    const ctx = projectCanvas.getContext("2d");
    canvasPosUpdater();
    if (!projectData.preferences.antiAliasing) {
        ctx.imageSmoothingEnabled = false;
        projectCanvas.style.imageRendering = "pixelated";
    }
    let loadedFonts = {}
    objectRenderer();

    async function objectRenderer() {
        sortedObjArr = [...objectArray].sort((a, b) => {
            const la = Number(a?.data?.layer ?? 0);
            const lb = Number(b?.data?.layer ?? 0);
            return la - lb;
        });

        for (const elIdx in sortedObjArr) {
            await renderObjectId(elIdx)
        }
    }

    async function renderObjectId(id) {
        const el = sortedObjArr[id];
        if (!el || el.id == null) return;

        let posX = Number(convertCustomValsToPx(el.data.position[0], "w"));
        let posY = Number(convertCustomValsToPx(el.data.position[1], "h"));

        let w = Number(convertCustomValsToPx(el.data.width ?? 0, "w"));
        let h = Number(convertCustomValsToPx(el.data.height ?? 0, "h"));

        if (el.child) {
            const parent = objectArray[el.child];
            if (parent) {
                posX += Number(convertCustomValsToPx(parent.data.position[0], "w"));
                posY += Number(convertCustomValsToPx(parent.data.position[1], "h"));

                w *= Number(convertCustomValsToPx(parent.data.width ?? 0, "w")) / 100;
                h *= Number(convertCustomValsToPx(parent.data.height ?? 0, "h")) / 100;
            }
        }

        switch (el.type?.toLowerCase()) {
            case "square": {
                ctx.fillStyle = el.data.fill || "#00000000";
                ctx.fillRect(posX + canvasCenterX - w / 2, posY + canvasCenterY - h / 2, w, h);
                break;
            }
            case "image": {
                if (el.data.texture) {
                    if (!imageCache[el.data.texture]) {
                        await addImgToCache(el.data.texture);
                    }
                    const img = imageCache[el.data.texture];
                    if (img.complete && img.naturalWidth > 0) {
                        let iw, ih;
                        if (img.naturalWidth < img.naturalHeight) {
                            ih = Math.abs(h);
                            let offset = img.naturalHeight / img.naturalWidth;
                            iw = Math.abs(w) / offset;
                        } else {
                            iw = Math.abs(w);
                            let offset = img.naturalWidth / img.naturalHeight;
                            ih = Math.abs(h) / offset;
                        }

                        const x = posX + canvasCenterX;
                        const y = posY + canvasCenterY;

                        ctx.save();
                        ctx.translate(x, y);
                        ctx.scale(w < 0 ? -1 : 1, h < 0 ? -1 : 1);
                        ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
                        ctx.restore();
                    }
                }
                break;
            }
            case "text": {
                const font = el.data.font || "sans-serif";
                let customFontLoaded = false;
                let customFontName;
                if (/\.(woff2?|ttf)$/i.test(font)) {
                    customFontLoaded = true;
                    if (!loadedFonts[font]) {
                        await loadFont(font);
                    } else customFontName = loadedFonts[font];
                }
                ctx.textAlign = "center";
                const fontSize = el.data.size || "16";
                if (customFontLoaded) {
                    ctx.font = `${fontSize}px '${customFontName}'`;
                } else {
                    ctx.font = `${fontSize}px ${font}`;
                }

                ctx.fillStyle = el.data.fill || "#ffffff";
                ctx.strokeStyle = el.data.outlineColor || "#ffffff";
                ctx.lineWidth = el.data.outlineWidth || 0;

                ctx.fillText(el.data.value, posX + canvasCenterX, posY + canvasCenterY);
                if (el.data.outlineWidth > 0) {
                    ctx.strokeText(el.data.value, posX + canvasCenterX, posY + canvasCenterY);
                }
                break;
            }
        }

        if (el.children) {
            for (const child of el.children) {
                await renderObjectId(child);
            }
        }
    }
    function convertCustomValsToPx(numVal, axis) {
        const val = numVal.toString()
        if (val.endsWith("%")) {
            if (axis === "w") {
                return Number((val.replace("%","") / 100) * projectCanvas.width);
            } else if (axis === "h") {
                return Number((val.replace("%","") / 100) * projectCanvas.height);
            }
            console.log("[HuopaEngine Editor]: Unknown axis value");
            return numVal;
        } else if (val.endsWith("px")) {
            return Number(val.replace("px", ""));
        }
        return numVal;
    }

    async function addImgToCache(path) {
        if (imageCache[path]) return;
        
        return new Promise(async (resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            const file = await huopaAPI.getFile(`${projPath.split("/").slice(0, -1).join("/")}/${path}`);
            img.src = file;
            imageCache[path] = img;
            
        });
    }
    async function loadFont(path) {
        const file = await huopaAPI.getFile(`${projPath.split("/").slice(0, -1).join("/")}/${path}`);
        loadedFonts[path] = await getFontNameFromBase64(file)
        const el = document.createElement("link");
        await setAttrs(el, {
            "rel":"stylesheet",
            "href":file
        })
        document.head.append(el);
    }

    async function decreaseHigherIds(id) {
        for (const objI in objectArray) {
            const obj = objectArray[objI];
            if (Number(obj.id) > Number(id)) {
                objectArray[objI].id = (Number(objectArray[objI].id) - 1).toString()
            }
        }
    }
    
    function base64ToUint8Array(dataUri) {
        const base64 = dataUri.replace(/^data:.*;base64,/, '').trim();
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    async function getFontNameFromBase64(base64) {
        try {
            const uint8 = base64ToUint8Array(base64);
            const font = opentype.parse(uint8.buffer);
            return font.names.fontFamily.en;
        } catch (error) {
            return;
        }
    }
    let embedFileId = 0;
    async function compileApp(build = false) {
        embedFileId = 0;
        const parent = (projPath.split("/").slice(0, -1).join("/"))
        const embedFileAmount = JSON.parse(await huopaAPI.getFile(parent)).length;
        const parentFiles = JSON.parse(await huopaAPI.getFile(parent));
        let files = {};
        if (projectData.preferences.embedFiles && build) {
            const fileAmount = embedFileAmount;
            for (let i = 0; i < fileAmount; i++) {
                if (parentFiles[i].replace(parent + "/","") === "project.json") continue;
                files[parentFiles[i].replace(parent + "/","")] = await huopaAPI.getFile(parentFiles[i]);
            }
        }
        let code = `
// Setup



let files;
const compiled = ${build};
const imageCache = {};
const projectData = ${JSON.stringify(projectData)};
let embedFiles = false;
if (compiled) embedFiles = projectData.preferences.embedFiles;

if (embedFiles) files = ${JSON.stringify(files)}
let objectArray = projectData?.objects;
let objDepth = 0;
const projPath = ${JSON.stringify(projPath)}
await huopaAPI.setTitle(${JSON.stringify(projName)});
let canvasCenterX;
let canvasCenterY;
const canvasContainer = document.createElement("div");
const projectCanvas = document.createElement("canvas");
await setAttrs(canvasContainer, {
    "style":"position: absolute; left: 0em; top: 0; overflow: hidden; height: 100%;"
});

await setAttrs(projectCanvas, {
    "style":"transform: translate(-50%, calc(-50%)); position: absolute; left: 50%; top: 50%;"
});
document.body.append(canvasContainer);
canvasContainer.append(projectCanvas);
const ctx = projectCanvas.getContext("2d");
if (!projectData.preferences.antiAliasing) {
    ctx.imageSmoothingEnabled = false;
    projectCanvas.style.imageRendering = "pixelated";
}
if (projectData?.preferences?.hideTitlebar) await huopaAPI.removeTitlebar();
const opentypeEl = document.createElement("script");
await setAttrs(opentypeEl, {
    "src":"https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js"
});

let collisions = {};

document.body.append(opentypeEl)
// Running scripts
const globalVars = {}
let loadedFonts = [];
for (const obj of objectArray) {
    if (obj.id == null) continue;
    runScriptsFromId(obj.id)
}

// Rendering
let sortedObjArr;

async function objectRenderer() {
    sortedObjArr = [...objectArray].sort((a, b) => {
        const la = Number(a?.data?.layer ?? 0);
        const lb = Number(b?.data?.layer ?? 0);
        return la - lb;
    });

    for (const elIdx in sortedObjArr) {
        await renderObjectId(elIdx)
    }
}

async function renderObjectId(id) {
    const el = sortedObjArr[id];
    if (!el || el.id == null) return;

    let posX = Number(convertCustomValsToPx(el.data.position[0], "w"));
    let posY = Number(convertCustomValsToPx(el.data.position[1], "h"));

    let w = Number(convertCustomValsToPx(el.data.width ?? 0, "w"));
    let h = Number(convertCustomValsToPx(el.data.height ?? 0, "h"));

    if (el.child) {
        const parent = objectArray[el.child];
        if (parent) {
            posX += Number(convertCustomValsToPx(parent.data.position[0], "w"));
            posY += Number(convertCustomValsToPx(parent.data.position[1], "h"));

            w *= Number(convertCustomValsToPx(parent.data.width ?? 0, "w")) / 100;
            h *= Number(convertCustomValsToPx(parent.data.height ?? 0, "h")) / 100;
        }
    }
    switch (el.type?.toLowerCase()) {
        case "square":{
            ctx.fillStyle = el.data.fill || "#00000000";
            ctx.fillRect(posX + canvasCenterX - w / 2, posY + canvasCenterY - h / 2, w, h);
            collisions[el.id] = [
                posX + canvasCenterX - w / 2,
                posY + canvasCenterY - h / 2,
                posX + canvasCenterX + w / 2,
                posY + canvasCenterY + h / 2
            ];
            break;
        }
        case "image": {
            if (el.data.texture) {
                if (!imageCache[el.data.texture]) {
                    await addImgToCache(el.data.texture);
                }
                const img = imageCache[el.data.texture];
                if (img.complete && img.naturalWidth > 0) {
                    let iw, ih;
                    if (img.naturalWidth < img.naturalHeight) {
                        ih = Math.abs(h);
                        let offset = img.naturalHeight / img.naturalWidth;
                        iw = Math.abs(w) / offset;
                    } else {
                        iw = Math.abs(w);
                        let offset = img.naturalWidth / img.naturalHeight;
                        ih = Math.abs(h) / offset;
                    }

                    const x = posX + canvasCenterX;
                    const y = posY + canvasCenterY;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.scale(w < 0 ? -1 : 1, h < 0 ? -1 : 1);
                    ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
                    ctx.restore();
                    collisions[el.id] = [x - iw / 2, y - ih / 2, x + iw / 2, y + ih / 2];
                }
                
            } else {
                collisions[el.id] = [];
            }
            break;
        }


        case "text":{
            collisions[el.id] = [];
            const font = el.data.font || "sans-serif";
            let customFontLoaded = false;
            let customFontName;
            if (/\.(woff2?|ttf)$/i.test(font)) {
                customFontLoaded = true;
                if (!loadedFonts[font]) {
                    await loadFont(font);
                } else customFontName = loadedFonts[font];
            }
            ctx.textAlign = "center";
            const fontSize = el.data.size || "16"
            if (customFontLoaded) {
                ctx.font = \`\${fontSize}px '\${customFontName}'\`;
            } else {
                ctx.font = \`\${fontSize}px \${font}\`;
            }

            ctx.fillStyle = el.data.fill || "#ffffff";
            ctx.strokeStyle = el.data.outlineColor || "#ffffff";
            ctx.lineWidth = el.data.outlineWidth || 0;
            ctx.fillText(el.data.value, posX + canvasCenterX, posY + canvasCenterY);
            if (el.data.outlineWidth > 0) {
                ctx.strokeText(el.data.value, posX + canvasCenterX, posY + canvasCenterY);
            }
            break;
        }

    }
    if (el.children) {
        for (const child of el.children) {
            await renderObjectId(child);
        }
    }
}
while (true) {
    const emSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const targetWidth = projectData.preferences.screenWidth;
    const targetHeight = projectData.preferences.screenHeight;
    canvasContainer.style.width = window.innerWidth + "px";
    projectCanvas.width = targetWidth;
    projectCanvas.style.width = "100%";

    if (Number(projectCanvas.style.height.replace("px","")) < Number(canvasContainer.style.width.replace("px",""))) {
        const height = canvasContainer.style.width.replace("px","") * targetHeight / targetWidth;
        if (height > window.innerHeight) {
            projectCanvas.style.width = window.innerHeight * targetWidth / targetHeight + "px";
        }
    } else {
        if (Number(canvasContainer.style.width.replace("px","")) > window.innerHeight) {
            projectCanvas.style.width = window.innerHeight + "px";
        }
    }

    collisions.length = 0;

    
    projectCanvas.height = targetHeight;
    canvasCenterY = projectCanvas.height / 2;
    canvasCenterX = projectCanvas.width / 2;
    await objectRenderer()

    await new Promise(resolve => setTimeout(resolve, 16));
    
}

function convertCustomValsToPx(numVal, axis) {
    const val = numVal.toString()
    if (val.endsWith("%")) {
        if (axis === "w") {
            return Number((val.replace("%","") / 100) * projectCanvas.width);
        } else if (axis === "h") {
            return Number((val.replace("%","") / 100) * projectCanvas.height);
        }
        console.log("[HuopaEngine Compiled]: Unknown axis value");
        return numVal;
    } else if (val.endsWith("px")) {
        return Number(val.replace("px", ""));
    }
    return numVal;
}

async function addImgToCache(path) {
    if (imageCache[path]) return;
    
    return new Promise(async (resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        let file;
        if (embedFiles) {
            file = files[path];
        } else if (compiled) {
            file = await huopaAPI.applicationStorageRead(path);
        } else {
            file = await huopaAPI.getFile(\`\${projPath.split("/").slice(0, -1).join("/")}/\${path}\`)
        }
        
        img.src = file;
        imageCache[path] = img;
        
    });
}

async function loadFont(path) {
    let file;
    if (embedFiles) {
        file = files[path];
    } else if (compiled) {
        file = await huopaAPI.applicationStorageRead(path);
    } else {
        file = await huopaAPI.getFile(\`\${projPath.split("/").slice(0, -1).join("/")}/\${path}\`);
    }
    loadedFonts[path] = await getFontNameFromBase64(file)
    const el = document.createElement("link");
    await setAttrs(el, {
        "rel":"stylesheet",
        "href":file
    })
    document.head.append(el);
}

function base64ToUint8Array(dataUri) {
    const base64 = dataUri.replace(/^data:.*;base64,/, '').trim();
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

async function getFontNameFromBase64(base64) {
    try {
        const uint8 = base64ToUint8Array(base64);
        const font = opentype.parse(uint8.buffer);
        return font.names.fontFamily.en;
    } catch (error) {
        return;
    }
}
        
// Script handling

async function runScriptsFromId(id) {
    const scripts = objectArray[id].scripts;
    if (scripts) {
        const parent = (projPath.split("/").slice(0, -1).join("/"));
        for (const scriptPath of scripts) {
            let data;
            if (embedFiles) {
                data = files[scriptPath];
            } else if (compiled) {
                data = await huopaAPI.applicationStorageRead(scriptPath)
            } else {
                data = await huopaAPI.getFile(\`\${parent}/\${scriptPath}\`);
            }
            if (!data) continue;
            const gameScene = () => {
                return {
                    createObject: (type, fill = "#00000000", childOf) => {
                        objectArray.push({
                            "child":childOf,
                            "name":type,
                            "type":type,
                            "id":objectArray.length,
                            "data":{
                                "width":"100",
                                "height":"100",
                                "fill":fill,
                                "position":[0, 0],
                                "layer":"0"
                            },
                            "children":[]
                        });
                        
                        return objectArray.length - 1;
                    },

                    getObject: (id) => {
                        return objectArray[id]
                    },

                    deleteObject: (id) => {
                        objectArray.splice(id, 1);
                    },

                    get: (name) => {
                        return globalVars[name];
                    },

                    set: (name, val) => {
                        globalVars[name] = val;
                    },

                    isColliding: (id1, id2) => {
                        let [l1, b1, r1, t1] = collisions[Number(id1)];
                        let [l2, b2, r2, t2] = collisions[Number(id2)];

                        if (l1 > r1) [l1, r1] = [r1, l1];
                        if (b1 > t1) [b1, t1] = [t1, b1];
                        if (l2 > r2) [l2, r2] = [r2, l2];
                        if (b2 > t2) [b2, t2] = [t2, b2];

                        if (r1 < l2) return false;
                        if (l1 > r2) return false;
                        if (t1 < b2) return false;
                        if (b1 > t2) return false;

                        return true;
                    }

                }
            }
            const toRun = JSON.stringify(data);
            const func = new Function("objectArray", "globalVars", "collisions", "(async() => { const gameScene = (" + gameScene.toString() + ")(); " + "eval(" + toRun + ") })()");
            func(objectArray, globalVars, collisions);
            
        }
    }
}


        `;
        if (build) {
            const path = await huopaAPI.openSaveDialog("/home/applications/" + projName + ".js");
            const parent = (projPath.split("/").slice(0, -1).join("/"))
            if (!await huopaAPI.getFile(parent)) { huopaAPI.createNotification("Invalid build location!", "Choose a path with a valid parent directory!"); return; }
            if (!projectData.preferences.embedFiles) {
                for (const file of JSON.parse(await huopaAPI.getFile(parent))) {
                    const filename = file.replace(projPath.split("/").slice(0, -1).join("/") + "/", "");
                    if (filename === "project.json") continue;
                    await huopaAPI.writeFile(`/system/applicationStorage/${path.split("/").pop().replace(".js","")}/${filename}`, "file", await huopaAPI.getFile(parent + `/${filename}`));
                }
            }
            
            await huopaAPI.writeFile(path, "file", code);
            await huopaAPI.runApp(path);
            huopaAPI.createNotification("App compiled successfully!", "The app can be found at: " + path);
        } else {
            await huopaAPI.deleteFile("/system/temp/HuopaEngine");
            const path = `/system/temp/HuopaEngine/${crypto.randomUUID().slice(0, 8)}`;
            const parent = (projPath.split("/").slice(0, -1).join("/"))
            for (const file of JSON.parse(await huopaAPI.getFile(parent))) {
                const filename = file.replace(projPath.split("/").slice(0, -1).join("/") + "/", "");
                if (filename === "project.json") continue;
                await huopaAPI.writeFile(`${path}/${filename}`, "file", await huopaAPI.getFile(parent + `/${filename}`));
            }
            await huopaAPI.writeFile(`${path}/main.js`, "file", code);
            await huopaAPI.runApp(`${path}/main.js`);
        }
        
    }
}
