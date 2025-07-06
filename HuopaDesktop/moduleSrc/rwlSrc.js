// Made by Flufi (GH: @ThePandaDever)
// Ported to HuopaOS by @Allucat1000 (only really slight tweaks here)

function split(text, type, name) {
    let text2 = text.split("\n").filter(t => t !== "").join("\n");
    text = text.trim();
    const tokens = [];
    let current = "";

    let curlyDepth = 0,
        squareDepth = 0;
    let hasSplit = false;
    let inSingle = false,
        inDouble = false,
        inTick = false;
    
    const brackets = {"curly":["{","}"],"square":["[","]"]}[type] ?? ["",""]; // get the bracket pairs
    const open = brackets[0],
        close = brackets[1];
    const splitChar = type.length === 1 ? type : "";
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char == "\\") { current += char; continue; }

        if (char == "'" && !(inDouble || inTick))
            inSingle = !inSingle;
        if (char == "\"" && !(inSingle || inTick))
            inDouble = !inDouble;
        if (char == "`" && !(inSingle || inDouble))
            inTick = !inTick;

        const inQuotes = inSingle || inDouble || inTick;

        if (inQuotes) {
            current += char;
            continue;
        }

        if (char === "{")
            curlyDepth ++;
        if (char === "}")
            curlyDepth --;
        if (char === "[")
            squareDepth ++;
        if (char === "]")
            squareDepth --;
        
        if (char === open && curlyDepth == (type == "curly" ? 1 : 0) && squareDepth == (type == "square" ? 1 : 0) && !hasSplit) {
            tokens.push(current.trim());
            if (text[i+1] == close)
                tokens.push("");
            current = "";
            continue;
        }
        if (char === close && curlyDepth == 0 && squareDepth == 0 && !hasSplit) {
            hasSplit = true;
            continue;
        }

        if (char === splitChar && curlyDepth == 0 && squareDepth == 0) {
            tokens.push(current);
            current = "";
            continue;
        }

        if (hasSplit) {
            throw Error(`Unexpected text after ${name}: \n` + text.substring(i).trim().split("\n").map(t => "    " + t).join("\n") + "\nin:\n" + text2.split("\n").map(t => "    " + t).join("\n") + "\n");
        }

        current += char;
    }

    if (current) {
        tokens.push(current.trim());
    }

    return tokens;
}

const splitBlock = (text) => split(text, "curly", "block");
const splitHeader = (text) => split(text, "square", "header");
const splitSegment = (text) => split(text, ",");
const splitKey = (text) => split(text, "=");

