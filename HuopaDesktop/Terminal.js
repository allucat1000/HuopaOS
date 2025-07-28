document.body.style.margin = "0";
huopaAPI.removeTitlebar();
// Setup
const font = document.createElement("link");
await setAttrs(font, {
    "href":"https://cdn.jsdelivr.net/npm/@fontsource/monaspace-neon/index.css",
    "rel":"stylesheet"
});
document.body.append(font);
const customColors = {
  red: "#ff5454", 
  green: "#4eff33",
  blue: "#338fff", 
};

const termDiv = document.createElement("div");
const inputDiv = document.createElement("div");
const input = document.createElement("input");
await setAttrs(termDiv, {
    "id":"termDiv",
    "style":`margin: 1em; margin-bottom: 0; padding: 0; font-family: "Monaspace Neon", sans-serif; color: white;`
})
inputDiv.style = `margin: 1em; display: flex; align-items: center; flex-wrap: nowrap; gap: 0.2em; margin: 1em; margin-top: 0; font-family: "Monaspace Neon", sans-serif; color: white;`;
await setAttrs(input, {
    "style":"background-color: transparent; padding: 0; border: none; border-radius: 0; flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow-x: auto; font-family: 'Monaspace Neon'; padding: 0.5em; outline-style: none; color: white; font-size: 1em; padding-left: 0;"
});
termDiv.id = "termDiv";
async function addLine(text) {
    const newText = preprocessLineTag(text);
    const escapedText = escapeWithBackslashes(newText);
    const coloredText = parseColorsAndBackgrounds(escapedText);
    const html = await huopaAPI.parseMarkdown(coloredText);

    const termContentDiv = document.createElement('div');
    termContentDiv.innerHTML = html;
    termContentDiv.style.margin = "0";
    termContentDiv.style.padding = "0";
    const childEl = termContentDiv.children[0]
    if (childEl) childEl.style = "margin: 0.25em 0;";
    termDiv.append(termContentDiv)
    termDiv.scrollTop = termDiv.scrollHeight;
    
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
  return str.replace(/\\/g, "\\\\")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/\n/g, "<br>");
}

const startText = document.createElement("span");
document.body.append(termDiv);
inputDiv.append(startText);
inputDiv.append(input);
document.body.append(inputDiv);
let currentPath = "/system";
input.onkeydown = async(e) => {
    if (e.key === "Enter") {
        const value = input.value;
        await addLine("$ " + value);
        await runCmd(value);
        input.value = "";
        input.focus();
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }
}
let prompt = false;
await setAttrs(startText, {
    "style":"padding: 0; margin: 0; white-space: nowrap;",
    "textContent":currentPath + " $\u00A0"
})
document.documentElement.onclick = () => {
    input.focus();
}
// Code
addLine("_HuopaOS Terminal_");
const elevated = JSON.parse(await huopaAPI.getProcessData()).elevated;
let loggedIntoGithub = false;
if (await huopaAPI.safeStorageRead("githubToken")) {
    loggedIntoGithub = true;
}
let githubRepoOpen;
let githubUsername;

