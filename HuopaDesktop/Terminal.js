// Setup
const font = await huopaAPI.createElement("link");
await setAttrs(font, {
    "href":"https://cdn.jsdelivr.net/npm/@fontsource/monaspace-neon/index.css",
    "rel":"stylesheet"
});
await huopaAPI.appendToApp(font);
const customColors = {
  red: "#ff5454", 
  green: "#4eff33",
  blue: "#338fff", 
};

const termDiv = await huopaAPI.createElement("div");
const inputDiv = await huopaAPI.createElement("div");
const input = await huopaAPI.createElement("input");
await setAttrs(termDiv, {
    "id":"termDiv",
    "style":`margin: 1em; margin-bottom: 0; padding: 0; font-family: "Monaspace Neon", sans-serif;`
})
await huopaAPI.setAttribute(inputDiv, "style", `margin: 1em; display: flex; align-items: center; flex-wrap: nowrap; gap: 0.2em; margin: 1em; margin-top: 0; font-family: "Monaspace Neon", sans-serif;`);
await setAttrs(input, {
    "style":"background-color: transparent; padding: 0; border: none; border-radius: 0; flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow-x: auto; font-family: 'Monaspace Neon';"
});
await huopaAPI.setAttribute(termDiv, "id", "termDiv");
async function addLine(text) {
    const newText = preprocessLineTag(text);
    const escapedText = escapeWithBackslashes(newText);
    const coloredText = parseColorsAndBackgrounds(escapedText);
    const html = await huopaAPI.parseMarkdown(coloredText);

    const termContentDiv = await huopaAPI.createElement('div');
    await huopaAPI.setAttribute(termContentDiv, "innerHTML", html);
    await huopaAPI.append(termDiv, termContentDiv)
    await huopaAPI.setAttribute(termDiv, "scrollTop", await huopaAPI.getAttribute(termDiv, "scrollHeight"));
    
}

function preprocessLineTag(text) {
  return text.replace(/\[line=(.+?)\]([\s\S]*?)\[\/line\]/g, (match, color, content) => {
    const actualColor = getColor(color);
    return `[color=${actualColor}]┃ [/color]${content}`;
  });
}

function parseColorsAndBackgrounds(text) {
  text = text.replace(/\[color=(.+?)\](.+?)\[\/color\]/g, (m, color, content) => {
    const actualColor = getColor(color);
    return `<span style="color:${actualColor};">${content}</span>`;
  });

  text = text.replace(/\[bg=(.+?)\](.+?)\[\/bg\]/g, (m, color, content) => {
    const actualColor = getColor(color);
    return `<span style="background-color:${actualColor};">${content}</span>`;
  });

  return text;
}

function getColor(colorName) {
  return customColors[colorName.toLowerCase()] || colorName;
}

function escapeWithBackslashes(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
}

const startText = await huopaAPI.createElement("span");
await huopaAPI.appendToApp(termDiv);
await huopaAPI.append(inputDiv, startText);
await huopaAPI.append(inputDiv, input);
await huopaAPI.appendToApp(inputDiv);
let currentPath = "/system";
await huopaAPI.setAttribute(input, "onkeypress", async(key) => {
    if (key === "Enter") {
        const value = await huopaAPI.getAttribute(input, "value");
        await addLine("$ " + value);
        runCmd(value);
        await huopaAPI.setAttribute(input, "value", "");
    }
})
let prompt = false;
await setAttrs(startText, {
    "style":"padding: 0; margin: 0; white-space: nowrap;",
    "textContent":currentPath + " $\u00A0"
})

// Code

