let fileListDiv;

async function renderFileList(path) {
    if (fileListDiv) {
        await huopaAPI.deleteElement(fileListDiv);
    }
    fileListDiv = await huopaAPI.createElement("div");
    await huopaAPI.setAttribute(fileListDiv, "id", "fileList");
    const backButton = await huopaAPI.createElement("button");
    const topBarList = await huopaAPI.createElement("div");
    await huopaAPI.setAttribute(fileListDiv, "style", "width: 100%; height: calc(100% - 20px); display: flex; flex-direction: column; margin-bottom: -0.25em;");
    await huopaAPI.setAttribute(topBarList, "style", "display: flex; align-items: center; justify-content: start; padding: 0.25em; margin-top: 0.66em;");
    await setAttrs(backButton, {
        "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
        "style":"margin: 0.5em; display: inline; opacity: 1;"
    });
    if (path === "/") {
        await huopaAPI.setCertainStyle(backButton, "opacity", "0.5");
        await huopaAPI.setCertainStyle(backButton, "cursor", "default");
    } else {
        await huopaAPI.setAttribute(backButton, "onclick", async() => {
            let parentPath = path.split("/").slice(0, -1).join("/");
            if (!parentPath) parentPath = "/";
            renderFileList(parentPath);
        })
    }
    await huopaAPI.setCertainStyle(backButton, "padding", "0.5em");
    await huopaAPI.append(topBarList, backButton);
    const currentPathTitle = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(currentPathTitle, "style", "color: white; display: inline; text-align: left; margin: 0.5em; font-size: 1.5em;")
    await huopaAPI.setAttribute(currentPathTitle, "textContent", path);
    await huopaAPI.append(topBarList, currentPathTitle);
    await huopaAPI.append(fileListDiv, topBarList)
    await huopaAPI.appendToApp(fileListDiv) 
    const match = path.match(/\.[a-zA-Z0-9]+$/);
    if (await isDir(path) && !match) {
        let perms = true;
        let fileList = await huopaAPI.getFile(path);
        if (fileList === "[HuopaDesktop FS Security]: No permissions") {
            fileList = '["You do not have permissions to read this file or dir, as it is in SafeStorage!"]';
            perms = false;
        } else {
            fileList = JSON.parse(fileList);
        }
        
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
                    if (file.endsWith(".js") && notDir) {
                        await huopaAPI.runApp(file);
                    } else {
                        await renderFileList(file)
                    }
                });
            } else {
                await huopaAPI.setCertainStyle(fileDiv, "opacity", "0.5");
            }
            

            await huopaAPI.append(fileDiv, fileName);
            await huopaAPI.append(fileListDiv, fileDiv);
        }
    } else {
        const textEditorField = await huopaAPI.createElement("textarea");
        const code = await huopaAPI.getFile(path) || ""
        if (code === "[HuopaDesktop FS Security]: No permissions") {
            const alert = await huopaAPI.createElement("p");
            await setAttrs(alert, {
                "textContent":"Not right permissions. Unable to read file.",
                "style":"color: white; text-align: center;"
            })
            await huopaAPI.append(fileListDiv, alert);
        } else {
            const saveButton = await huopaAPI.createElement("button");
            await setAttrs(saveButton, {
                "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>',
                "style":"margin: 0.5em; display: inline; opacity: 1; padding: 0.5em;",
                "onclick": async() => {
                    await huopaAPI.writeFile(path, "file", await huopaAPI.getAttribute(textEditorField, "value"));
                }
            });
            await huopaAPI.append(topBarList, saveButton)
            await huopaAPI.setAttribute(textEditorField, "value", code);
            await huopaAPI.setCertainStyle(textEditorField, "flexGrow", "1");
            await huopaAPI.setCertainStyle(textEditorField, "width", "95%");
            await huopaAPI.append(fileListDiv, textEditorField);
            
        }
        
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