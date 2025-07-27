let fileListDiv;
let pathSelected;
let fileSelectorMode = false;
let returnId;

if (typeof loadParams === "object" && loadParams.mode === "fileSelector") {
    await huopaAPI.setTitle("File Selector - Choose a file");
    fileSelectorMode = true;
    returnId = loadParams.returnId;
    renderFileList("/");
} else if (loadParams) {
    const dir = await isDir(loadParams);
    if (dir) renderFileList(loadParams);
} else {
    renderFileList("/");
}
async function renderFileList(path) {
    if (fileListDiv) {
        fileListDiv.remove()
    }
    fileListDiv = document.createElement("div");
    fileListDiv.id = "fileList";
    const backButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const topBarList = document.createElement("div");
    const separator = document.createElement("div");
    separator.style = "margin-bottom: 4em;";
    fileListDiv.style = "width: 100%; height: calc(100% - 20px); display: flex; flex-direction: column; margin-bottom: -0.25em;";
    topBarList.style = "display: flex; align-items: center; justify-content: start; padding: 0.25em; margin-top: 0.33em; position: fixed; top: -5px; background-color: rgba(45, 45, 45, 0.5); width: 100%; left: 0;";
    await setAttrs(backButton, {
        "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
        "style":"margin: 0.5em; display: inline; opacity: 1; display: flex; justify-content: center; align-items: center;"
    });
    await setAttrs(deleteButton, {
        "innerHTML":'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75Zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5ZM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75Zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75Zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25Z" fill="#fff"/></svg>',
        "style":"display: flex; justify-content: center; align-items: center;"
    });
    if (path === "/") {
        backButton.style.opacity = "0.5";
        backButton.style.cursor = "default";
    } else {
        backButton.onclick = async() => {
            let parentPath = path.split("/").slice(0, -1).join("/");
            if (!parentPath) parentPath = "/";
            renderFileList(parentPath);
        };
    }
    if (!fileSelectorMode) {
        deleteButton.onclick = async() => {
                if (!pathSelected) {
                    let corePaths = await huopaAPI.getFile("/system/manifest.json");
                    if (corePaths) {
                        corePaths = JSON.parse(corePaths).corePaths
                        if (corePaths.includes(path)) {
                            await huopaAPI.warn("User tried deleting protected path!");
                            return;
                        }
                    }
                    await huopaAPI.deleteFile(path)
                    let parentPath = path.split("/").slice(0, -1).join("/");
                    if (!parentPath) parentPath = "/";
                    renderFileList(parentPath);
                } else {
                    await huopaAPI.deleteFile(pathSelected)
                    pathSelected = undefined;
                    for (const child of await fileListDiv.children) {
                        child.classList.remove("file-selected");
                    }
                    renderFileList(path);
                }
                
            
        };
    }
    const buttonCss = async (button) => {
        button.style.width = "30px";
        button.style.height = "30px";
        button.style.padding = "0.5em";
    }

    await buttonCss(backButton);
    await buttonCss(deleteButton);

    topBarList.append(backButton);
    if (!fileSelectorMode) {
        topBarList.append(deleteButton);
    }
    
    const currentPathTitle = document.createElement("p");
    currentPathTitle.style = "color: white; display: inline; text-align: left; margin: 0.5em; font-size: 1.5em;"
    currentPathTitle.textContent = path;
    topBarList.append(currentPathTitle);
    fileListDiv.append(topBarList);
    fileListDiv.append(separator);
    document.body.append(fileListDiv);
    const styleTag = document.createElement("style");
    styleTag.textContent = ".file-selected { filter: brightness(1.25); } .disabled { opacity: 0.5; } ";
    document.body.append(styleTag);
    const match = path.match(/\.[a-zA-Z0-9]+$/);
    if (await isDir(path) && !match) {
        let perms = true;
        let fileList = await huopaAPI.getFile(path);
        fileList = JSON.parse(fileList);
        
        for (const file of fileList) {
            const fileDiv = document.createElement("div");
            fileDiv.style = "width: calc(100% - 20px); margin: 0em auto; border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 2.5px solid; margin: 0.25em; display: flex; cursor: pointer;";
            const fileName = document.createElement("label");
            const dynamicFilePath = file.replace(path + "/", "")
            const fileIcon = document.createElement("img");
            let fileIconSrc;
            const fileDir = await isDir(file);
            let openInCode = false;
            if (file.endsWith(".js")) {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>';
            } else if (file.endsWith(".json")) {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-json-icon lucide-file-json"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>';
            } else if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".webp")){
                openInCode = false;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-image-icon lucide-file-image"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/></svg>';
            } else if (file.endsWith(".txt")) {
                openInCode = false;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
            } else if (fileDir === true) {
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-icon lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>';
            } else {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>';
            }
            fileIcon.src = "data:image/svg+xml;utf8," + encodeURIComponent(fileIconSrc);
            fileIcon.style = "display: inline; margin: 0 0.5em; width: 16px";
            fileName.textContent = dynamicFilePath.startsWith("/") ? dynamicFilePath.slice(1) : dynamicFilePath;
            fileName.style = "color: white; display: block; text-align: left; padding: 0.6em 0; cursor: pointer;";
            if (perms) {
                const notDir = !await isDir(file)
                fileDiv.onclick = async () => {
                    if (pathSelected === file) {
                        pathSelected = undefined;
                        fileDiv.classList.remove("file-selected")
                        
                        if (file.endsWith(".js") && notDir) {
                            if (fileSelectorMode) {
                                await huopaAPI.returnToHost(returnId, file);
                                await huopaAPI.closeApp();
                                return;
                            }
                            await huopaAPI.runApp(file);
                        } else if (notDir) {
                            if (fileSelectorMode) {
                                await huopaAPI.returnToHost(returnId, file); 
                                await huopaAPI.closeApp();
                                return;
                            }
                            if (openInCode && await huopaAPI.getFile("/home/applications/Code.js")) {
                                await huopaAPI.runApp("/home/applications/Code.js", file);
                            } else {
                                await huopaAPI.runApp("/home/applications/Preview.js", file);
                            }
                            
                        } else {
                            await renderFileList(file)
                        }
                    } else {
                        for (const child of fileListDiv.children) {
                            child.classList.remove("file-selected")
                        }
                        
                        fileDiv.classList.add("file-selected")
                        pathSelected = file;
                    }
                    
                };
            } else {
                fileDiv.style.opacity = "0.5";
            }
            
            fileDiv.append(fileIcon);
            fileDiv.append(fileName);
            fileListDiv.append(fileDiv);
        }
    } else {
        await huopaAPI.runApp("/home/applications/Preview.js", path);
    }
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