async function runCmd(value) {
    const splitRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|[^\s"']+/g;
    const rawArgs = value.match(splitRegex) || [];
    if (rawArgs.length === 0) return;
    const cmd = rawArgs[0];
    const values = rawArgs.slice(1).map(arg => arg.replace(/^["']|["']$/g, ""));

    switch (cmd) {
        case "cat":
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
                    await addLine(`Content of "${fullPath}":
${await huopaAPI.getFile(fullPath)}`);
                }
                
            }
            break;
        case "github":
            switch (values[0].toLowerCase()) {
                case "help":
                    await addLine(`Github help:
"github login <access token> <username>": Sets your login credentials. Make sure to use a classic access token, info: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic
⠀
"github logout": Logs you out from this terminal instance
⠀
"github openRepo <repo name>": Sets the repo to make changes in
⠀
"github create <github path> <local path>": Creates a file at the given path from a local path
⠀
"github update <github path> <local path>": Updates a file at the given path from a local path
⠀
"github delete <github path>": Deletes a file at the given path
⠀
"github pull <github path> <local path>": Updates a local path from a given path
⠀
                        `);
                    break
                case "pull":{
                    const pathToUpdate = resolvePath(values[2]);
                    const githubPath = values[1];
                    if (!loggedIntoGithub) {
                        await addLine(`You have to login first, run "github login <access token> <username>" to login.`);
                        return;
                    }
                    if (!githubRepoOpen) {
                        await addLine(`You have to open a github repo first, run "github openRepo <repo name>" to open a repo.`);
                        return;
                    }
                    if (!githubPath && !pathToUpdate) {
                        addLine(`[line=red]github pull: 2 parameters are required![/line]`);
                        return;
                    }
                    if (await isDir(pathToUpdate)) {
                        await addLine("You cannot update a folder with file data!");
                        return;
                    }
                    if (!githubUsername) githubUsername = await huopaAPI.safeStorageRead("githubUsername");
                    const data = await huopaAPI.github_getFile(undefined, githubUsername, githubRepoOpen, "main", githubPath);
                    await huopaAPI.writeFile(pathToUpdate, "file", data);
                    break;
                }
                case "openrepo":
                    if (!loggedIntoGithub) {
                        await addLine(`You have to login first, run "github login <access token> <username>" to login.`);
                        return;
                    }
                    if (values[1]) {
                        githubRepoOpen = values[1];
                    } else {
                        addLine("[line=red]github openRepo: A parameter is required![/line]");
                    }
                    break;
                case "delete":{
                    if (!loggedIntoGithub) {
                        await addLine(`You have to login first, run "github login <access token> <username>" to login.`);
                        return;
                    }
                    if (!githubRepoOpen) {
                        await addLine(`You have to open a github repo first, run "github openRepo <repo name>" to open a repo.`);
                        return;
                    }
                    const pathToDelete = values[1];
                    if (!githubUsername) githubUsername = await huopaAPI.safeStorageRead("githubUsername");
                    await huopaAPI.github_deleteFile(await huopaAPI.safeStorageRead("githubToken"), githubUsername, githubRepoOpen, pathToDelete);
                    break;
                }
                case "update":{
                    if (!loggedIntoGithub) {
                        await addLine(`You have to login first, run "github login <access token> <username>" to login.`);
                        return;
                    }
                    if (!githubRepoOpen) {
                        await addLine(`You have to open a github repo first, run "github openRepo <repo name>" to open a repo.`);
                        return;
                    }
                    const pathToUpdate = values[1];
                    const localPath = resolvePath(values[2]);
    
                    if (!await pathExists(localPath) || await isDir(localPath)) {
                        await addLine("Invalid file. Does this file exist locally? If it does, check if the file is a folder, as you cannot create a file from a folder currently.");
                        return;
                    }
                    if (!githubUsername) githubUsername = await huopaAPI.safeStorageRead("githubUsername");
                    await huopaAPI.github_updateFile(await huopaAPI.safeStorageRead("githubToken"), githubUsername, githubRepoOpen, pathToUpdate, await huopaAPI.getFile(localPath));
                    break;
                }
                case "create":
                    if (!loggedIntoGithub) {
                        await addLine(`You have to login first, run "github login <access token> <username>" to login.`);
                        return;
                    }
                    if (!githubRepoOpen) {
                        await addLine(`You have to open a github repo first, run "github openRepo <repo name>" to open a repo.`);
                        return;
                    }
                    const pathToCreate = values[1];
                    const localPath = resolvePath(values[2]);
    
                    if (!await pathExists(localPath) || await isDir(localPath)) {
                        await addLine("Invalid file. Does this file exist locally? If it does, check if the file is a folder, as you cannot create a file from a folder currently.");
                        return;
                    }
                    if (!githubUsername) githubUsername = await huopaAPI.safeStorageRead("githubUsername");
                    await huopaAPI.github_createFile(await huopaAPI.safeStorageRead("githubToken"), githubUsername, githubRepoOpen, pathToCreate, await huopaAPI.getFile(localPath));
                    break;
                case "login":
                    if (loggedIntoGithub) {
                        addLine(`You are already logged into Github! Run "github logout" to sign out.`);
                        return;
                    }
                    await huopaAPI.safeStorageWrite("githubToken", "file", values[1]);
                    loggedIntoGithub = true;
                    await huopaAPI.safeStorageWrite("githubUsername", "file", values[2]);
                    githubUsername = values[2];
                    break;
                case "logout":
                    loggedIntoGithub = false;
                    githubUsername = undefined;
                    await huopaAPI.safeStorageWrite("githubToken", "file", undefined);
                    await huopaAPI.safeStorageWrite("githubUsername", "file", undefined);
                    break;
                default:
                    await addLine("Unknown github command!");
                    break;
            }
            break
        case "git":
            addLine(`Git isn't supported, but Github is. Run "github login <access token> <username>" and input your personal access token.`);
            break
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
                    if (path.endsWith(".js") && values[1]?.toLowerCase() !== "-v") {
                        await addLine(`open: Executed app at path "${fullPath}"`);
                        await huopaAPI.runApp(fullPath);
                    } else {
                        const exists = await huopaAPI.getFile(`/home/applications/${values[1]}.js`);
                        const exists2 = await huopaAPI.getFile(`/home/applications/${values[0]}.js`);
                        if (exists || exists2) {
                            if (exists2) {
                                if (values[1] === "-e" && elevated) {
                                    await huopaAPI.runApp(`/home/applications/${values[0]}.js`, fullPath, true);
                                } else {
                                    await huopaAPI.runApp(`/home/applications/${values[0]}.js`, fullPath);
                                }
                                return
                            }
                            if (values[2] === "-e" && elevated) {
                                await huopaAPI.runApp(`/home/applications/${values[1]}.js`, fullPath, true);
                            } else {
                                await huopaAPI.runApp(`/home/applications/${values[1]}.js`, fullPath);
                            }
                            return
                        } else {
                            if (values[1] === "-e" && elevated) {
                                await huopaAPI.runApp("/home/applications/Preview.js", fullPath, true);
                            } else {
                                await huopaAPI.runApp("/home/applications/Preview.js", fullPath);
                            }
                            
                        }
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
            if (values[0]) {
                await addLine(values[0]);
            } else {
                await addLine(`[line=red]echo: A parameter is required[/line]`);
            }
            break;
        case "clear":
            termDiv.innerHTML = "";
            addLine("_HuopaOS Terminal_")
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
                addLine(`Items at path "${fullPath}":
    
                    `);
                for (const item of list) {
                    const truncated = item.split("/").pop();
                    const dir = await isDir(item);
                    if (dir) {
                        addLine(`[color=blue]${truncated}[/color]`)
                    } else {
                        addLine(truncated)
                    }
                    
                }
                await addLine(" ");
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
                    startText.textContent = currentPath + " $\u00A0";
                
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
    children = JSON.parse(children);
    if (children.includes(path)) {
        return true;
    } else {
        return false;
    }
}