const removeStr = (str) => str.replace(/\\(.)|["'`]/g, (_match, escaped) => escaped === 'n' ? '\n' : escaped || '');
const removeComments = (str) => str.replace(/(["'`])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g,((t,e)=>e?t:""))

class AstSegment {
    constructor(code = null) {
        this.elements = [];
        this.parse(code ?? "");
    }
    parse(code) {
        this.elements = splitSegment(removeComments(code)).map(n => new AstNode(n));
    }
    stringify() {
        return `Segment{${this.elements.map(n => n.stringify()).join(",")}}`
    }
    solve(frame, extData) {
        frame ??= Frame.zero();
        let lastEnt = null;
        return this.elements.map(e => {
            let solved = e.solve(frame, lastEnt, extData);
            lastEnt = e ? solved : lastEnt;
            return e ? solved : null;
        });
    }
    getPanel(frame) {
        return this.solve(frame).map(e => AstNode.getPanel(e, false));
    }
}

class Ast extends AstSegment {
    stringify() {
        return `Ast{${this.elements.map(n => n.stringify()).join(",")}}`
    }
}

class AstNode {
    constructor(code = null, data = null) {
        this.kind = "unknown";
        this.data = code;

        this.parse(code);
    }
    stringify() {
        return `Node<${this.kind}>{${{
            block: () => `header:${this.data.header.stringify()},contents:${this.data.content.stringify()}`,
            element: () => `header:${this.data.header.stringify("element")},value:${this.data.value.stringify()}`,
        }[this.kind]() ?? this.data.toString().trim()}}`
    }
    parse(code) {
        if (code.trim() === "") {
            this.kind = "empty";
            this.data = {};
            return;
        }
        
        const block = splitBlock(code);
        const header = new AstHeader(block[0]);
        /* block */ {
            if (block.length == 2) {
                const content = header.key === "script" ? new AstScriptSegment(block[1]) : new AstSegment(block[1]);
                this.kind = "block";
                this.data = {
                    header: header,
                    content: content
                };
                return;
            }
        }
        /* element */ {
            const value = new AstValue(header.key, null, code);
            this.kind = "element";
            this.data = {
                value: value,
                header: header
            };
            return;
        }
    }
    solve(frame, last, inData) {
        frame ??= Frame.zero();
        let data = {};
        const headerData = this.data.header.getData();
        if (this.data.content) {
            if (headerData.key === "script")
                return;
            let extData = undefined;
            if (headerData.key === "frame") {
                const Axes = [];
                for (let i = 0; i < headerData.flags.length; i++) {
                    const flag = headerData.flags[i];
                    if (["Horizontal","Vertical"].includes(flag)) {
                        Axes.push({"Horizontal":"x","Vertical":"y"}[flag])
                    } else {
                        throw Error("unexpected flag " + flag);
                    }
                }
                if (!Axes.length) Axes.push("x");
                extData = {"axes":Axes};
            }
            if (headerData.key === "section") {
                if (inData && inData["axes"]) {
                    const sizeP = AstValue.expect(["num","percentage"], headerData.data.size, null, "size");
                    const widthP = AstValue.expect(["num","percentage"], headerData.data.width, null, "width");
                    const heightP = AstValue.expect(["num","percentage"], headerData.data.height, null, "height");
                    
                    const fSize = frame.getSize();
                    const width = !inData["axes"].length ? sizeP : (inData["axes"].includes("x") ? (widthP ?? sizeP) : null);
                    const height = !inData["axes"].length ? sizeP : (inData["axes"].includes("y") ? (heightP ?? sizeP) : null);
                    const inFrame = frame.clone();
                    if (width && inData["axes"].includes("x")) {
                        let change = 0;
                        if (width.type == "num")
                            change = width.value;
                        if (width.type == "percentage")
                            change = (frame.b.x - frame.a.x) * (width.value * .01);
                        
                        inFrame.b.x = frame.a.x + change;
                        inFrame.update()
                        frame.a.x += change;
                        frame.update();
                    }
                    if (height && inData["axes"].includes("y")) {
                        let change = 0;
                        if (height.type == "num")
                            change = height.value;
                        if (height.type == "percentage")
                            change = (frame.b.y - frame.a.y) * (height.value * .01);
                        
                        inFrame.b.y = inFrame.a.y + change;
                        inFrame.update()
                        frame.a.y += change;
                        frame.update();
                    }

                    data["inFrame"] = inFrame;
                    data["frame"] = frame;


                    data["content"] = this.data.content.solve(inFrame, extData);
                    data["type"] = headerData.key;
                    data["flags"] = headerData.flags;
                    data["keys"] = headerData.data;

                    return data;
                } else {
                    throw Error("section outside frame");
                }
            }
            data["content"] = this.data.content.solve(frame, extData);
            data["type"] = headerData.key;
            data["flags"] = headerData.flags;
            data["keys"] = headerData.data;
        } else {
            const size = AstValue.expect("num", headerData.data.size, new AstValue("num",10), "size").value;
            const spacing = AstValue.expect("num", headerData.data.spacing, new AstValue("num",1), "spacing").value;
            const line_height = AstValue.expect("num", headerData.data.line_height, new AstValue("num",1), "line_height").value;
            const anchor = AstValue.expect("str", headerData.data.anchor, new AstValue("str","c"), "anchor").value;
            const alignment = AstValue.expect("str", headerData.data.alignment, new AstValue("str","c"), "alignment").value;
            const padding = AstValue.expect("num", headerData.data.padding, new AstValue("num",10), "padding").value;
            const isPositioned = headerData.data.anchor || headerData.data.padding;

            const text = this.data.value.format();
            const width = text.split("\n").reduce((max, str) => Math.max(max, str.length), 0) * size * spacing;
            const height = text.split("\n").length * size * 2.3 * line_height;

            const position = isPositioned || !(last && last["nextPos"]) ? this.getAlignment(alignment, frame.getAnchor(anchor, padding), new Vec2(width, height)) : last["nextPos"];
            data["position"] = position;
            data["data"] = this.data.value.toObj();
            data["size"] = size;
            data["width"] = width;
            data["height"] = height;
            data["line_height"] = line_height;
            const lines = AstValue.toStr(this.data.value).split("\n");
            const lineCount = lines.length;
            data["nextPos"] = new Vec2(position.x + (lines[lines.length-1].length) * size * spacing, position.y - ((lineCount - 1) * line_height * size * 2.3))
        }

        return data;
    }
    static getPanel(e, isntRoot = false) {
        if (e["data"]) {
            const data = AstValue.toStr(e.data);
            const lines = data.split("\n");
            const x = e.position.x - (e.width * .5);
            const panelLines = [];
            for (let i = 0; i < lines.length; i++) {
                const l = lines[i];
                panelLines.push({"id":"text","text":l,"pos":[x,e.position.y - (i * e.line_height * e.size * 2.3)],"size":e.size});
            }
            if (panelLines.length == 1) return panelLines[0];
            return {"id":"panel","panel":panelLines,"pos":[0,0],"size":1};
        }
        if (e["content"] && (!isntRoot || e.type === "root")) {
            return {"id":"panel","panel":e.content.map(e => AstNode.getPanel(e)),"pos":[0,0],"size":1};
        }
        return e;
    }


    getAlignment(alignmentName, position, size) {
        const alignment = AstNode.getAlignments()[alignmentName];
        if (!alignment) throw Error("unknown alignment \"" + alignmentName.toString() + "\"")
        position ??= Vec2.zero();
        size ??= Vec2.zero();
        return new Vec2(
            size.x * alignment.x * .5 + position.x,
            size.y * alignment.y * .5 + position.y
        );
    }
    
    static getAlignments() {
        return Object.fromEntries(
            Object.entries(Frame.getAnchors()).map(([key, value]) => [key, new Vec2(value.x * -1,value.y * -1)]) // Modify values as needed
        );
    }
}


class AstHeader {
    constructor(code = "") {
        this.attributes = [];
        this.parse(code);
    }
    parse(code) {
        const header = splitHeader(code);

        this.key = header[0];
        if (header.length == 2) {
            this.attributes = splitSegment(header[1]).map(a => new AstAttribute(a));
        }
    }
    stringify(type="block") {
        if (type === "element")
            return `Header${this.attributes.length > 0 ? "{" + this.attributes.map(a => a.stringify()).join(",") + "}" : ""}`;
        return `Header<${this.key}>${this.attributes.length > 0 ? "{" + this.attributes.map(a => a.stringify()).join(",") + "}" : ""}`;
    }
    getData() {
        let out = {"data":{},"flags":[],"key":this.key};
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes[i];
            if (attr["kind"] == "key")
                out["data"][attr["key"]] = attr["value"];
            if (attr["kind"] == "flag")
                out["flags"].push(attr["data"]);
        }
        return out;
    }
}

class AstAttribute {
    constructor(code = "") {
        this.parse(code);
    }
    parse(code) {
        const tokens = splitKey(code);

        /* key */ {
            if (tokens.length == 2) {
                this.kind = "key";
                this.key = tokens[0].trim();
                this.value = new AstValue(tokens[1], null, code);
                return;
            }
        }
        /* flag */ {
            if (/^[A-Za-z0-9_]+$/.test(code)) {
                this.kind = "flag";
                this.data = code;
                return;
            }
        }

        throw Error("Unknown attribute syntax: " + code);
    }
    stringify() {
        return `Attribute<${this.kind}>{${this.kind == "flag" ? this.data : this.kind == "key" ? this.key + "=" + this.value.stringify() : "?"}}`;
    }
}

class AstValue {
    constructor(code = "", value = null, code2 = null) {
        if (value) {
            this.type = code;
            this.value = value;
            return;
        }
        this.code = code2 ? code2 : code;
        this.parse(code.trim());
    }
    parse(code) {
        /* string */ {
            if (
                (code[0] === "\"" && code[code.length-1] === "\"") || 
                (code[0] === "'" && code[code.length-1] === "'") || 
                (code[0] === "`" && code[code.length-1] === "`")
            ) {
                this.type = "str";
                this.value = removeStr(code);
                return;
            }
        }
        
        /* number / percentage */ {
            const num = Number(code.replace("%",""));
            if (!isNaN(num)) {
                if (code[code.length-1] == "%") {
                    this.type = "percentage";
                    this.value = num;
                    return;
                } else {
                    this.type = "num";
                    this.value = num;
                    return;
                }
            }
        }

        /* color */ {
            if (code[0] == "#" && [4,7].includes(code.length)) {
                this.type = "color";
                this.value = code;
                return;
            }
        }
        
        /* property */ {
            if (/\w+:\w+/.test(code)) {
                const parts = code.match(/(\w+):(\w+)/);
                this.type = "property";
                this.source = parts[1];
                this.name = parts[2];
                return;
            }
        }

        throw Error("Unknown value syntax: " + code);
    }
    stringify() {
        if (this.type == "property") return `Property{source:${this.source},key:${this.name}}`;
        return `Value<${this.type}>${this.value ?? "" !== "" ? `{${({
            str: () => JSON.stringify(this.value),
            num: () => this.value.toString(),
            percentage: () => this.value.toString() + "%",
            color: () => this.value.toString()
        }[this.type] ?? (()=>null))()}}` : ""}`;
    }
    format() {
        return this.value.toString();
    }
    toObj() {
        return {type:this.type,value:this.value};
    }
    static toStr(v) {
        const type = v.type,
            value = v.value;
        return (
            type == "str" ? value :
            type == "num" ? value.toString() :
            "?"
        );
    }
    static expect(type,value,defaultValue,name) {
        return value ? ((Array.isArray(type) ? type.includes(value.type) : (value.type === type || type === "any")) ? value : (() => { throw Error(`expected ${Array.isArray(type) ? type.join(" or ") : type} got ${value.type} ${name ? `for ${name}` : ""} ${value.code ? `in ${value.code}` : ""}`) })()) : defaultValue;
    }
}

class AstScriptSegment {
    constructor(code = "") {
        this.data = code;
    }
    stringify() {
        return `Segment<Script>`;
    }
}

class Frame {
    constructor(a,b) {
        this.a = Vec2.toVec(a) ?? Vec2.zero();
        this.b = Vec2.toVec(b) ?? Vec2.zero();
        this.update();
    }
    update() {
        this.size = this.getSize();
    }

    getCenter() {
        return new Vec2((this.a.x + this.b.x) * .5, (this.a.y + this.b.y) * .5);
    }
    getSize() {
        return new Vec2(this.b.x - this.a.x, this.b.y - this.a.y);
    }

    clone() {
        return new Frame(
            new Vec2(this.a.x, this.a.y),
            new Vec2(this.b.x, this.b.y)
        )
    }

    getAnchor(anchorName, padding) {
        const anchor = Frame.getAnchors()[anchorName];
        if (!anchor) throw Error("unknown anchor \"" + anchorName.toString() + "\"")
        padding ??= 0;

        const vecPadding = new Vec2(anchor.x * padding, anchor.y * padding);
        const size = this.getSize();
        const position = this.getCenter();
        
        return new Vec2(
            size.x * anchor.x * .5 + position.x - vecPadding.x,
            size.y * anchor.y * .5 + position.y - vecPadding.y
        );
    }

    static zero() {
        return new Frame();
    }
    static getAnchors() {
        return {
            "top": new Vec2(0,1), "t": new Vec2(0,1),
            "bottom": new Vec2(0,-1), "b": new Vec2(0,-1),
            "left": new Vec2(-1,0), "l": new Vec2(-1,0),
            "right": new Vec2(1,0), "r": new Vec2(1,0),
            "top left": new Vec2(-1,1), "tl": new Vec2(-1,1),
            "top right": new Vec2(1,1), "tr": new Vec2(1,1),
            "bottom left": new Vec2(-1,-1), "bl": new Vec2(-1,-1),
            "bottom right": new Vec2(1,-1), "br": new Vec2(1,-1),
            "center": Vec2.zero(), "c": Vec2.zero(),
        };
    }
}
class Vec2 {
    constructor(x,y) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
    static toVec(v) {
        if (!v) return Vec2.zero();

        if (v instanceof Vec2)
            return v;
        if (Array.isArray(v))
            return new Vec2(v[0],v[1]);
        if (typeof v === "object")
            return new Vec2(v["x"],v["y"]);
        
        throw Error("cannot make " + typeof v + " a vec2: " + JSON.stringify(v));
    }
    static zero() {
        return new Vec2();
    }
}

class RWL {
    constructor (data) {
        if (typeof data !== "object" && Array.isArray(data)) data = {}

        const code = data["code"] ?? "";
        this.ast = new Ast(code);

        this.frame ??= data["frame"] ?? Frame.zero();

        //this.solved = this.solve(this.frame);
    }
    stringify() {
        return `RWL{ast:${this.ast.stringify()}}`;
    }
    getObject() {
        return JSON.parse(JSON.stringify(this));
    }
    solve(frame) {
        frame ??= this.frame;
        frame ??= Frame.zero();
        return this.ast.solve(frame);
    }
    getPanel(frame) {
        frame ??= this.frame;
        frame ??= Frame.zero();
        return this.ast.getPanel(frame);
    }
}

const code = injectedCode;


const rwl = new RWL({
    code: code,
    frame: new Frame(new Vec2(-100,-100), new Vec2(100,100))
})

export default { RWL, Frame, Vec2 }
export const parseData = { data:JSON.stringify(rwl.ast,null,"  ") }