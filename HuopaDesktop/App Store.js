const title = document.createElement("h1");
title.textContent = "HuopaDesktop App Store";
title.style = "text-align: center;  margin: 1em;";
document.body.append(title);
const loadingText = document.createElement("h3");
loadingText.textContent = "Loading apps...";
loadingText.style = "text-align: center; ";
document.body.append(loadingText);


// App loading
const appList = document.createElement("div");
document.body.append(appList)
const response = await fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/AppList.json");
if (response.ok) {
    let list;
    try {
        list = await response.json();
    } catch (e) {
        loadingText.textContent = "Failed to parse app list.";
        return;
    }
    if (Array.isArray(list)) {
        loadingText.remove()
        for (const appArray of list) {
            const appName = appArray.name
            const appInfo = appArray.description
            const appDiv = document.createElement("div");
            const name = document.createElement("h3");
            const desc = document.createElement("p");

            name.textContent = appName;
            desc.textContent = appInfo;

            appDiv.style = "margin: 1em; border-radius: 0.5em; text-align: left; padding: 1.5em; overflow: hidden; position: relative;";
            appDiv.classList.add("primary")
            name.style.display = "inline";
            name.style.margin = 0;

            const installButton = document.createElement("button");
            installButton.style.position = "absolute";
            installButton.style.top = "0.5em";
            installButton.style.right = "0.5em";
            installButton.style.display = "flex";
            installButton.style.alignItems = "flex-end";
            let installState;
            let appIconSrc;
            const titleDiv = document.createElement("div");
            titleDiv.style.margin = "0 0 0.75em 0";
            titleDiv.style = "display: flex; align-items: center; margin-bottom: 0.75em;";
            const appIcon = document.createElement("img");
            if (appArray.icon) {
                const response = await fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName + "/icon.svg");
                if (response.ok) {
                    appIconSrc = await response.text();
                } else {
                    await huopaAPI.error("Failed to fetch app icon!")
                }
            }
            appIcon.style = "display: inline; width: 16px; height: 16px; margin-right: 0.2em;";
            if (!appIconSrc) {
                const defaultSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>';
                setAttrs(appIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(defaultSVG)});
            } else {
                setAttrs(appIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(appIconSrc)});
            }
            titleDiv.append(appIcon);
            titleDiv.append(name);
            appDiv.append(titleDiv);
            appDiv.append(desc);
            const ver = await huopaAPI.safeStorageRead(appName + "/version.txt")
            const installText = document.createElement("label");
            installButton.append(installText);
            let update = false;
            const installStateIcon = document.createElement("img");
            if (!ver || ver < appArray.version) update = true;
            if (await huopaAPI.getFile("/home/applications/" + appName + ".js") && !update) {
                installState = true
                installText.textContent = "Uninstall";
            } else {
                installState = false;
                if (update && await huopaAPI.getFile("/home/applications/" + appName + ".js")) {
                    installText.textContent = "Update";
                } else {
                    installText.textContent = "Install";
                }
            }
            let iconSrc
            if (installState === false) {
                iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>';
            } else {
                iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
            }
            installStateIcon.style = "margin-right: 0.3em;";
            setAttrs(installStateIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc)})
;
            installButton.prepend(installStateIcon);
            
        
            installButton.onclick = async () => {
                if (installState === false) {
                    installState = "mid";
                    installText.textContent = "Downloading...";
                    const response = await fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName + "/main.js");
                    if (response.ok) {
                        installText.textContent = "Installing...";
                        for (const file of appArray?.extrafiles) {
                            const fileresponse = await fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName + "/" + file);
                            if (fileresponse.ok) {
                                await huopaAPI.writeFile(`/system/applicationStorage/${appArray.name}/${file}`, "file", fileresponse.text());
                            }
                        }
                        const code = await response.text();
                        await huopaAPI.writeFile("/home/applications/" + appName + ".js", "file", code);
                        await huopaAPI.safeStorageWrite(appName + "/version.txt", "file", appArray.version)
                        installText.textContent = "Uninstall";
                        iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
                        setAttrs(installStateIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc)});
                        if (appIconSrc) {
                            await huopaAPI.writeFile("/home/applications/" + appName + ".icon", "file", appIconSrc);
                        }
                        installState = true;
                    } else {
                        installText.textContent = "Failed to install!";
                        await huopaAPI.error("Failed to install '" + appName + "'. Status: " + response.status);
                    }
                } else if (installState === true) {
                    installState = "mid";
                    await huopaAPI.deleteFile("/home/applications/" + appName + ".js");
                    await huopaAPI.deleteFile("/system/applicationStorage/" + appName);
                    installText.textContent = "Install";
                    iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>';
                    setAttrs(installStateIcon, {src: "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc)});
                    installState = false;
                }
                
            };

            appDiv.append(installButton);
            appList.append(appDiv);
        }
    } else {
        loadingText.textContent = "Invalid app list format.";
    }
} else {
    const errorMessage = document.createElement("h3");
    errorMessage.textContent = "Failed to load apps, relaunch the app and try again. Status: " + response.status;
    document.body.append(errorMessage);
}