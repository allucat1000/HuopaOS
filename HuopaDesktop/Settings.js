mainScreen();

async function mainScreen() {
    await huopaAPI.setTitle("Settings");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Settings";
    title.style = "text-align: center;  margin: 1em;";
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const wallpapersTab = document.createElement("button");

    const wallpapersTabIcon = document.createElement("img");
    const wTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallpaper-icon lucide-wallpaper"><circle cx="8" cy="9" r="2"/><path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>';
    wallpapersTabIcon.style = "margin-right: 0.33em;"
    setAttrs(wallpapersTabIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(wTabIconSrc)})
;
    const wTabLabel = document.createElement("label");
    wTabLabel.textContent = "Wallpapers";
    wallpapersTab.append(wallpapersTabIcon);
    wallpapersTab.append(wTabLabel);
    wTabLabel.style.cursor = "pointer";
    wallpapersTab.style.display = "flex";
    wallpapersTab.style.justifyContent = "center";

    wallpapersTab.style.padding = "1.25em";
    wallpapersTab.style.margin = "1em auto";
    wallpapersTab.style.width = "65%";
    mainScreenDiv.append(wallpapersTab);
    wallpapersTab.onclick = () => {
        mainScreenDiv.remove();
        wallpapersTabLoad();
    };


    const customizationTab = document.createElement("button");

    const customizationTabIcon = document.createElement("img");
    const cTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings2-icon lucide-settings-2"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>';
    customizationTabIcon.style = "margin-right: 0.2em;"
    setAttrs(customizationTabIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(cTabIconSrc)})
;
    const cTabLabel = document.createElement("label");
    cTabLabel.textContent = "Customization"
    customizationTab.append(customizationTabIcon);
    customizationTab.append(cTabLabel);
    cTabLabel.style.cursor = "pointer";
    customizationTab.style.display = "flex";
    customizationTab.style.justifyContent = "center";

    customizationTab.style.padding = "1.25em";
    customizationTab.style.margin = "1em auto";
    customizationTab.style.width = "65%";
    mainScreenDiv.append(customizationTab);
    customizationTab.onclick = () => {
        mainScreenDiv.remove();
        customizationTabLoad();
    };

    const dockTab = document.createElement("button");

    const dockTabIcon = document.createElement("img");
    const dTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dock-icon lucide-dock"><path d="M2 8h20"/><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 16h12"/></svg>';
    dockTabIcon.style = "margin-right: 0.33em;"
    setAttrs(dockTabIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(dTabIconSrc)})
;
    const dTabLabel = document.createElement("label");
    dTabLabel.textContent = "Dock"
    dockTab.append(dockTabIcon);
    dockTab.append(dTabLabel);
    dTabLabel.style.cursor = "pointer"

    dockTab.style.display = "flex"

    dockTab.style.justifyContent = "center"


    dockTab.style.padding = "1.25em"

    dockTab.style.margin = "1em auto";
    dockTab.style.width = "65%";
    mainScreenDiv.append(dockTab);
    dockTab.onclick = () => {
        mainScreenDiv.remove();
        dockTabLoad();
    };

    const appTab = document.createElement("button");

    const appTabIcon = document.createElement("img");
    const appTabIconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-app-window-mac-icon lucide-app-window-mac"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/></svg>';
    appTabIcon.style = "margin-right: 0.33em;"
    setAttrs(appTabIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(appTabIconSrc)})
;
    const appTabLabel = document.createElement("label");
    appTabLabel.textContent = "Boot Apps"
    appTab.append(appTabIcon);
    appTab.append(appTabLabel);
    appTabLabel.style.cursor = "pointer"

    appTab.style.display = "flex"

    appTab.style.justifyContent = "center"


    appTab.style.padding = "1.25em"

    appTab.style.margin = "1em auto";
    appTab.style.width = "65%";
    mainScreenDiv.append(appTab);
    appTab.onclick = () => {
        mainScreenDiv.remove();
        appTabLoad();
    };

    const themeTab = document.createElement("button");

    const themeTabIcon = document.createElement("img");
    const themeTabIconSrc = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-paintbrush-icon lucide-paintbrush'><path d='m14.622 17.897-10.68-2.913'/><path d='M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z'/><path d='M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15'/></svg>";
    themeTabIcon.style = "margin-right: 0.33em;"
    setAttrs(themeTabIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(themeTabIconSrc)})
