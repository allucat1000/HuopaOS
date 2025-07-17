mainScreen();

async function mainScreen() {
    await huopaAPI.setTitle("Settings");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Settings");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const wallpapersTab = document.createElement("button");

    const wallpapersTabIcon = document.createElement("img");
    const wTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallpaper-icon lucide-wallpaper"><circle cx="8" cy="9" r="2"/><path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>';
    await huopaAPI.setAttribute(wallpapersTabIcon, "style", "margin-right: 0.33em;")
    await huopaAPI.setAttribute(wallpapersTabIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(wTabIconSrc));
    const wTabLabel = document.createElement("label");
    await huopaAPI.setAttribute(wTabLabel, "textContent", "Wallpapers");
    wallpapersTab.append(wallpapersTabIcon);
    wallpapersTab.append(wTabLabel);
    await huopaAPI.setCertainStyle(wTabLabel, "cursor", "pointer");
    await huopaAPI.setCertainStyle(wallpapersTab, "display", "flex");
    await huopaAPI.setCertainStyle(wallpapersTab, "justifyContent", "center");

    await huopaAPI.setCertainStyle(wallpapersTab, "padding", "1.25em");
    await huopaAPI.setCertainStyle(wallpapersTab, "margin", "1em auto");
    await huopaAPI.setCertainStyle(wallpapersTab, "width", "65%");
    mainScreenDiv.append(wallpapersTab);
    await huopaAPI.setAttribute(wallpapersTab, "onclick", () => {
        huopaAPI.deleteElement(mainScreenDiv);
        wallpapersTabLoad();
    });


    const customizationTab = document.createElement("button");

    const customizationTabIcon = document.createElement("img");
    const cTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings2-icon lucide-settings-2"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>';
    await huopaAPI.setAttribute(customizationTabIcon, "style", "margin-right: 0.2em;")
    await huopaAPI.setAttribute(customizationTabIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(cTabIconSrc));
    const cTabLabel = document.createElement("label");
    await huopaAPI.setAttribute(cTabLabel, "textContent", "Customization")
    customizationTab.append(customizationTabIcon);
    customizationTab.append(cTabLabel);
    await huopaAPI.setCertainStyle(cTabLabel, "cursor", "pointer");
    await huopaAPI.setCertainStyle(customizationTab, "display", "flex");
    await huopaAPI.setCertainStyle(customizationTab, "justifyContent", "center");

    await huopaAPI.setCertainStyle(customizationTab, "padding", "1.25em");
    await huopaAPI.setCertainStyle(customizationTab, "margin", "1em auto");
    await huopaAPI.setCertainStyle(customizationTab, "width", "65%");
    mainScreenDiv.append(customizationTab);
    await huopaAPI.setAttribute(customizationTab, "onclick", () => {
        huopaAPI.deleteElement(mainScreenDiv);
        customizationTabLoad();
    });

    const dockTab = document.createElement("button");

    const dockTabIcon = document.createElement("img");
    const dTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dock-icon lucide-dock"><path d="M2 8h20"/><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 16h12"/></svg>';
    await huopaAPI.setAttribute(dockTabIcon, "style", "margin-right: 0.33em;")
    await huopaAPI.setAttribute(dockTabIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(dTabIconSrc));
    const dTabLabel = document.createElement("label");
    await huopaAPI.setAttribute(dTabLabel, "textContent", "Dock")
    dockTab.append(dockTabIcon);
    dockTab.append(dTabLabel);
    await huopaAPI.setCertainStyle(dTabLabel, "cursor", "pointer");
    await huopaAPI.setCertainStyle(dockTab, "display", "flex");
    await huopaAPI.setCertainStyle(dockTab, "justifyContent", "center");

    await huopaAPI.setCertainStyle(dockTab, "padding", "1.25em");
    await huopaAPI.setCertainStyle(dockTab, "margin", "1em auto");
    await huopaAPI.setCertainStyle(dockTab, "width", "65%");
    mainScreenDiv.append(dockTab);
    await huopaAPI.setAttribute(dockTab, "onclick", () => {
        huopaAPI.deleteElement(mainScreenDiv);
        dockTabLoad();
    });
}
async function wallpapersTabLoad() {
    await huopaAPI.setTitle("Settings — Wallpapers");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Wallpapers");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    await huopaAPI.setAttribute(backButton, "innerHTML", '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>');
    await huopaAPI.setAttribute(backButton, "style", "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;");

    mainScreenDiv.append(backButton);
    await huopaAPI.setAttribute(backButton, "onclick", async () => {
        mainScreenDiv.remove()
        await mainScreen();
    });

    const wallpaperList = JSON.parse(await huopaAPI.getFile("/system/env/wallpapers") || "[]");

    if (wallpaperList.length < 1) {
        const warning = document.createElement("h2");
        await huopaAPI.setAttribute(warning, "textContent", 'You are in an outdated version of HuopaDesktop with an incorrect wallpaper config! Press "Shutdown" in the start menu and press "C" when you are in the terminal, then run "hpkg update" and "huopadesktop install".');
        await huopaAPI.setAttribute(warning, "style", "text-align: center; color: white; margin: 1em;");
        await mainScreenDiv.append(warning);
        return;
    }

    const wallpaperChooseTitle = document.createElement("h2");
    await huopaAPI.setAttribute(wallpaperChooseTitle, "textContent", "Choose your wallpaper");
    await huopaAPI.setAttribute(wallpaperChooseTitle, "style", "text-align: center; color: white; margin: 1em;");
    mainScreenDiv.append(wallpaperChooseTitle);

    const wallpaperListDiv = document.createElement("div");
    await huopaAPI.setAttribute(wallpaperListDiv, "style", "display: flex; width: 95%; height: 100%; flex-wrap: wrap; justify-content: center; margin: 0.5em auto; padding-bottom: 1.5em;");

    for (const wallpaperPath of wallpaperList) {
        const wallpaperButton = document.createElement("button");
        await huopaAPI.setCertainStyle(wallpaperButton, "width", "25%");
        await huopaAPI.setCertainStyle(wallpaperButton, "margin", "1em");
        await huopaAPI.setCertainStyle(wallpaperButton, "overflow", "hidden");
        await huopaAPI.setCertainStyle(wallpaperButton, "minWidth", "200px");
        await huopaAPI.setCertainStyle(wallpaperButton, "flex", "1 0 100px");
        await huopaAPI.setCertainStyle(wallpaperButton, "maxWidth", "200px");
        await huopaAPI.setCertainStyle(wallpaperButton, "aspectRatio", "16 / 9");
        await huopaAPI.setCertainStyle(wallpaperButton, "backgroundColor", "rgba(0, 0, 0, 0");
        await huopaAPI.setCertainStyle(wallpaperButton, "padding", "0")

        const img = document.createElement("img");
        await huopaAPI.setAttribute(img, "style", "border-radius: 0.5em; width: 100%; height: 100%; background-size: cover; margin: 0; border-style: none; border-color: white; object-fit: cover; object-position: center;");
        const imageData = await huopaAPI.compressImage(await huopaAPI.getFile(wallpaperPath), 200, 112.5, "1");
        await huopaAPI.setAttribute(img, "src", imageData);

        wallpaperButton.append(img);
        wallpaperListDiv.append(wallpaperButton);
        await huopaAPI.setAttribute(wallpaperButton, "onclick", async () => {
            await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt", "file", wallpaperPath);
        });
    }
    const iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>';
    const importImg = document.createElement("img");
    await huopaAPI.setCertainStyle(importImg, "margin-bottom", "0.25em;")
    const importText = document.createElement("p");
    await huopaAPI.setAttribute(importText, "textContent", "Add wallpaper from computer");
    await huopaAPI.setAttribute(importImg, "src", "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc))
    const importButton = document.createElement("button");
    await huopaAPI.setCertainStyle(importButton, "width", "25%");
    await huopaAPI.setCertainStyle(importButton, "margin", "1em");
    await huopaAPI.setCertainStyle(importButton, "overflow", "hidden");
    await huopaAPI.setCertainStyle(importButton, "minWidth", "200px");
    await huopaAPI.setCertainStyle(importButton, "flex", "1 0 100px");
    await huopaAPI.setCertainStyle(importButton, "maxWidth", "200px");
    await huopaAPI.setCertainStyle(importButton, "aspectRatio", "16 / 9");

    importButton.append(importImg);
    importButton.append(importText);
    wallpaperListDiv.append(importButton);
    await huopaAPI.setAttribute(importButton, "onclick", async () => {
        const file = await huopaAPI.openFileImport(".png,.jpg,.webp,.jpeg", "dataURL");
        if (file) {
            await huopaAPI.writeFile("/system/env/wallpapers/" + file.name, "file", file.content);
            mainScreenDiv.remove()
            await wallpapersTabLoad();
        }
    });

    mainScreenDiv.append(wallpaperListDiv);
}
async function customizationTabLoad() {
    await huopaAPI.setTitle("Settings — Customization");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Customization");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    await huopaAPI.setAttribute(backButton, "innerHTML", '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>');
    await huopaAPI.setAttribute(backButton, "style", "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;");

    mainScreenDiv.append(backButton);
    await huopaAPI.setAttribute(backButton, "onclick", async () => {
        mainScreenDiv.remove()
        await mainScreen();
    });

    const bgBlurDiv = document.createElement("div");
    const bgBlurText = document.createElement("p");
    await huopaAPI.setAttribute(bgBlurText, "textContent", "Background blur level — Choose how blurred you want transparent backgrounds to be. (Requires restart for most elements)");
    await huopaAPI.setAttribute(bgBlurText, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(bgBlurDiv, "style", "margin: 2em;");
    bgBlurDiv.append(bgBlurText);
    mainScreenDiv.append(bgBlurDiv);
    const slider = document.createElement("input");
    await huopaAPI.setAttribute(slider, "type", "range");
    await huopaAPI.setAttribute(slider, "min", "0");
    await huopaAPI.setAttribute(slider, "max", "12");
    await huopaAPI.setAttribute(slider, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgblur.txt") || "3.5");
    await huopaAPI.setAttribute(slider, "step", "0.1");

    const label = document.createElement("span");
    await huopaAPI.setAttribute(label, "textContent", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgblur.txt") + "px" || "3.5px");
    await huopaAPI.setAttribute(label, "style", "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;");
    await huopaAPI.setCertainStyle(slider, "margin", "0.5em auto");
    await huopaAPI.setCertainStyle(slider, "display", "block");

    await huopaAPI.setAttribute(slider, "oninput", async () => {
        await huopaAPI.setAttribute(label, "textContent", await huopaAPI.getAttribute(slider, "value") + "px");
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/bgblur.txt", "file", await huopaAPI.getAttribute(slider, "value"))
    });

    bgBlurDiv.append(slider);
    bgBlurDiv.append(label);


    const bgOpacDiv = document.createElement("div");
    const bgOpacText = document.createElement("p");
    await huopaAPI.setAttribute(bgOpacText, "textContent", "Element opacity — Choose how transparent you want elements to be. (Requires restart for most elements)");
    await huopaAPI.setAttribute(bgOpacText, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(bgOpacDiv, "style", "margin: 2em;");
    bgOpacDiv.append(bgOpacText);
    mainScreenDiv.append(bgOpacDiv);
    const opacSlider = document.createElement("input");
    await huopaAPI.setAttribute(opacSlider, "type", "range");
    await huopaAPI.setAttribute(opacSlider, "min", "0.3");
    await huopaAPI.setAttribute(opacSlider, "max", "1");
    await huopaAPI.setAttribute(opacSlider, "step", "0.05");
    await huopaAPI.setAttribute(opacSlider, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgopac.txt") || "0.90");

    const opacLabel = document.createElement("span");
    await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgopac.txt") * 100) + "%");
    await huopaAPI.setAttribute(opacLabel, "style", "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;");
    await huopaAPI.setCertainStyle(opacSlider, "margin", "0.5em auto");
    await huopaAPI.setCertainStyle(opacSlider, "display", "block");

    await huopaAPI.setAttribute(opacSlider, "oninput", async () => {
        await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getAttribute(opacSlider, "value") * 100) + "%");
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/bgopac.txt", "file", await huopaAPI.getAttribute(opacSlider, "value"))
    });
    bgOpacDiv.append(opacSlider);
    bgOpacDiv.append(opacLabel);

    const appBorderColorDiv = document.createElement("div");
    const appBorderColorTitle = document.createElement("p");
    await huopaAPI.setAttribute(appBorderColorTitle, "textContent", "Window border color — Choose the color of window borders.");
    await huopaAPI.setAttribute(appBorderColorTitle, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(appBorderColorDiv, "style", "margin: 2em; padding-bottom: 1.5em;");
    appBorderColorDiv.append(appBorderColorTitle);
    mainScreenDiv.append(appBorderColorDiv);

    const appBorderColorPicker = document.createElement("input");
    await huopaAPI.setAttribute(appBorderColorPicker, "type", "color");
    await huopaAPI.setAttribute(appBorderColorPicker, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt") || "");
    mainScreenDiv.append(appBorderColorPicker);
    await huopaAPI.setCertainStyle(appBorderColorDiv, "margin", "1em");

    await huopaAPI.setAttribute(appBorderColorPicker, "oninput", async () => {
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt", "file", await huopaAPI.getAttribute(appBorderColorPicker, "value"));
    });

    appBorderColorDiv.append(appBorderColorPicker);
}

async function dockTabLoad() {
    await huopaAPI.setTitle("Settings — Dock");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Dock");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    await huopaAPI.setAttribute(backButton, "innerHTML", '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>');
    await huopaAPI.setAttribute(backButton, "style", "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;");
    mainScreenDiv.append(backButton);
    await huopaAPI.setAttribute(backButton, "onclick", async () => {
        mainScreenDiv.remove();
        await mainScreen();
    });

    const dockDockedDiv = document.createElement("div");
    const dockDockedTitle = document.createElement("p");
    await huopaAPI.setAttribute(dockDockedTitle, "textContent", "Dock to screen edge — Make the dock fill the screen edges (Requires restart)");
    await huopaAPI.setAttribute(dockDockedTitle, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(dockDockedDiv, "style", "margin: 2em; padding-bottom: 1.5em;");
    dockDockedDiv.append(dockDockedTitle);
    mainScreenDiv.append(dockDockedDiv);

    const dockDockedCheckbox = document.createElement("input");
    await huopaAPI.setAttribute(dockDockedCheckbox, "type", "checkbox");
    await huopaAPI.setAttribute(dockDockedCheckbox, "checked", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt") || false);
    mainScreenDiv.append(dockDockedCheckbox);
    await huopaAPI.setCertainStyle(dockDockedDiv, "margin", "1em");
    await huopaAPI.setCertainStyle(dockDockedCheckbox, "margin", "1em auto");
    await huopaAPI.setCertainStyle(dockDockedCheckbox, "display", "block");

    await huopaAPI.setAttribute(dockDockedCheckbox, "oninput", async () => {
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt", "file", await huopaAPI.getAttribute(dockDockedCheckbox, "checked"));
    });

    dockDockedDiv.append(dockDockedCheckbox);

    const dockOpacDiv = document.createElement("div");
    const dockOpacText = document.createElement("p");
    await huopaAPI.setAttribute(dockOpacText, "textContent", "Dock opacity — Choose how transparent you want the dock to be. (Requires restart)");
    await huopaAPI.setAttribute(dockOpacText, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(dockOpacDiv, "style", "margin: 2em;");
    dockOpacDiv.append(dockOpacText);
    mainScreenDiv.append(dockOpacDiv);
    const opacSlider = document.createElement("input");
    await huopaAPI.setAttribute(opacSlider, "type", "range");
    await huopaAPI.setAttribute(opacSlider, "min", "0.3");
    await huopaAPI.setAttribute(opacSlider, "max", "1");
    await huopaAPI.setAttribute(opacSlider, "step", "0.05");
    await huopaAPI.setAttribute(opacSlider, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockopac.txt"));

    const opacLabel = document.createElement("span");
    await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockopac.txt") * 100) + "%");
    await huopaAPI.setAttribute(opacLabel, "style", "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;");
    await huopaAPI.setCertainStyle(opacSlider, "margin", "0.5em auto");
    await huopaAPI.setCertainStyle(opacSlider, "display", "block");

    await huopaAPI.setAttribute(opacSlider, "oninput", async () => {
        await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getAttribute(opacSlider, "value") * 100) + "%");
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/dockopac.txt", "file", await huopaAPI.getAttribute(opacSlider, "value"))
    });
    dockOpacDiv.append(opacSlider);
    dockOpacDiv.append(opacLabel);

}