let code;
let path = loadParams;
if (path) {
    code = await huopaAPI.getFile(path);
    await huopaAPI.setTitle(`Code — ${path.split("/").pop()}`);
} else {
    await huopaAPI.setTitle("Code");
}

const editor = document.createElement("div");
document.body.style.margin = "0";
document.body.style.height = "100vh";
let monacoEditor
editor.style = "width: 100%; height: 100%;";
editor.id = "editor";
document.body.append(editor);
const script = document.createElement("script");
script.src = "https://unpkg.com/monaco-editor@latest/min/vs/loader.js";
const huopaAPISpellcheck = await huopaAPI.applicationStorageRead("huopa.d.ts");
let chosenTheme;
const testEl = document.createElement("div");
await setAttrs(testEl, {"class":"primary", "style":"display: none;"});
document.body.append(testEl)
requestAnimationFrame(() => {
    const bgColor = getComputedStyle(testEl).backgroundColor;
    testEl.remove();
    if (isDarkColor(bgColor)) {
        chosenTheme = "vs-dark"
    } else {
        chosenTheme = "vs"
    }

    script.onload = () => {
        require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            if (path?.match(/\.\w{1,10}$/)) {
                const lang = getLanguageFromExtension(path);
                monacoEditor = monaco.editor.create(document.getElementById('editor'), {
                    value: code,
                    language: lang,
                    theme: chosenTheme,
                    wordWrap: 'on'
                });
            } else {
                monacoEditor = monaco.editor.create(document.getElementById('editor'), {
                    value: code,
                    theme: chosenTheme,
                    wordWrap: 'on'
                });
            }
            
            window.addEventListener('resize', () => {
                monacoEditor.layout();
            });
            if (chosenTheme === "vs-dark") {
                monaco.editor.defineTheme('transparent-theme', {
                    base: chosenTheme,
                    inherit: true,
                    rules: [],
                    colors: {
                        'editor.background': '#14141426',
                        'minimap.background': '#4a4a4a34'
                    }
                });
            } else {
                monaco.editor.defineTheme('transparent-theme', {
                    base: chosenTheme,
                    inherit: true,
                    rules: [],
                    colors: {
                        'editor.background': '#ffffff26',
                        'minimap.background': '#d4d4d434'
                    }
                });
            }

            monaco.editor.setTheme('transparent-theme');

            monaco.languages.typescript.javascriptDefaults.addExtraLib(huopaAPISpellcheck);
            monaco.languages.typescript.typescriptDefaults.addExtraLib(huopaAPISpellcheck);
        });
    };
})
document.body.appendChild(script);

document.body.addEventListener("keydown", async(e) => {
    if (e.code === "KeyS") {
        if (e.altKey || e.metaKey || e.ctrlKey) {
            e.preventDefault();
            code = monacoEditor.getValue();
            if (path) {
                huopaAPI.writeFile(path, "file", code)
            } else {
                path = await huopaAPI.openSaveDialog();
                if (path) {
                    huopaAPI.writeFile(path, "file", code)
                    const model = monacoEditor.getModel();
                    const lang = getLanguageFromExtension(path);
                    monaco.editor.setModelLanguage(model, lang);
                    await huopaAPI.setTitle(`Code — ${path.split("/").pop()}`);
                }
            }
        }
        
    }
})

function getLanguageFromExtension(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    js: 'javascript',
    ts: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    md: 'markdown'
  };
  return map[ext] || 'plaintext';
}

function colorToRGB(color) {
    let ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    let computed = ctx.fillStyle;

    let rgbMatch = computed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (rgbMatch) {
        return [
            parseInt(rgbMatch[1]),
            parseInt(rgbMatch[2]),
            parseInt(rgbMatch[3])
        ];
    }
    throw new Error(`Could not parse color: ${color}`);
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
        .map(v => v.toString(16).padStart(2, "0"))
        .join("");
}

function isDarkColor(color) {
    let [r, g, b] = colorToRGB(color);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 150;
}

function normalizeToHex(color) {
    let [r, g, b] = colorToRGB(color);
    return rgbToHex(r, g, b);
}