;
    const themeTabLabel = document.createElement("label");
    themeTabLabel.textContent = "Themes"
    themeTab.append(themeTabIcon);
    themeTab.append(themeTabLabel);
    themeTabLabel.style.cursor = "pointer"

    themeTab.style.display = "flex"

    themeTab.style.justifyContent = "center"


    themeTab.style.padding = "1.25em"

    themeTab.style.margin = "1em auto";
    themeTab.style.width = "65%";
    mainScreenDiv.append(themeTab);
    themeTab.onclick = () => {
        mainScreenDiv.remove();
        themeTabLoad();
    };
}
async function wallpapersTabLoad() {
    await huopaAPI.setTitle("Settings — Wallpapers");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Wallpapers";
    title.style = "text-align: center;  margin: 1em;";
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
    backButton.style = "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;";

    mainScreenDiv.append(backButton);
    backButton.onclick = async () => {
        mainScreenDiv.remove()
        await mainScreen();
    };

    const wallpaperList = JSON.parse(await huopaAPI.getFile("/system/env/wallpapers") || "[]");

    if (wallpaperList.length < 1) {
        const warning = document.createElement("h2");
        warning.textContent = 'You are in an outdated version of HuopaDesktop with an incorrect wallpaper config! Press "Shutdown" in the start menu and press "C" when you are in the terminal, then run "hpkg update" and "huopadesktop install".';
        warning.style = "text-align: center;  margin: 1em;";
        mainScreenDiv.append(warning);
        return;
    }

    const wallpaperChooseTitle = document.createElement("h2");
    wallpaperChooseTitle.textContent = "Choose your wallpaper";
    wallpaperChooseTitle.style = "text-align: center;  margin: 1em;";
    mainScreenDiv.append(wallpaperChooseTitle);

    const wallpaperListDiv = document.createElement("div");
    wallpaperListDiv.style = "display: flex; width: 95%; height: 100%; flex-wrap: wrap; justify-content: center; margin: 0.5em auto; padding-bottom: 1.5em;";

    for (const wallpaperPath of wallpaperList) {
        const wallpaperButton = document.createElement("button");
        wallpaperButton.style.width = "25%";
        wallpaperButton.style.margin = "1em";
        wallpaperButton.style.overflow = "hidden";
        wallpaperButton.style.minWidth = "200px";
        wallpaperButton.style.flex = "1 0 100px";
        wallpaperButton.style.maxWidth = "200px";
        wallpaperButton.style.aspectRatio = "16 / 9";
        wallpaperButton.style.padding = "0";

        const ext = wallpaperPath.split('.').pop().toLowerCase();

        let preview;
        preview = document.createElement("img");

        preview.style = "border-radius: 0.5em; width: 100%; height: 100%; object-fit: cover; object-position: center;";

        const fileContent = await huopaAPI.getFile(wallpaperPath);

        if (ext === "mp4") {
            extractFrameAsPNG(fileContent, 1)
                .then(pngBlob => {
                    const imgUrl = URL.createObjectURL(pngBlob);
                    preview.src = imgUrl;
                })
                .catch(console.error);
        } else {
            preview.src = await huopaAPI.compressImage(fileContent, 200, 112.5, "1");
        }

        wallpaperButton.append(preview);
        wallpaperListDiv.append(wallpaperButton);

        wallpaperButton.onclick = async () => {
            await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt", "file", wallpaperPath);
        };
    }
    const iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>';
    const importImg = document.createElement("img");
    importImg.style.marginBottom = "0.25em;"
    const importText = document.createElement("p");
    importText.textContent = "Add wallpaper";
    setAttrs(importImg, {src: "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc)})

    const importButton = document.createElement("button");
    importButton.width = "25%";
    importButton.style.margin = "1em"
;
    importButton.style.overflow = "hidden"
;
    importButton.style.minWidth = "200px"
;
    importButton.style.flex = "1 0 100px";
    importButton.style.maxWidth = "200px"
;
    importButton.style.aspectRatio = "16 / 9";

    importButton.append(importImg);
    importButton.append(importText);
    wallpaperListDiv.append(importButton);
    importButton.onclick = async () => {
        path = await huopaAPI.openFileDialog();
        const file = await huopaAPI.getFile(path)
        if (file) {
            await huopaAPI.writeFile("/system/env/wallpapers/" + path.split("/").pop(), "file", file);
            mainScreenDiv.remove()
            await wallpapersTabLoad();
        }
    };

    mainScreenDiv.append(wallpaperListDiv);
}
async function customizationTabLoad() {
    await huopaAPI.setTitle("Settings — Customization");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Customization";
    title.style = "text-align: center;  margin: 1em;";
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
    backButton.style = "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;";

    mainScreenDiv.append(backButton);
    backButton.onclick = async () => {
        mainScreenDiv.remove()
        await mainScreen();
    };

    const bgBlurDiv = document.createElement("div");
    const bgBlurText = document.createElement("p");
    bgBlurText.textContent = "Background blur level — Choose how blurred you want transparent backgrounds to be. (Requires restart for most elements)";
    bgBlurText.style = "text-align: center;  margin: 0.5em;";
    bgBlurDiv.style = "margin: 2em;";
    bgBlurDiv.append(bgBlurText);
    mainScreenDiv.append(bgBlurDiv);
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "12";
    slider.value = await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgblur.txt") || "3.5";
    slider.step = "0.1";

    const label = document.createElement("span");
    label.textContent = await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgblur.txt") + "px" || "3.5px";
    label.style = "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;";
    slider.margin = "0.5em auto";
    slider.style.display = "block"
;

    slider.oninput = async () => {
        label.textContent = slider.value + "px";
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/bgblur.txt", "file", slider.value);
    };

    bgBlurDiv.append(slider);
    bgBlurDiv.append(label);


    const bgOpacDiv = document.createElement("div");
    const bgOpacText = document.createElement("p");
    bgOpacText.textContent = "Element opacity — Choose how transparent you want elements to be. (Requires restart for most elements)";
    bgOpacText.style = "text-align: center;  margin: 0.5em;";
    bgOpacDiv.style = "margin: 2em;";
    bgOpacDiv.append(bgOpacText);
    mainScreenDiv.append(bgOpacDiv);
    const opacSlider = document.createElement("input");
    opacSlider.type = "range";
    opacSlider.min = "0.3";
    opacSlider.max = "1";
    opacSlider.step = "0.05";
    opacSlider.value = await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgopac.txt") || "0.90";

    const opacLabel = document.createElement("span");
    opacLabel.textContent = Math.round(await huopaAPI.getFile("/system/env/systemconfig/settings/customization/bgopac.txt") * 100) + "%";
    opacLabel.style = "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;";
    opacSlider.margin = "0.5em auto";
    opacSlider.style.display = "block"
;

    opacSlider.oninput = async () => {
        opacLabel.textContent = Math.round(opacSlider.value * 100) + "%";
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/bgopac.txt", "file", opacSlider.value)
    };
    bgOpacDiv.append(opacSlider);
    bgOpacDiv.append(opacLabel);

    const appBorderColorDiv = document.createElement("div");
    const appBorderColorTitle = document.createElement("p");
    appBorderColorTitle.textContent = "Window border color — Choose the color of window borders.";
    appBorderColorTitle.style = "text-align: center;  margin: 0.5em;";
    appBorderColorDiv.style = "margin: 2em; padding-bottom: 1.5em;";
    appBorderColorDiv.append(appBorderColorTitle);
    mainScreenDiv.append(appBorderColorDiv);

    const appBorderColorPicker = document.createElement("input");
    appBorderColorPicker.type = "color";
    appBorderColorPicker.value = await huopaAPI.getFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt") || "";
    mainScreenDiv.append(appBorderColorPicker);
    appBorderColorDiv.style.margin = "1em"
;

    appBorderColorPicker.oninput = async () => {
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt", "file", appBorderColorPicker.value);
    };

    appBorderColorDiv.append(appBorderColorPicker);
}

async function dockTabLoad() {
    await huopaAPI.setTitle("Settings — Dock");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Dock";
    title.style = "text-align: center;  margin: 1em;";
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
    backButton.style = "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;";
    mainScreenDiv.append(backButton);
    backButton.onclick = async () => {
        mainScreenDiv.remove();
        await mainScreen();
    };

    const dockDockedDiv = document.createElement("div");
    const dockDockedTitle = document.createElement("p");
    dockDockedTitle.textContent = "Dock to screen edge — Make the dock fill the screen edges (Requires restart)";
    dockDockedTitle.style = "text-align: center;  margin: 0.5em;";
    dockDockedDiv.style = "margin: 2em; padding-bottom: 1.5em;";
    dockDockedDiv.append(dockDockedTitle);
    mainScreenDiv.append(dockDockedDiv);

    const dockDockedCheckbox = document.createElement("input");
    dockDockedCheckbox.type = "checkbox";
    dockDockedCheckbox.checked = await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt") || false;
    mainScreenDiv.append(dockDockedCheckbox);
    dockDockedDiv.style.margin = "1em"
;
    dockDockedCheckbox.margin = "1em auto";
    dockDockedCheckbox.style.display = "block"
;

    dockDockedCheckbox.oninput = async () => {
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt", "file", dockDockedCheckbox.checked);
    };

    dockDockedDiv.append(dockDockedCheckbox);

    const dockOpacDiv = document.createElement("div");
    const dockOpacText = document.createElement("p");
    dockOpacText.textContent = "Dock opacity — Choose how transparent you want the dock to be. (Requires restart)";
    dockOpacText.style = "text-align: center;  margin: 0.5em;";
    dockOpacDiv.style = "margin: 2em;";
    dockOpacDiv.append(dockOpacText);
    mainScreenDiv.append(dockOpacDiv);
    const opacSlider = document.createElement("input");
    opacSlider.type = "range";
    opacSlider.min = "0.3";
    opacSlider.max = "1";
    opacSlider.step = "0.05";
    opacSlider.value = await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockopac.txt");

    const opacLabel = document.createElement("span");
    opacLabel.textContent = Math.round(await huopaAPI.getFile("/system/env/systemconfig/settings/customization/dockopac.txt") * 100) + "%";
    opacLabel.style = "color: white; display: block; text-align: center; margin: 0.5em auto; padding-bottom: 1.5em;";
    opacSlider.margin = "0.5em auto";
    opacSlider.style.display = "block"
;

    opacSlider.oninput = async () => {
        opacLabel.textContent = Math.round(opacSlider.value * 100) + "%";
        await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/dockopac.txt", "file", opacSlider.value)
    };
    dockOpacDiv.append(opacSlider);
    dockOpacDiv.append(opacLabel);

}

async function appTabLoad() {
    await huopaAPI.setTitle("Settings — Boot Apps");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Boot Apps";
    title.style = "text-align: center;  margin: 1em;";
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
    backButton.style = "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;";
    mainScreenDiv.append(backButton);
    backButton.onclick = async () => {
        mainScreenDiv.remove();
        await mainScreen();
    };
    const iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>';
    const importImg = document.createElement("img");
    importImg.style.marginBottom = "0.25em;"
    const importText = document.createElement("p");
    importText.textContent = "Add boot app";
    setAttrs(importImg, {src: "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc)})

    const importButton = document.createElement("button");
    importButton.width = "25%";
    importButton.style.margin = "1em auto";
    importButton.style.overflow = "hidden";
    importButton.style.padding = "1em 2em";
    importButton.style.display = "block"

    importButton.append(importImg);
    importButton.append(importText);
    mainScreenDiv.append(importButton);
    importButton.onclick = async () => {
        path = await huopaAPI.openFileDialog();
        const file = await huopaAPI.getFile(path)
        if (file) {
            await huopaAPI.writeFile("/system/bootapps/" + path.split("/").pop(), "file", file);
            mainScreenDiv.remove()
            await appTabLoad()
        }
    };

    let bootAppList = await huopaAPI.getFile("/system/bootapps");
    if (!bootAppList) {
        bootAppList = "[]";
        await huopaAPI.writeFile("/system/bootapps", "dir", "[]")
    }
    bootAppList = JSON.parse(bootAppList);
    for (const bootApp of bootAppList) {
        const bootAppDiv = document.createElement("div");
        bootAppDiv.style = "margin: 0.5em auto; display: block; padding: 0.5em; width: calc(100% - 2em); border-radius: 0.5em; position: relative;";
        bootAppDiv.classList.add("primary");
        const name = bootApp.split("/").pop();
        const nameEl = document.createElement("p");
        nameEl.style.margin = "0";
        nameEl.textContent = name;
        const removeEl = document.createElement("button");
        removeEl.style = "position: absolute; right: 0.66em; padding: 0; background-color: transparent; border-style: none; top: 50%; transform: translateY(-50%);";
        removeEl.textContent = "Remove";
        removeEl.onclick = () => {
            huopaAPI.deleteFile(bootApp);
            bootAppDiv.remove();
        }
        bootAppDiv.append(nameEl);
        bootAppDiv.append(removeEl);
        mainScreenDiv.append(bootAppDiv);
    }
}

function extractFrameAsPNG(videoSrc, seekTime = 1) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = "anonymous";
    video.src = videoSrc;
    video.muted = true;
    
    video.addEventListener('loadedmetadata', () => {
      if (seekTime > video.duration) {
        reject(new Error('Seek time exceeds video duration'));
        return;
      }
      video.currentTime = seekTime;
    });

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
    });

    video.addEventListener('error', e => {
      reject(new Error('Error loading video: ' + e.message));
    });
  });
}

