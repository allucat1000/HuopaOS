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
script.onload = () => {
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        if (path?.match(/\.\w{1,10}$/)) {
            const lang = getLanguageFromExtension(path);
            monacoEditor = monaco.editor.create(document.getElementById('editor'), {
                value: code,
                language: lang,
                theme: 'vs-dark',
                wordWrap: 'on'
            });
        } else {
            monacoEditor = monaco.editor.create(document.getElementById('editor'), {
                value: code,
                theme: 'vs-dark',
                wordWrap: 'on'
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
                'editor.background': '#14141426',
                'minimap.background': '#4a4a4a34'
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
                    const model = monacoEditor.getModel();
                    const lang = getLanguageFromExtension(path);
                    monacoEditor.setModelLanguage(model, lang);
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