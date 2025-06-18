let fileListDiv;
let pathSelected;
let fileSelectorMode = false;
let returnId;

if (typeof loadParams === "object" && loadParams.mode === "fileSelector") {
    fileSelectorMode = true;
    returnId = loadParams.returnId;
}
async function renderFileList(path) {
    if (fileListDiv) {
        await huopaAPI.deleteElement(fileListDiv);
    }
    fileListDiv = await huopaAPI.createElement("div");
    await huopaAPI.setAttribute(fileListDiv, "id", "fileList");
    const backButton = await huopaAPI.createElement("button");
    const deleteButton = await huopaAPI.createElement("button");
    const topBarList = await huopaAPI.createElement("div");
    await huopaAPI.setAttribute(fileListDiv, "style", "width: 100%; height: calc(100% - 20px); display: flex; flex-direction: column; margin-bottom: -0.25em;");
    await huopaAPI.setAttribute(topBarList, "style", "display: flex; align-items: center; justify-content: start; padding: 0.25em; margin-top: 0.33em;");
    await setAttrs(backButton, {
        "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
        "style":"margin: 0.5em; display: inline; opacity: 1;"
    });
    await setAttrs(deleteButton, {
        "innerHTML":'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75Zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5ZM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75Zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75Zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25Z" fill="#fff"/></svg>'
    });
    if (path === "/") {
        await huopaAPI.setCertainStyle(backButton, "opacity", "0.5");
        await huopaAPI.setCertainStyle(backButton, "cursor", "default");
    } else {
        await huopaAPI.setAttribute(backButton, "onclick", async() => {
            let parentPath = path.split("/").slice(0, -1).join("/");
            if (!parentPath) parentPath = "/";
            renderFileList(parentPath);
        });
    }
    await huopaAPI.setAttribute(deleteButton, "onclick", async() => {
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
                for (const child of await huopaAPI.getChildren(fileListDiv)) {
                    await huopaAPI.removeClass(child, "file-selected");
                }
                await huopaAPI.addClass(deleteButton, "disable");
                renderFileList(path);
            }
            
        
    });
    await huopaAPI.setCertainStyle(backButton, "padding", "0.5em");
    await huopaAPI.setCertainStyle(deleteButton, "padding", "0.5em");
    await huopaAPI.append(topBarList, backButton);
    await huopaAPI.append(topBarList, deleteButton);
    const currentPathTitle = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(currentPathTitle, "style", "color: white; display: inline; text-align: left; margin: 0.5em; font-size: 1.5em;")
    await huopaAPI.setAttribute(currentPathTitle, "textContent", path);
    await huopaAPI.append(topBarList, currentPathTitle);
    await huopaAPI.append(fileListDiv, topBarList)
    await huopaAPI.appendToApp(fileListDiv);
    const styleTag = await huopaAPI.createElement("style");
    await huopaAPI.setAttribute(styleTag, "textContent", ".file-selected { filter: brightness(1.25); } .disabled { opacity: 0.5; } ");
    await huopaAPI.appendToApp(styleTag);
    await huopaAPI.addClass(deleteButton, "disable");
    const match = path.match(/\.[a-zA-Z0-9]+$/);
    if (await isDir(path) && !match) {
        let perms = true;
        let fileList = await huopaAPI.getFile(path);
        fileList = JSON.parse(fileList);
        
        for (const file of fileList) {
            const fileDiv = await huopaAPI.createElement("div");
            await huopaAPI.setAttribute(fileDiv, "style", "width: calc(100% - 20px); background-color: rgba(65, 65, 65, 0.5); margin: 0em auto; border-radius: 0.5em; cursor: pointer; border: rgba(105, 105, 105, 0.65) 2.5px solid; margin: 0.25em;");
            const fileName = await huopaAPI.createElement("p");
            const dynamicFilePath = file.replace(path + "/", "")
            await huopaAPI.setAttribute(fileName, "textContent", dynamicFilePath.startsWith("/") ? dynamicFilePath.slice(1) : dynamicFilePath);
            await huopaAPI.setAttribute(fileName, "style", "color: white; display: block; text-align: left; padding: 0.6em;");
            if (perms) {
                const notDir = !await isDir(file)
                await huopaAPI.setAttribute(fileDiv, "onclick", async () => {
                    if (pathSelected === file) {
                        pathSelected = undefined;
                        await huopaAPI.removeClass(fileDiv, "file-selected");
                        await huopaAPI.removeClass(deleteButton, "disable");
                        
                        if (file.endsWith(".js") && notDir) {
                            if (fileSelectorMode) {
                                await huopaAPI.log("a");
                                await huopaAPI.returnToHost(returnId, file);
                                return;
                            }
                            await huopaAPI.runApp(file);
                        } else if (notDir) {
                            if (fileSelectorMode) {
                                await huopaAPI.returnToHost(returnId, file); 
                                return;
                            }
                            await huopaAPI.runApp("/home/applications/Text Editor.js", file);
                        } else {
                            await renderFileList(file)
                        }
                    } else {
                        for (const child of await huopaAPI.getChildren(fileListDiv)) {
                            await huopaAPI.removeClass(child, "file-selected");
                        }
                        await huopaAPI.addClass(deleteButton, "disable");
                        await huopaAPI.addClass(fileDiv, "file-selected");
                        pathSelected = file;
                    }
                    
                });
            } else {
                await huopaAPI.setCertainStyle(fileDiv, "opacity", "0.5");
            }
            

            await huopaAPI.append(fileDiv, fileName);
            await huopaAPI.append(fileListDiv, fileDiv);
        }
    } else {
        await huopaAPI.runApp("/home/applications/Text Editor.js", path);
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




renderFileList("/");