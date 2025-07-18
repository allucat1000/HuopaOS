let path;
if (loadParams) {
    path = loadParams;
} else {
    const chooseTitle = document.createElement("h1");
    await setAttrs(chooseTitle, {
        "textContent":"Choose a file to view",
        "style":"color: white; text-align: center;"
    });
    document.body.append(chooseTitle);
    path = await huopaAPI.openFileDialog();
   chooseTitle.remove()
}

const textEditorField = document.createElement("textarea");
const code = await huopaAPI.getFile(path) || ""
if (code === "[HuopaDesktop FS Security]: No permissions") {
    const alert = document.createElement("p");
    await setAttrs(alert, {
        "textContent":"Not right permissions. Unable to read file.",
        "style":"color: white; text-align: center; margin: 1em;"
    })
    document.body.append(alert);
} else {
    if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".webp")) {
        const imgPreview = document.createElement("img");
        imgPreview.src = code;
        imgPreview.margin = "0 auto";
        imgPreview.display = "block";
        imgPreview.borderRadius = "0.5em";
        imgPreview.width = "100%";
        imgPreview.height = "100%";
        imgPreview.objectFit = "contain";
        document.body.append(imgPreview);
        return;
    }
    const saveButton = document.createElement("button");
    await setAttrs(saveButton, {
        "innerHTML":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>',
        "style":"margin: 0.5em; margin-top: 1em; display: inline; opacity: 1; padding: 0.5em;",
        "onclick": async() => {
            await huopaAPI.writeFile(path, "file", textEditorField.value);
        }
    });
    document.body.append(saveButton)
    textEditorField.value = code;
    textEditorField.height = "calc(100% - 83px)";
    textEditorField.width = "calc(100% - 17px)";
    const currentPathTitle = document.createElement("p");
    currentPathTitle.style = "color: white; display: inline; text-align: left; margin: 0.5em; font-size: 1em; margin-top: 1.15em;";
    const dynamicPath = path.split("/").pop();
    currentPathTitle.textContent = dynamicPath;
    document.body.append(currentPathTitle);

    document.body.append(textEditorField);
            
}