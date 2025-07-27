function setWindowDataLoop() {
    huopaAPI.setWindowPosition("0", "0");
    huopaAPI.setWindowSize("calc(100%)", "calc(100% - 2px;)");
    setTimeout(setWindowDataLoop, 250);
}
huopaAPI.setWindowColor("#00000000", "#00000000");
huopaAPI.removeTitlebar();
huopaAPI.setWindowBlur("0px");
setWindowDataLoop()
document.body.style.overflow = "hidden";
let oldDesktopData;
let fileSelected;
const styleTag = document.createElement("style");
styleTag.textContent = `
    .selected {
        background-color: rgba(120, 120, 120, 0.2)
    }
`;
document.body.append(styleTag);
async function renderDesktop() {
    let desktopData = await huopaAPI.getFile("/home/desktop");
    if (desktopData !== oldDesktopData) {
        if (!desktopData) {
            desktopData = "[]";
            await huopaAPI.writeFile("/home/desktop", "dir", "[]");
        }
        desktopData = JSON.parse(desktopData);
        const desktopDiv = document.createElement("div");
        desktopDiv.onclick = async() => {
            if (!fileSelected) {
                await new Promise(resolve => setTimeout(resolve, 2));
                if (fileSelected) return;
            }
            fileSelected = undefined;
            const selectedFiles = document.querySelectorAll(".selected");
            for (const el of selectedFiles) {
                el.classList.remove("selected");
            }
        }
        desktopDiv.style = "display: inline: width: 100%; height: 100%; display: flex; flex-wrap: wrap; flex-direction: row; padding: 0;"

        for (const file of desktopData) {
            let fileIconSrc;
            const fileDiv = document.createElement("div");
            const fileIcon = document.createElement("img");
            let openInCode = false;
            const fileDir = await isDir(file);
            if (file.endsWith(".js")) {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>';
            } else if (file.endsWith(".json")) {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-json-icon lucide-file-json"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>';
            } else if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".webp")){
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-image-icon lucide-file-image"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/></svg>';
            } else if (file.endsWith(".txt")) {
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
            } else if (fileDir === true) {
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-icon lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>';
            } else {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>';
            }
            fileIcon.src = "data:image/svg+xml;utf8," + encodeURIComponent(fileIconSrc);
            fileIcon.style.display = "block";
            fileIcon.style.margin = "0 auto";
            fileDiv.style.margin = "1em 0";
            fileDiv.style.height = "96px";
            fileDiv.style.userSelect = "none";
            fileDiv.style.msUserSelect = "none";
            fileDiv.style.cursor = "pointer";
            fileDiv.style.padding = "0.5em 0.5em 0.25em 0.5em";
            fileDiv.style.borderRadius = "0.5em"
            const fileText = document.createElement("p");
            fileText.textContent = file.split("/").pop();
            fileText.style.textAlign = "center";
            fileText.style.margin = "0.5em 0";
            fileText.style.padding = "0.5em 1em";
            fileText.style.color = "white";
            fileDiv.append(fileIcon);
            fileDiv.append(fileText);
            fileDiv.onclick = async() => {
                if (fileSelected === file) {
                    fileDiv.classList.remove("selected");
                    fileSelected = undefined;
                    if (openInCode && await huopaAPI.getFile("/home/applications/Code.js")) {
                        huopaAPI.runApp("/home/applications/Code.js", file);
                    } else if (fileDir) {
                        huopaAPI.runApp("/home/applications/File Manager.js", file);
                    } else {
                        huopaAPI.runApp("/home/applications/Preview.js", file);
                    }
                } else {
                    const selectedFiles = document.querySelectorAll(".selected");
                    for (const el of selectedFiles) {
                        el.classList.remove("selected");
                    }
                    await new Promise(resolve => setTimeout(resolve, 0));
                    fileDiv.classList.add("selected");
                    fileSelected = file;
                }
                
            }
            desktopDiv.append(fileDiv)
        }
        document.body.innerHTML = "";
        document.body.append(styleTag);
        
        document.body.append(desktopDiv);
    }
    oldDesktopData = await huopaAPI.getFile("/home/desktop");
    setTimeout(renderDesktop, 250);
    
}
renderDesktop()
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
