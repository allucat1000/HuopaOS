const ContextMenu = await importModule("contextmenu");
ContextMenu.disableDefault();
let fileListDiv;
let topBarList;
let sideBarList;
let pathSelected;
let bottomMargin;
let fileSelectorMode = false;
let returnId;
let favouriteFolders = await huopaAPI.applicationStorageRead("favouriteFolders.json");
if (!favouriteFolders) { await huopaAPI.applicationStorageWrite("favouriteFolders.json", "file", "[]"); favouriteFolders = '["/", "/system", "/home/applications", "/home/downloads"]'; }
favouriteFolders = JSON.parse(favouriteFolders);

document.body.style.overflow = "hidden";
const elevated = JSON.parse(await huopaAPI.getProcessData()).elevated;

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
    huopaAPI.setTitle("File Manager - " + path)
    if (fileListDiv) {
        topBarList.remove()
        fileListDiv.remove()
        sideBarList.remove()
    }
    bottomMargin = document.createElement("div");
    bottomMargin.style.marginBottom = "4em";
    const favouriteTitle = document.createElement("p");
    favouriteTitle.textContent = "Favourites";
    favouriteTitle.style.textAlign = "center";
    fileListDiv = document.createElement("div");
    fileListDiv.id = "fileList";
    const backButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const starButton = document.createElement("button");
    topBarList = document.createElement("div");
    fileListDiv.style = "width: calc(100% - 10em); height: calc(100% - 20px); display: flex; flex-direction: column; margin-bottom: -0.25em; position: absolute; top: 4em; overflow: scroll; right: 0;";
    sideBarList = document.createElement("div");
    sideBarList.append(favouriteTitle);
    sideBarList.style = "width: 9.5em; height: 100%; top: 0; left: 0; position: absolute; border-style: none;"
    topBarList.style = "display: flex; align-items: center; justify-content: start; padding: 0.25em; margin-top: 0.33em; position: fixed; top: -5px; border-style: none; width: calc(100% - 10em); right: 0; margin-bottom: 4em;";

    for (const folder of favouriteFolders) {
        const fileDiv = document.createElement("div");
        fileDiv.style = "width: calc(100% - 20px); border-radius: 0.5em; margin: 0.25em auto; display: flex; cursor: pointer;";
        fileDiv.classList.add("primary")
        const fileName = document.createElement("label");
        let dynamicFilePath = folder.split("/").pop()
        if (folder === "/") dynamicFilePath = "root"
        fileName.textContent = truncate(toTitleCase(dynamicFilePath), 13);
        fileName.style = "display: block; text-align: left; padding: 0.6em 0; cursor: pointer; margin: 0 auto; text-align: center;";
        fileDiv.append(fileName);
        fileDiv.onclick = () => {
            renderFileList(folder);
        }
        sideBarList.append(fileDiv);
        await ContextMenu.set(fileDiv, [
            {
                name:"Remove",
                "function":async() => {   
                    const index = favouriteFolders.indexOf(path)
                    if (index !== -1) {
                        favouriteFolders.splice(index, 1);
                    }
                    await huopaAPI.applicationStorageWrite("favouriteFolders.json", "file", JSON.stringify(favouriteFolders));
                    renderFileList(path);
                }
            }
        ])
    }
    await setAttrs(backButton, {
        "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
        "style":"margin: 0.5em; display: inline; opacity: 1; display: flex; justify-content: center; align-items: center;"
    });
    await setAttrs(deleteButton, {
        "innerHTML":'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75Zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5ZM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75Zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75Zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25Z" fill="currentColor"/></svg>',
        "style":"display: flex; justify-content: center; align-items: center;"
    });
    await setAttrs(starButton, {
        "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>',
        "style":"display: flex; justify-content: center; align-items: center;"
    });
    if (favouriteFolders.includes(path)) {
        starButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>'
    }
    starButton.onclick = async() => {
        if (favouriteFolders.includes(path)) {
            const index = favouriteFolders.indexOf(path)
            if (index !== -1) {
                favouriteFolders.splice(index, 1);
            }
        } else {
            favouriteFolders.push(path)
        }
        await huopaAPI.applicationStorageWrite("favouriteFolders.json", "file", JSON.stringify(favouriteFolders));
        renderFileList(path);
    }
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
        button.style.margin = "0.25em";
    }

    await buttonCss(backButton);
    await buttonCss(deleteButton);
    await buttonCss(starButton);

    topBarList.append(backButton);
    if (!fileSelectorMode) {
        topBarList.append(deleteButton);
        topBarList.append(starButton);
    }
    
    const currentPathTitle = document.createElement("p");
    currentPathTitle.style = "display: inline; text-align: left; margin: 0.5em; font-size: 1.5em;"
    currentPathTitle.textContent = truncate(path, 30);
    topBarList.append(currentPathTitle);
    document.body.append(topBarList)
    document.body.append(sideBarList)
    document.body.append(fileListDiv);
    document.body.append(bottomMargin);
    const styleTag = document.createElement("style");
    styleTag.textContent = ".file-selected { filter: brightness(1.25); } .disabled { opacity: 0.5; } ";
    document.body.append(styleTag);
    const match = path.match(/\.[a-zA-Z0-9]+$/);
    if (await isDir(path) && !match) {
        let perms = true;
        let fileList = await huopaAPI.getFile(path);
        fileList = JSON.parse(fileList);
        
        for (const fileI in fileList) {
            const file = fileList[fileI];
            const fileDiv = document.createElement("div");
            await ContextMenu.set(fileDiv, [
                {
                    name:"Delete",
                    "function":async() => {   
                        await huopaAPI.deleteFile(file)
                        renderFileList(path);
                    }
                }
            ])
            fileDiv.style = "width: calc(100% - 20px); margin: 0em auto; border-radius: 0.5em; margin: 0.25em; display: flex; cursor: pointer;";
            if (Number(fileI) + 1 === fileList.length) {
                fileDiv.style.marginBottom = "4em";
            }
            fileDiv.classList.add("primary")
            const fileName = document.createElement("label");
            const dynamicFilePath = file.replace(path + "/", "")
            const fileIcon = document.createElement("img");
            let fileIconSrc;
            const fileDir = await isDir(file);
            let openInCode = false;
            if (file.endsWith(".js")) {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>';
            } else if (file.endsWith(".json")) {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-json-icon lucide-file-json"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>';
            } else if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".webp") || file.endsWith(".mp4") || file.endsWith(".gif")){
                openInCode = false;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-image-icon lucide-file-image"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/></svg>';
            } else if (file.endsWith(".mp3")) {
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-music-icon lucide-file-music"><path d="M10.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8.4"/><path d="M8 18v-7.7L16 9v7"/><circle cx="14" cy="16" r="2"/><circle cx="6" cy="18" r="2"/></svg>'
            } else if (file.endsWith(".txt")) {
                openInCode = false;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
            } else if (fileDir === true) {
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-icon lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>';
            } else {
                openInCode = true;
                fileIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>';
            }
            await setAttrs(fileIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(fileIconSrc)});
            fileIcon.style = "display: inline; margin: 0 0.5em; width: 16px";
            fileName.textContent = dynamicFilePath.startsWith("/") ? dynamicFilePath.slice(1) : dynamicFilePath;
            fileName.style = "display: block; text-align: left; padding: 0.6em 0; cursor: pointer;";
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
                                if (elevated) {
                                    await huopaAPI.runApp("/home/applications/Preview.js", file, true);
                                    return;
                                }
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

function truncate(text, maxlength) {
    if (text.length >= maxlength) {
        return text.slice(0, maxlength) + "..."
    } else {
        return text;
    }
}

function toTitleCase(str) {
  return str.replace(/^([a-z])/, (match, p1) => p1.toUpperCase());
}