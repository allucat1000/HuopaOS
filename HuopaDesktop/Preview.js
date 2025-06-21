let path;
if (loadParams) {
    path = loadParams;
} else {
    const chooseTitle = await huopaAPI.createElement("h1");
    await setAttrs(chooseTitle, {
        "textContent":"Choose a file to view",
        "style":"color: white; text-align: center;"
    });
    await huopaAPI.appendToApp(chooseTitle);
    path = await huopaAPI.openFileDialog();
    await huopaAPI.deleteElement(chooseTitle);
}

const textEditorField = await huopaAPI.createElement("textarea");
const code = await huopaAPI.getFile(path) || ""
if (code === "[HuopaDesktop FS Security]: No permissions") {
    const alert = await huopaAPI.createElement("p");
    await setAttrs(alert, {
        "textContent":"Not right permissions. Unable to read file.",
        "style":"color: white; text-align: center; margin: 1em;"
    })
    await huopaAPI.appendToApp(alert);
} else {
    if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".webp")) {
        const imgPreview = await huopaAPI.createElement("img");
        await huopaAPI.setAttribute(imgPreview, "src", code);
        await huopaAPI.setCertainStyle(imgPreview, "margin", "0 auto");
        await huopaAPI.setCertainStyle(imgPreview, "display", "block");
        await huopaAPI.setCertainStyle(imgPreview, "borderRadius", "0.5em");
        await huopaAPI.setCertainStyle(imgPreview, "width", "100%");
        await huopaAPI.setCertainStyle(imgPreview, "height", "100%");
        await huopaAPI.setCertainStyle(imgPreview, "objectFit", "contain");
        await huopaAPI.appendToApp(imgPreview);
        return;
    }
    const saveButton = await huopaAPI.createElement("button");
    await setAttrs(saveButton, {
        "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>',
        "style":"margin: 0.5em; margin-top: 1em; display: inline; opacity: 1; padding: 0.5em;",
        "onclick": async() => {
            await huopaAPI.writeFile(path, "file", await huopaAPI.getAttribute(textEditorField, "value"));
        }
    });
    await huopaAPI.appendToApp(saveButton)
    await huopaAPI.setAttribute(textEditorField, "value", code);
    await huopaAPI.setCertainStyle(textEditorField, "height", "calc(100% - 83px)");
    await huopaAPI.setCertainStyle(textEditorField, "width", "calc(100% - 17px)");
    const currentPathTitle = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(currentPathTitle, "style", "color: white; display: inline; text-align: left; margin: 0.5em; font-size: 1em; margin-top: 1.15em;");
    const dynamicPath = path.split("/").pop();
    await huopaAPI.setAttribute(currentPathTitle, "textContent", dynamicPath);
    await huopaAPI.appendToApp(currentPathTitle);

    await huopaAPI.appendToApp(textEditorField);
            
}