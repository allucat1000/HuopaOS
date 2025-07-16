const title = await huopaAPI.createElement("h1");
await huopaAPI.setAttribute(title, "textContent", "HuopaDesktop App Store");
await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
await huopaAPI.appendToApp(title);
const loadingText = await huopaAPI.createElement("h3");
await huopaAPI.setAttribute(loadingText, "textContent", "Loading apps...");
await huopaAPI.setAttribute(loadingText, "style", "text-align: center; color: white;");
await huopaAPI.appendToApp(loadingText);


// App loading
const appList = await huopaAPI.createElement("div");
await huopaAPI.appendToApp(appList)
const response = await huopaAPI.fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/AppList.json");
if (response.ok) {
    let list;
    try {
        const bodyText = await response.body;
        list = JSON.parse(bodyText);
    } catch (e) {
        await huopaAPI.setAttribute(loadingText, "textContent", "Failed to parse app list.");
        return;
    }
    if (Array.isArray(list)) {
        await huopaAPI.deleteElement(loadingText);
        for (const appArray of list) {
            const appName = appArray.name
            const appInfo = appArray.description
            const appDiv = await huopaAPI.createElement("div");
            const name = await huopaAPI.createElement("h3");
            const desc = await huopaAPI.createElement("p");

            await huopaAPI.setAttribute(name, "textContent", appName);
            await huopaAPI.setAttribute(desc, "textContent", appInfo);

            await huopaAPI.setAttribute(appDiv, "style", "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1.5em; overflow: hidden; position: relative;");

            await huopaAPI.setCertainStyle(name, "display", "inline");
            await huopaAPI.setCertainStyle(name, "margin", "0");

            const installButton = await huopaAPI.createElement("button");
            await huopaAPI.setCertainStyle(installButton, "position", "absolute");
            await huopaAPI.setCertainStyle(installButton, "top", "0.5em");
            await huopaAPI.setCertainStyle(installButton, "right", "0.5em");
            await huopaAPI.setCertainStyle(installButton, "display", "flex");
            await huopaAPI.setCertainStyle(installButton, "align-items", "flex-end");
            let installState;
            let appIconSrc;
            const titleDiv = await huopaAPI.createElement("div");
            await huopaAPI.setCertainStyle(titleDiv, "margin", "0 0 0.75em 0");
            await huopaAPI.setAttribute(titleDiv, "style", "display: flex; align-items: center; margin-bottom: 0.75em;");
            const appIcon = await huopaAPI.createElement("img");
            if (appArray.icon) {
                const response = await huopaAPI.fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName + ".icon");
                if (response.ok) {
                    appIconSrc = response.body;
                } else {
                    await huopaAPI.error("Failed to fetch app icon!")
                }
            }
            await huopaAPI.setAttribute(appIcon, "style", "display: inline; width: 16px; height: 16px; margin-right: 0.2em;");
            if (!appIconSrc) {
                const defaultSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>';
                await huopaAPI.setAttribute(appIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(defaultSVG));
            } else {
                await huopaAPI.setAttribute(appIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(appIconSrc));
            }
            await huopaAPI.append(titleDiv, appIcon);
            await huopaAPI.append(titleDiv, name);
            await huopaAPI.append(appDiv, titleDiv);
            await huopaAPI.append(appDiv, desc);
            const ver = await huopaAPI.safeStorageRead(appName + "/version.txt")
            const installText = await huopaAPI.createElement("label");
            await huopaAPI.append(installButton, installText);
            let update = false;
            const installStateIcon = await huopaAPI.createElement("img");
            if (!ver || ver !== appArray.version) update = true;
            if (await huopaAPI.getFile("/home/applications/" + appName) && !update) {
                installState = true
                await huopaAPI.setAttribute(installText, "textContent", "Uninstall");
            } else {
                installState = false;
                if (update && await huopaAPI.getFile("/home/applications/" + appName)) {
                    await huopaAPI.setAttribute(installText, "textContent", "Update");
                } else {
                    await huopaAPI.setAttribute(installText, "textContent", "Install");
                }
            }
            let iconSrc
            if (installState === false) {
                iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>';
            } else {
                iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
            }
            await huopaAPI.setAttribute(installStateIcon, "style", "margin-right: 0.3em;")
            await huopaAPI.setAttribute(installStateIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc));
            await huopaAPI.prepend(installButton, installStateIcon);
            
        
            await huopaAPI.setAttribute(installButton, "onclick", async () => {
                if (installState === false) {
                    installState = "mid";
                    await huopaAPI.setAttribute(installText, "textContent", "Downloading...");
                    const response = await huopaAPI.fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName);
                    if (response.ok) {
                        await huopaAPI.setAttribute(installText, "textContent", "Installing...");
                        const code = response.body;
                        await huopaAPI.writeFile("/home/applications/" + appName, "file", code);
                        await huopaAPI.safeStorageWrite(appName + "/version.txt", "file", appArray.version)
                        await huopaAPI.setAttribute(installText, "textContent", "Uninstall");
                        iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
                        await huopaAPI.setAttribute(installStateIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc));
                        if (appIconSrc) {
                            await huopaAPI.writeFile("/home/applications/" + appName + ".icon", "file", appIconSrc);
                        }
                        installState = true;
                    } else {
                        await huopaAPI.setAttribute(installText, "textContent", "Failed to install!");
                        await huopaAPI.error("Failed to install '" + appName + "'. Status: " + response.status);
                    }
                } else if (installState === true) {
                    installState = "mid";
                    await huopaAPI.deleteFile("/home/applications/" + appName);
                    await huopaAPI.setAttribute(installText, "textContent", "Install");
                    iconSrc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>';
                    await huopaAPI.setAttribute(installStateIcon, "src", "data:image/svg+xml;utf8," + encodeURIComponent(iconSrc));
                    installState = false;
                }
                
            });

            await huopaAPI.append(appDiv, installButton);
            await huopaAPI.append(appList, appDiv);
        }
    } else {
        await huopaAPI.setAttribute(loadingText, "textContent", "Invalid app list format.");
    }
} else {
    const errorMessage = await huopaAPI.createElement("h3");
    await huopaAPI.setAttribute(errorMessage, "textContent", "Failed to load apps, relaunch the app and try again. Status: " + response.status);
    await huopaAPI.appendToApp(errorMessage);
}