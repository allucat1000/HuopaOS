mainScreen();

async function mainScreen() {
    await huopaAPI.setTitle("Settings");
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Settings");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);

    const wallpapersTab = await huopaAPI.createElement("button");

    const wallpapersTabIcon = await huopaAPI.createElement("img");
    const wTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallpaper-icon lucide-wallpaper"><circle cx="8" cy="9" r="2"/><path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>';
    await huopaAPI.setAttribute(wallpapersTabIcon, "style", "margin-right: 0.33em;")
    await huopaAPI.setAttribute(wallpapersTabIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(wTabIconSrc));
    const wTabLabel = await huopaAPI.createElement("label");
    await huopaAPI.setAttribute(wTabLabel, "textContent", "Wallpapers");
    await huopaAPI.append(wallpapersTab, wallpapersTabIcon);
    await huopaAPI.append(wallpapersTab, wTabLabel);
    await huopaAPI.setCertainStyle(wTabLabel, "cursor", "pointer");
    await huopaAPI.setCertainStyle(wallpapersTab, "display", "flex");
    await huopaAPI.setCertainStyle(wallpapersTab, "justifyContent", "center");

    await huopaAPI.setCertainStyle(wallpapersTab, "padding", "1.25em");
    await huopaAPI.setCertainStyle(wallpapersTab, "margin", "1em auto");
    await huopaAPI.setCertainStyle(wallpapersTab, "width", "65%");
    await huopaAPI.append(mainScreenDiv, wallpapersTab);
    await huopaAPI.setAttribute(wallpapersTab, "onclick", () => {
        huopaAPI.deleteElement(mainScreenDiv);
        wallpapersTabLoad();
    });


    const customizationTab = await huopaAPI.createElement("button");

    const customizationTabIcon = await huopaAPI.createElement("img");
    const cTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings2-icon lucide-settings-2"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>';
    await huopaAPI.setAttribute(customizationTabIcon, "style", "margin-right: 0.2em;")
    await huopaAPI.setAttribute(customizationTabIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(cTabIconSrc));
    const cTabLabel = await huopaAPI.createElement("label");
    await huopaAPI.setAttribute(cTabLabel, "textContent", "Customization")
    await huopaAPI.append(customizationTab, customizationTabIcon);
    await huopaAPI.append(customizationTab, cTabLabel);
    await huopaAPI.setCertainStyle(cTabLabel, "cursor", "pointer");
    await huopaAPI.setCertainStyle(customizationTab, "display", "flex");
    await huopaAPI.setCertainStyle(customizationTab, "justifyContent", "center");

    await huopaAPI.setCertainStyle(customizationTab, "padding", "1.25em");
    await huopaAPI.setCertainStyle(customizationTab, "margin", "1em auto");
    await huopaAPI.setCertainStyle(customizationTab, "width", "65%");
    await huopaAPI.append(mainScreenDiv, customizationTab);
    await huopaAPI.setAttribute(customizationTab, "onclick", () => {
        huopaAPI.deleteElement(mainScreenDiv);
        customizationTabLoad();
    });

    const dockTab = await huopaAPI.createElement("button");

    const dockTabIcon = await huopaAPI.createElement("img");
    const dTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dock-icon lucide-dock"><path d="M2 8h20"/><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 16h12"/></svg>';
    await huopaAPI.setAttribute(dockTabIcon, "style", "margin-right: 0.33em;")
    await huopaAPI.setAttribute(dockTabIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(dTabIconSrc));
    const dTabLabel = await huopaAPI.createElement("label");
    await huopaAPI.setAttribute(dTabLabel, "textContent", "Dock")
    await huopaAPI.append(dockTab, dockTabIcon);
    await huopaAPI.append(dockTab, dTabLabel);
    await huopaAPI.setCertainStyle(dTabLabel, "cursor", "pointer");
    await huopaAPI.setCertainStyle(dockTab, "display", "flex");
    await huopaAPI.setCertainStyle(dockTab, "justifyContent", "center");

    await huopaAPI.setCertainStyle(dockTab, "padding", "1.25em");
    await huopaAPI.setCertainStyle(dockTab, "margin", "1em auto");
    await huopaAPI.setCertainStyle(dockTab, "width", "65%");
    await huopaAPI.append(mainScreenDiv, dockTab);
    await huopaAPI.setAttribute(dockTab, "onclick", () => {
        huopaAPI.deleteElement(mainScreenDiv);
        dockTabLoad();
    });
}
async function wallpapersTabLoad() {
    await huopaAPI.setTitle("Settings — Wallpapers");
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Wallpapers");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);

    const backButton = await huopaAPI.createElement("button");
    await huopaAPI.setAttribute(backButton, "innerHTML", '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>');
    await huopaAPI.setAttribute(backButton, "style", "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;");

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
    await huopaAPI.setAttribute(wallpaperListDiv, "style", "display: flex; width: 95%; height: 100%; flex-wrap: wrap; justify-content: center; margin: 0.5em auto; padding-bottom: 1.5em;");

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
    const iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>';
    const importImg = await huopaAPI.createElement("img");
    await huopaAPI.setCertainStyle(importImg, "margin-bottom", "0.25em;")
    const importText = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(importText, "textContent", "Add wallpaper from computer");
    await huopaAPI.setAttribute(importImg, "src", "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc))
    const importButton = await huopaAPI.createElement("button");
    await huopaAPI.setCertainStyle(importButton, "width", "25%");
    await huopaAPI.setCertainStyle(importButton, "margin", "1em");
    await huopaAPI.setCertainStyle(importButton, "overflow", "hidden");
    await huopaAPI.setCertainStyle(importButton, "minWidth", "200px");
    await huopaAPI.setCertainStyle(importButton, "flex", "1 0 100px");
    await huopaAPI.setCertainStyle(importButton, "maxWidth", "200px");
    await huopaAPI.setCertainStyle(importButton, "aspectRatio", "16 / 9");

    await huopaAPI.append(importButton, importImg);
    await huopaAPI.append(importButton, importText);
    await huopaAPI.append(wallpaperListDiv, importButton);
    await huopaAPI.setAttribute(importButton, "onclick", async () => {
        const file = await huopaAPI.openFileImport(".png,.jpg,.webp,.jpeg", "dataURL");
        if (file) {
            await huopaAPI.writeFile("/system/env/wallpapers/" + file.name, "file", file.content);
            await huopaAPI.deleteElement(mainScreenDiv);
            await wallpapersTabLoad();
        }
    });

    await huopaAPI.append(mainScreenDiv, wallpaperListDiv);
}
async function customizationTabLoad() {
    await huopaAPI.setTitle("Settings — Customization");
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Customization");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);

    const backButton = await huopaAPI.createElement("button");
    await huopaAPI.setAttribute(backButton, "innerHTML", '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>');
    await huopaAPI.setAttribute(backButton, "style", "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;");

    await huopaAPI.append(mainScreenDiv, backButton);
    await huopaAPI.setAttribute(backButton, "onclick", async () => {
        await huopaAPI.deleteElement(mainScreenDiv);
        await mainScreen();
    });

    const bgBlurDiv = await huopaAPI.createElement("div");
    const bgBlurText = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(bgBlurText, "textContent", "Background blur level — Choose how blurred you want transparent backgrounds to be. (Requires restart for most elements)");
    await huopaAPI.setAttribute(bgBlurText, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(bgBlurDiv, "style", "margin: 2em;");
    await huopaAPI.append(bgBlurDiv, bgBlurText);
    await huopaAPI.append(mainScreenDiv, bgBlurDiv);
    const slider = await huopaAPI.createElement("input");
    await huopaAPI.setAttribute(slider, "type", "range");
    await huopaAPI.setAttribute(slider, "min", "0");
    await huopaAPI.setAttribute(slider, "max", "12");
    await huopaAPI.setAttribute(slider, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgblur.txt") || "3.5");
    await huopaAPI.setAttribute(slider, "step", "0.1");

    const label = await huopaAPI.createElement("span");
    await huopaAPI.setAttribute(label, "textContent", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgblur.txt") + "px" || "3.5px");
    await huopaAPI.setAttribute(label, "style", "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;");
    await huopaAPI.setCertainStyle(slider, "margin", "0.5em auto");
    await huopaAPI.setCertainStyle(slider, "display", "block");

    await huopaAPI.setAttribute(slider, "oninput", async () => {
        await huopaAPI.setAttribute(label, "textContent", await huopaAPI.getAttribute(slider, "value") + "px");
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/bgblur.txt", "file", await huopaAPI.getAttribute(slider, "value"))
    });

    await huopaAPI.append(bgBlurDiv, slider);
    await huopaAPI.append(bgBlurDiv, label);


    const bgOpacDiv = await huopaAPI.createElement("div");
    const bgOpacText = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(bgOpacText, "textContent", "Element opacity — Choose how transparent you want elements to be. (Requires restart for most elements)");
    await huopaAPI.setAttribute(bgOpacText, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(bgOpacDiv, "style", "margin: 2em;");
    await huopaAPI.append(bgOpacDiv, bgOpacText);
    await huopaAPI.append(mainScreenDiv, bgOpacDiv);
    const opacSlider = await huopaAPI.createElement("input");
    await huopaAPI.setAttribute(opacSlider, "type", "range");
    await huopaAPI.setAttribute(opacSlider, "min", "0.3");
    await huopaAPI.setAttribute(opacSlider, "max", "1");
    await huopaAPI.setAttribute(opacSlider, "step", "0.05");
    await huopaAPI.setAttribute(opacSlider, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgopac.txt") || "0.90");

    const opacLabel = await huopaAPI.createElement("span");
    await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgopac.txt") * 100) + "%");
    await huopaAPI.setAttribute(opacLabel, "style", "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;");
    await huopaAPI.setCertainStyle(opacSlider, "margin", "0.5em auto");
    await huopaAPI.setCertainStyle(opacSlider, "display", "block");

    await huopaAPI.setAttribute(opacSlider, "oninput", async () => {
        await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getAttribute(opacSlider, "value") * 100) + "%");
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/bgopac.txt", "file", await huopaAPI.getAttribute(opacSlider, "value"))
    });
    await huopaAPI.append(bgOpacDiv, opacSlider);
    await huopaAPI.append(bgOpacDiv, opacLabel);

    const appBorderColorDiv = await huopaAPI.createElement("div");
    const appBorderColorTitle = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(appBorderColorTitle, "textContent", "Window border color — Choose the color of window borders.");
    await huopaAPI.setAttribute(appBorderColorTitle, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(appBorderColorDiv, "style", "margin: 2em; padding-bottom: 1.5em;");
    await huopaAPI.append(appBorderColorDiv, appBorderColorTitle);
    await huopaAPI.append(mainScreenDiv, appBorderColorDiv);

    const appBorderColorPicker = await huopaAPI.createElement("input");
    await huopaAPI.setAttribute(appBorderColorPicker, "type", "color");
    await huopaAPI.setAttribute(appBorderColorPicker, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt") || "");
    await huopaAPI.append(mainScreenDiv, appBorderColorPicker);
    await huopaAPI.setCertainStyle(appBorderColorDiv, "margin", "1em");

    await huopaAPI.setAttribute(appBorderColorPicker, "oninput", async () => {
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt", "file", await huopaAPI.getAttribute(appBorderColorPicker, "value"));
    });

    await huopaAPI.append(appBorderColorDiv, appBorderColorPicker);
}

async function dockTabLoad() {
    await huopaAPI.setTitle("Settings — Dock");
    const mainScreenDiv = await huopaAPI.createElement("div");
    const title = await huopaAPI.createElement("h1");
    await huopaAPI.setAttribute(title, "textContent", "Dock");
    await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
    await huopaAPI.appendToApp(mainScreenDiv);
    await huopaAPI.append(mainScreenDiv, title);

    const backButton = await huopaAPI.createElement("button");
    await huopaAPI.setAttribute(backButton, "innerHTML", '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>');
    await huopaAPI.setAttribute(backButton, "style", "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;");
    await huopaAPI.append(mainScreenDiv, backButton);
    await huopaAPI.setAttribute(backButton, "onclick", async () => {
        await huopaAPI.deleteElement(mainScreenDiv);
        await mainScreen();
    });

    const dockDockedDiv = await huopaAPI.createElement("div");
    const dockDockedTitle = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(dockDockedTitle, "textContent", "Dock to screen edge — Make the dock fill the screen edges (Requires restart)");
    await huopaAPI.setAttribute(dockDockedTitle, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(dockDockedDiv, "style", "margin: 2em; padding-bottom: 1.5em;");
    await huopaAPI.append(dockDockedDiv, dockDockedTitle);
    await huopaAPI.append(mainScreenDiv, dockDockedDiv);

    const dockDockedCheckbox = await huopaAPI.createElement("input");
    await huopaAPI.setAttribute(dockDockedCheckbox, "type", "checkbox");
    await huopaAPI.setAttribute(dockDockedCheckbox, "checked", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt") || false);
    await huopaAPI.append(mainScreenDiv, dockDockedCheckbox);
    await huopaAPI.setCertainStyle(dockDockedDiv, "margin", "1em");
    await huopaAPI.setCertainStyle(dockDockedCheckbox, "margin", "1em auto");
    await huopaAPI.setCertainStyle(dockDockedCheckbox, "display", "block");

    await huopaAPI.setAttribute(dockDockedCheckbox, "oninput", async () => {
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt", "file", await huopaAPI.getAttribute(dockDockedCheckbox, "checked"));
    });

    await huopaAPI.append(dockDockedDiv, dockDockedCheckbox);

    const dockOpacDiv = await huopaAPI.createElement("div");
    const dockOpacText = await huopaAPI.createElement("p");
    await huopaAPI.setAttribute(dockOpacText, "textContent", "Dock opacity — Choose how transparent you want the dock to be. (Requires restart)");
    await huopaAPI.setAttribute(dockOpacText, "style", "text-align: center; color: white; margin: 0.5em;");
    await huopaAPI.setAttribute(dockOpacDiv, "style", "margin: 2em;");
    await huopaAPI.append(dockOpacDiv, dockOpacText);
    await huopaAPI.append(mainScreenDiv, dockOpacDiv);
    const opacSlider = await huopaAPI.createElement("input");
    await huopaAPI.setAttribute(opacSlider, "type", "range");
    await huopaAPI.setAttribute(opacSlider, "min", "0.3");
    await huopaAPI.setAttribute(opacSlider, "max", "1");
    await huopaAPI.setAttribute(opacSlider, "step", "0.05");
    await huopaAPI.setAttribute(opacSlider, "value", await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockopac.txt"));

    const opacLabel = await huopaAPI.createElement("span");
    await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockopac.txt") * 100) + "%");
    await huopaAPI.setAttribute(opacLabel, "style", "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;");
    await huopaAPI.setCertainStyle(opacSlider, "margin", "0.5em auto");
    await huopaAPI.setCertainStyle(opacSlider, "display", "block");

    await huopaAPI.setAttribute(opacSlider, "oninput", async () => {
        await huopaAPI.setAttribute(opacLabel, "textContent", Math.round(await huopaAPI.getAttribute(opacSlider, "value") * 100) + "%");
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/dockopac.txt", "file", await huopaAPI.getAttribute(opacSlider, "value"))
    });
    await huopaAPI.append(dockOpacDiv, opacSlider);
    await huopaAPI.append(dockOpacDiv, opacLabel);

}