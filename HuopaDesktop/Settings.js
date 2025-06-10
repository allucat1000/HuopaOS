mainScreen()

async function mainScreen() {
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setText(title, "Settings")
    await huopaAPI.setStyle(title, "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);
    const customizationTab = await huopaAPI.createElement("button");
    await huopaAPI.setText(customizationTab, "Customization");
    await huopaAPI.setStyle(customizationTab, "display: block; background-color: rgba(45, 45, 45, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.6); border-radius: 0.5em; color: white; margin: 0.5em auto; padding: 1.25em; width: 65%; cursor: pointer;")
    await huopaAPI.append(mainScreenDiv, customizationTab);
    await huopaAPI.setOnClick(customizationTab, () => {
        huopaAPI.deleteElement(mainScreenDiv);
        customizationTabLoad();
    });
}

async function customizationTabLoad() {
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setText(title, "Customization")
    await huopaAPI.setStyle(title, "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);
    const backButton = await huopaAPI.createElement("button");
    await huopaAPI.setText(backButton, "<- Back")
    await huopaAPI.setStyle(backButton, "display: block; background-color: rgba(45, 45, 45, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.6); border-radius: 0.5em; color: white; padding: 0.5em; cursor: pointer; position: fixed; bottom: 0.5em; left: 0.5em;");
    await huopaAPI.append(mainScreenDiv, backButton);
    await huopaAPI.setOnClick(backButton, async () => {
        await huopaAPI.deleteElement(mainScreenDiv);
        await mainScreen();
    });
    const wallpaperList = JSON.parse(await huopaAPI.getFile("/system/env/wallpapers") || []);

    if (wallpaperList.length < 1) {
        const warning = await huopaAPI.createElement("h2");
        await huopaAPI.setText(warning, 'You are in an outdated version of HuopaDesktop with an incorrect wallpaper config! Press "Shutdown" in the start menu and press "C" when you are in the terminal, then run "hpkg update" and "huopadesktop install".');
        await huopaAPI.setStyle(warning, "text-align: center; color: white; margin: 1em;");
        await huopaAPI.append(mainScrxeenDiv, warning);
        return;
    }
    const wallpaperChooseTitle = await huopaAPI.createElement("h2");
    await huopaAPI.setText(wallpaperChooseTitle, "Choose your wallpaper");
    await huopaAPI.setStyle(wallpaperChooseTitle, "text-align: center; color: white; margin: 1em;");
    await huopaAPI.append(mainScreenDiv, wallpaperChooseTitle);
    const wallpaperListDiv = await huopaAPI.createElement("div");
    await huopaAPI.setStyle(wallpaperListDiv, "display: flex; width: 95%; height: 100%; display: flex; flex-wrap: wrap; justify-content: center;");
    for (const wallpaperPath of wallpaperList) {
        const wallpaperButton = await huopaAPI.createElement("button")
        await huopaAPI.setStyle(wallpaperButton, "border-radius: 0.5em; padding: 0; width: 25%; aspect-ratio: 16 / 9; background-color: rgba(0, 0, 0, 0); margin: 1em; cursor: pointer; overflow: hidden; border: solid 2px white; min-width: 200px; flex: 1 0 100px; max-width: 200px;")
        const img = await huopaAPI.createElement("img");
        await huopaAPI.setStyle(img, "border-radius: 0.5em; width: 100%; height: 100%; background-size: cover; margin: 0; border-style: none; border-color: white; object-fit: cover; object-position: center;");
        const imageData = await huopaAPI.compressImage(await huopaAPI.getFile(wallpaperPath), 200, 112.5, "1");
        await huopaAPI.setSrc(img, imageData);
        await huopaAPI.append(wallpaperButton, img);
        await huopaAPI.append(wallpaperListDiv, wallpaperButton);
        await huopaAPI.setOnClick(wallpaperButton, async () => {
            await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt", "file", wallpaperPath);
        })
    }
    const importButton = await huopaAPI.createElement("button")
    await huopaAPI.setStyle(importButton, "border-radius: 0.5em; padding: 0; width: 25%; background-color: rgba(105, 105, 105, 0.3); margin: 1em; cursor: pointer; overflow: hidden; border: solid 2px white; min-width: 200px; flex: 1 0 100px; max-width: 200px; color: white; aspect-ratio: 16 / 9;")
    await huopaAPI.setText(importButton, "Add wallpaper from computer")
    await huopaAPI.append(wallpaperListDiv, importButton);
    await huopaAPI.setOnClick(importButton, async () => {
        const file = await huopaAPI.openFileImport(".png,.jpg,.webp,.jpeg", "dataURL");
        if (file) {
            await huopaAPI.writeFile("/system/env/wallpapers/" + file.name, "file", file.content);
            await huopaAPI.deleteElement(mainScreenDiv);
            await customizationTabLoad()

        }
        
    })
    await huopaAPI.append(mainScreenDiv, wallpaperListDiv);
    
}