async function themeTabLoad() {
    await huopaAPI.setTitle("Settings — Themes");
    const mainScreenDiv = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Themes (requires restart)";
    title.style = "text-align: center;  margin: 1em;";
    document.body.append(mainScreenDiv);
    mainScreenDiv.append(title);

    const backButton = document.createElement("button");
    backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
    backButton.style = "padding: 1em; position: fixed; left: 0.5em; bottom: 0.5em; display: flex; width: 45px; height: 45px; align-items: center; justify-content: center;";

    mainScreenDiv.append(backButton);
    backButton.onclick = async () => {
        mainScreenDiv.remove()
        await mainScreen();
    };
    const response = await fetch("https://raw.githubusercontent.com/Allucat1000/HuopaOS/main/HuopaDesktop/Themes/ThemeList.json");
    if (!response.ok) {
        const warning = document.createElement("h2");
        warning.textContent = 'Failed to fetch themes!';
        warning.style = "text-align: center; margin: 1em;";
        mainScreenDiv.append(warning);
        console.error("Failed to fetch themes!");
        return;
    }
    const themeList = await response.json();

    const themeListDiv = document.createElement("div");
    themeListDiv.style = "display: flex; width: 95%; height: 100%; flex-wrap: wrap; justify-content: center; margin: 0.5em auto; padding-bottom: 1.5em;";

    for (const themeName of themeList) {
        const themeButton = document.createElement("button");
        themeButton.style.width = "25%";
        themeButton.style.margin = "1em";
        themeButton.style.overflow = "hidden";
        themeButton.style.minWidth = "300px";
        themeButton.style.flex = "1 0 100px";
        themeButton.style.maxWidth = "300px";
        themeButton.style.aspectRatio = "16 / 9";
        themeButton.style.padding = "0";

        const preview = document.createElement("img");

        preview.style = "border-radius: 0.5em; width: 100%; height: 100%; object-fit: cover; object-position: center;";

        const fileResponse = await fetch("https://raw.githubusercontent.com/Allucat1000/HuopaOS/main/HuopaDesktop/Themes/" + themeName + ".css");

        preview.src = "https://raw.githubusercontent.com/Allucat1000/HuopaOS/main/HuopaDesktop/Themes/" + themeName + ".png";
        themeButton.append(preview);
        themeListDiv.append(themeButton);
        const style = await fileResponse.text()
        themeButton.onclick = async () => {
            if (fileResponse.ok) {
                await huopaAPI.writeFile("/system/env/systemStyles.css", "file", style);
                await huopaAPI.requestSystemReboot()
            } else {
                const warning = document.createElement("h2");
                warning.textContent = 'Failed to fetch theme!';
                warning.style = "text-align: center; margin: 1em;";
                mainScreenDiv.append(warning);
                console.error("Failed to fetch theme!");
                return;
            }
        };
    };
    mainScreenDiv.append(themeListDiv);
}