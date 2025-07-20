let code;
let path = loadParams;
if (path) code = await huopaAPI.getFile(path);
const editor = document.createElement("div");
document.body.style.margin = "0";
document.body.style.height = "100vh";
let monacoEditor
editor.style = "width: 100%; height: 100%;";
editor.id = "editor";
document.body.append(editor);
const script = document.createElement("script");
script.src = "https://unpkg.com/monaco-editor@latest/min/vs/loader.js";
script.onload = () => {
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        if (path?.match(/\.\w{1,10}$/)) {
            monacoEditor = monaco.editor.create(document.getElementById('editor'), {
                value: code,
                language: path.split(".").pop(),
                theme: 'vs-dark'
            });
        } else {
            monacoEditor = monaco.editor.create(document.getElementById('editor'), {
                value: code,
                theme: 'vs-dark'
            });
        }
        
        window.addEventListener('resize', () => {
            monacoEditor.layout();
        });
        monaco.editor.defineTheme('transparent-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#00000000',
                'minimap.background': '#28282834'
            }
        });

        monaco.editor.setTheme('transparent-theme');
    });
};
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
                    const lang = getLanguageFromExtension(path);
                    monacoEditor.setModelLanguage(model, lang);
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