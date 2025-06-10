mainScreen();

async function mainScreen() {
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Settings");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);

    const customizationTab = await huopaAPI.createElement("button");
    await huopaAPI.setAttribute(customizationTab, "textContent", "Customization");
    await huopaAPI.setCertainStyle(customizationTab, "padding", "1.25em");
    await huopaAPI.setCertainStyle(customizationTab, "margin", "0.5em auto");
    await huopaAPI.setCertainStyle(customizationTab, "width", "65%");
    await huopaAPI.append(mainScreenDiv, customizationTab);
    await huopaAPI.setAttribute(customizationTab, "onclick", () => {
        huopaAPI.deleteElement(mainScreenDiv);
        customizationTabLoad();
    });
}

async function customizationTabLoad() {
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Customization");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);

    const backButton = await huopaAPI.createElement("button");
    await huopaAPI.setAttribute(backButton, "textContent", "<- Back");
    await huopaAPI.setCertainStyle(backButton, "padding", "1em");
    await huopaAPI.setCertainStyle(backButton, "position", "fixed");
    await huopaAPI.setCertainStyle(backButton, "left", "0.5em");
    await huopaAPI.setCertainStyle(backButton, "bottom", "0.5em");

    await huopaAPI.append(mainScreenDiv, backButton);
    await huopaAPI.setAttribute(backButton, "onclick", async () => {
        await huopaAPI.deleteElement(mainScreenDiv);
        await mainScreen();
    });

    const wallpaperList = JSON.parse(await huopaAPI.getFile("/system/env/wallpapers") || "[]");

    if (wallpaperList.length < 1) {
        const warning = await huopaAPI.createElement("h2");
        await huopaAPI.setAttribute(warning, "textContent", 'You are in an outdated version of HuopaDesktop with an incorrect wallpaper config! Press "Shutdown" in the start menu and press "C" when you are in the terminal, then run "hpkg update" and "huopadesktop install".');
        await huopaAPI.setAttribute(warning, "style", "text-align: center; color: white; margin: 1em;");
        await huopaAPI.append(mainScreenDiv, warning);
        return;
    }

    const wallpaperChooseTitle = await huopaAPI.createElement("h2");
    await huopaAPI.setAttribute(wallpaperChooseTitle, "textContent", "Choose your wallpaper");
    await huopaAPI.setAttribute(wallpaperChooseTitle, "style", "text-align: center; color: white; margin: 1em;");
    await huopaAPI.append(mainScreenDiv, wallpaperChooseTitle);

    const wallpaperListDiv = await huopaAPI.createElement("div");
    await huopaAPI.setAttribute(wallpaperListDiv, "style", "display: flex; width: 95%; height: 100%; flex-wrap: wrap; justify-content: center;");

    for (const wallpaperPath of wallpaperList) {
        const wallpaperButton = await huopaAPI.createElement("button");
        await huopaAPI.setCertainStyle(wallpaperButton, "width", "25%");
        await huopaAPI.setCertainStyle(wallpaperButton, "margin", "1em");
        await huopaAPI.setCertainStyle(wallpaperButton, "overflow", "hidden");
        await huopaAPI.setCertainStyle(wallpaperButton, "minWidth", "200px");
        await huopaAPI.setCertainStyle(wallpaperButton, "flex", "1 0 100px");
        await huopaAPI.setCertainStyle(wallpaperButton, "maxWidth", "200px");
        await huopaAPI.setCertainStyle(wallpaperButton, "aspectRatio", "16 / 9");
        await huopaAPI.setCertainStyle(wallpaperButton, "backgroundColor", "rgba(0, 0, 0, 0");
        await huopaAPI.setCertainStyle(wallpaperButton, "padding", "0")

        const img = await huopaAPI.createElement("img");
        await huopaAPI.setAttribute(img, "style", "border-radius: 0.5em; width: 100%; height: 100%; background-size: cover; margin: 0; border-style: none; border-color: white; object-fit: cover; object-position: center;");
        const imageData = await huopaAPI.compressImage(await huopaAPI.getFile(wallpaperPath), 200, 112.5, "1");
        await huopaAPI.setAttribute(img, "src", imageData);

        await huopaAPI.append(wallpaperButton, img);
        await huopaAPI.append(wallpaperListDiv, wallpaperButton);
        await huopaAPI.setAttribute(wallpaperButton, "onclick", async () => {
            await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt", "file", wallpaperPath);
        });
    }

    const importButton = await huopaAPI.createElement("button");
    await huopaAPI.setCertainStyle(importButton, "width", "25%");
    await huopaAPI.setCertainStyle(importButton, "margin", "1em");
    await huopaAPI.setCertainStyle(importButton, "overflow", "hidden");
    await huopaAPI.setCertainStyle(importButton, "minWidth", "200px");
    await huopaAPI.setCertainStyle(importButton, "flex", "1 0 100px");
    await huopaAPI.setCertainStyle(importButton, "maxWidth", "200px");
    await huopaAPI.setCertainStyle(importButton, "aspectRatio", "16 / 9");

    await huopaAPI.setAttribute(importButton, "textContent", "Add wallpaper from computer");
    await huopaAPI.append(wallpaperListDiv, importButton);
    await huopaAPI.setAttribute(importButton, "onclick", async () => {
        const file = await huopaAPI.openFileImport(".png,.jpg,.webp,.jpeg", "dataURL");
        if (file) {
            await huopaAPI.writeFile("/system/env/wallpapers/" + file.name, "file", file.content);
            await huopaAPI.deleteElement(mainScreenDiv);
            await customizationTabLoad();
        }
    });

    await huopaAPI.append(mainScreenDiv, wallpaperListDiv);

    const otherTitle = await huopaAPI.createElement("h2");
    await huopaAPI.setAttribute(otherTitle, "textContent", "Other options");
    await huopaAPI.setAttribute(otherTitle, "style", "text-align: center; margin: 1em;");
    await huopaAPI.append(mainScreenDiv, otherTitle);

    const bgBlurDiv = await huopaAPI.createElement("div");
    const bgBlurText = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(bgBlurText, "textContent", "Background blur level — Choose how blurred you want transparent backgrounds to be.");
    await huopaAPI.setAttribute(bgBlurText, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(bgBlurDiv, "style", "margin: 2em;");
    await huopaAPI.append(bgBlurDiv, bgBlurText);
    await huopaAPI.append(mainScreenDiv, bgBlurDiv);
    const slider = await huopaAPI.createElement("input");
    await huopaAPI.setAttribute(slider, "type", "range");
    await huopaAPI.setAttribute(slider, "min", "0");
    await huopaAPI.setAttribute(slider, "max", "12");
    await huopaAPI.setAttribute(slider, "value", "3.5");
    await huopaAPI.setAttribute(slider, "step", "0.1");

    const label = await huopaAPI.createElement("span");
    await huopaAPI.setAttribute(label, "textContent", "3.5px");
    await huopaAPI.setAttribute(label, "style", "color: white; display: block; text-align: center; margin: 0.5em auto;");
    await huopaAPI.setCertainStyle(slider, "margin", "0.5em auto");

    // await huopaAPI.setAttribute(slider, "oninput", async () => {
        await huopaAPI.setAttribute(label, "textContent", await huopaAPI.getAttribute(slider, "value"));
    // });

    await huopaAPI.append(mainScreenDiv, slider);
    await huopaAPI.append(mainScreenDiv, label);
}
