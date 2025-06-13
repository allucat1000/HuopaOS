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

            await huopaAPI.append(appDiv, name);
            await huopaAPI.append(appDiv, desc);

            await huopaAPI.setAttribute(appDiv, "style", "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1.5em; overflow: hidden; position: relative;");

            await huopaAPI.setCertainStyle(name, "margin", "0 0 0.75em 0");

            const installButton = await huopaAPI.createElement("button");
            await huopaAPI.setCertainStyle(installButton, "position", "absolute");
            await huopaAPI.setCertainStyle(installButton, "top", "0.5em");
            await huopaAPI.setCertainStyle(installButton, "right", "0.5em");
            let installState;
            const ver = await huopaAPI.safeStorageRead(appName + "/version.txt")
            let update = false;
            if (!ver || ver !== appArray.version) update = true;
            if (await huopaAPI.getFile("/home/applications/" + appName) && !update) {
                installState = true
                await huopaAPI.setAttribute(installButton, "textContent", "Uninstall");
            } else {
                installState = false;
                if (update) {
                    await huopaAPI.setAttribute(installButton, "textContent", "Update");
                } else {
                    await huopaAPI.setAttribute(installButton, "textContent", "Install");
                }
            }
            
        
            await huopaAPI.setAttribute(installButton, "onclick", async () => {
                if (installState === false) {
                    installState = "mid";
                    await huopaAPI.setAttribute(installButton, "textContent", "Downloading...");
                    const response = await huopaAPI.fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName);
                    if (response.ok) {
                        await huopaAPI.setAttribute(installButton, "textContent", "Installing...");
                        const code = response.body;
                        await huopaAPI.writeFile("/home/applications/" + appName, "file", code);
                        await huopaAPI.safeStorageWrite(appName + "/version.txt", "file", appArray.version)
                        await huopaAPI.setAttribute(installButton, "textContent", "Uninstall");
                        installState = true;
                    } else {
                        await huopaAPI.setAttribute(installButton, "textContent", "Failed to install!");
                        await huopaAPI.error("Failed to install '" + appName + "'. Status: " + response.status);
                    }
                } else if (installState === true) {
                    installState = "mid";
                    await huopaAPI.deleteFile("/home/applications/" + appName);
                    await huopaAPI.setAttribute(installButton, "textContent", "Install");
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