async function runCmd(value) {
    const splitRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|[^\s"']+/g;
    const rawArgs = value.match(splitRegex) || [];
    if (rawArgs.length === 0) return;
    const cmd = rawArgs[0];
    const values = rawArgs.slice(1).map(arg => arg.replace(/^["']|["']$/g, ""));

    switch (cmd) {
        case "open":
            if (values) {
                const path = values[0];
                const fullPath = resolvePath(values[0]);
                const exists = await pathExists(fullPath);
                if (!exists) {
                    await addLine(`[line=red]open: Given path doesn't exist![/line]`);
                    return;
                }
                const dir = await isDir(fullPath);
                if (dir) {
                    await addLine(`[line=red]open: Given path is not supposed to be a directory![/line]`)
                } else {
                    if (path.endsWith(".js")) {
                        await addLine(`open: Executed app at path "${fullPath}"`);
                        await huopaAPI.runApp(fullPath);
                    } else {
                        await huopaAPI.runApp("/home/applications/Preview.js", fullPath);
                    }
                }
                
            }
            break;
        case "touch":
            if (values) {
                let fullPath = resolvePath(values[0]);
                await huopaAPI.writeFile(fullPath, "file");
            } else {
                await addLine(`[line=red]touch: A parameter is required[/line]`);
            }
            break;
        case "echo":
            if (values) {
                await addLine(values[0]);
            } else {
                await addLine(`[line=red]echo: A parameter is required[/line]`);
            }
            break;
        case "clear":
            await huopaAPI.setAttribute(termDiv, "innerHTML", "");
            break;
        case "info":
            const sysInfo = JSON.parse(await huopaAPI.getSystemInfo());
            const diffInMilliseconds = Math.abs(Date.now() - sysInfo.bootTime);
            const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;
            await addLine(`
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣴⣶⡿⠿⠿⠿⠿⢿⣶⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀OS: HuopaOS v${sysInfo.version}
⠀⠀⠀⠀⠀⠀⣠⣾⡿⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⢿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Uptime: ${hours}h ${minutes}m ${seconds}s
⠀⠀⠀⠀⣴⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀Shell: HuopaShell
⠀⠀⣠⣾⠟⠁⠀⣠⣴⣶⣿⣷⣶⣄⠀⠀⠀⠀⠀⣤⣶⣾⣿⣶⣦⡄⠈⠻⣷⣄⠀⠀⠀⠀⠀⠀Host: ${sysInfo.host}
⠀⢰⣿⠏⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⡄⠀⠹⣿⡆⠀⠀⠀⠀⠀DE: HuopaDesktop
⢀⣿⠇⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠸⣿⡀⠀⠀⠀⠀WM: HuopaWM
⣼⡿⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⢿⣧⠀⠀⠀⠀Browser: ${sysInfo.browser}
⣿⡇⠀⠀⠀⠀⠀⠀⠉⠙⠛⠛⠉⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠉⠁⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀Icons: Lucide
⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀Terminal: HuopaTerm
⢻⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡟⠀⠀⠀⠀Battery: ${Math.floor(sysInfo.battery * 100)}%
⠈⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⠁
⠀⠸⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠇⠀
⠀⠀⠙⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡿⠋⠀⠀
⠀⠀⠀⠀⠻⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⠟⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⢿⣷⣦⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣴⣾⡿⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠻⠿⣷⣶⣶⣶⣶⣾⠿⠟⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀
         ⠀⠀⠀⠀       
`)
            break;
        case "ls":
            let path = values[0];
            if (!values[0]) path = currentPath;
            let fullPath = resolvePath(path);
            const exists = await pathExists(fullPath);
            if (!exists) {
                await addLine(`[line=red]ls: Given path doesn't exist![/line]`);
                return;
            }
            if (isDir(fullPath)) {
                const list = JSON.parse(await huopaAPI.getFile(fullPath));
                let listToShow = `Items at path "${fullPath}":

                `;
                for (const item of list) {
                    listToShow = listToShow + `
${item}
                    `;
                }
                addLine(listToShow);
            } else {
                await addLine(`[line=red]ls: Given path is not a directory![/line]`);
            }
            break;
        case "rm":
            if (values) {
                let fullPath = resolvePath(values[0]);
                const exists = await pathExists(fullPath);
                if (!exists) {
                    await addLine(`[line=red]rm: Given path doesn't exist![/line]`);
                    return;
                }
                await huopaAPI.deleteFile(fullPath);
            } else {
                await addLine(`[line=red]rm: A parameter is required[/line]`);
            }
            break;

        case "mkdir":
            if (values) {
                let fullPath = resolvePath(values[0]);
                await huopaAPI.writeFile(fullPath, "dir");
            } else {
                await addLine(`[line=red]mkdir: A parameter is required[/line]`);
            }
            break;

        case "cd":
            if (values) {
                let fullPath = resolvePath(values[0]);
                const parts = fullPath.split("/").filter(Boolean);
                const parentPath = "/" + parts.slice(0, -1).join("/");

                try {
                    const exists = await pathExists(fullPath);
                    if (!exists) {
                        await addLine(`[line=red]cd: Given path doesn't exist![/line]`);
                        return;
                    }
                
                    currentPath = fullPath;
                    await huopaAPI.setAttribute(startText, "textContent", currentPath + " $\u00A0");
                
                } catch (e) {
                    await addLine(`[line=red]cd: Failed to access "${parentPath}"[/line]`);
                }
            } else {
                await addLine(`[line=red]cd: A parameter is required[/line]`);
            }
            break;

        default:
            if (!value) break;
            await addLine(`[line=red]Unknown command: "${cmd}"[/line]`);
            break;
    }
}

function resolvePath(inputPath) {
    if (!inputPath.startsWith("/")) {
        inputPath = currentPath + "/" + inputPath;
    }

    inputPath = inputPath.replace(/\/+/g, "/");

    const parts = inputPath.split("/").filter(Boolean);
    const resolvedParts = [];

    for (const part of parts) {
        if (part === ".") continue;
        else if (part === "..") resolvedParts.pop();
        else resolvedParts.push(part);
    }
    return "/" + resolvedParts.join("/");
}

async function isDir(path) {
    try {
        const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
        const lastSegment = normalizedPath.split("/").pop();
        if (lastSegment.includes(".") && !lastSegment.startsWith(".")) {
            return false;
        }
        
        const fileContent = await huopaAPI.getFile(normalizedPath);
        if (path === "/") return true;
        let parsed;
        try {
            parsed = JSON.parse(fileContent);
        } catch {
            return false;
        }

        if (!Array.isArray(parsed)) return false;
        if (!parsed.every(item => typeof item === "string")) return false;
        
        return true;
    } catch (err) {
        await huopaAPI.error(err);
        return false;
    }
}

async function pathExists(path) {
    if (path === "/") return true;
    let parentPath = path.split("/").slice(0, -1);
    let children;

    if (parentPath.length === 1) {
        children = await huopaAPI.getFile("/");
    } else {
        children = await huopaAPI.getFile(parentPath.join("/"));
    }
    if (children.includes(path)) {
        return true;
    } else {
        return false;
    }
}