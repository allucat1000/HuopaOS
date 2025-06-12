const title = await huopaAPI.createElement("h1");
await huopaAPI.setAttribute(title, "textContent", "HuopaDesktop App Store");
await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
await huopaAPI.appendToApp(title);
const loadingText = await huopaAPI.createElement("h3");
await huopaAPI.setAttribute(loadingText, "textContent", "Loading apps...");
await huopaAPI.setAttribute(loadingText, "style", "text-align: center; color: white;");
await huopaAPI.appendToApp(loadingText);


// Feed loading
const appList = await huopaAPI.createElement("div");
await huopaAPI.appendToApp(appList)
const response = await huopaAPI.fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/AppList.json");
if (response.ok) {
    const list = response.body;
    if (Array.isArray(list)) {
        huopaAPI.deleteElement(loadingText);
        for (const appName of list) {
            const response = await huopaAPI.fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName + ".txt");
            if (!response.ok) {
                huopaAPI.error("Failed to fetch app code! Status: " + response.status);
                return;
            }
            const appInfo = response.body
            const appDiv = await huopaAPI.createElement("div");
            const name = await huopaAPI.createElement("h3");
            const desc = await huopaAPI.createElement("p");

            await huopaAPI.setAttribute(name, "textContent", appName);
            await huopaAPI.setAttribute(desc, "textContent", appInfo);

            await huopaAPI.append(appDiv, name);
            await huopaAPI.append(appDiv, desc);

            await huopaAPI.setAttribute(
                appDiv,
                "style",
                "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1em; overflow: hidden; position: relative;"
            );
            await huopaAPI.setCertainStyle(author, "margin", "0 0 1em 0");
            const installButton = await huopaAPI.createElement("button");
            await huopaAPI.setCertainStyle(installButton, "position", "absolute");
            await huopaAPI.setCertainStyle(installButton, "top", "0.5em");
            await huopaAPI.setCertainStyle(installButton, "right", "0.5em");
            await huopaAPI.setAttribute(installButton, "textContent", "Install");
            await huopaAPI.setAttribute(installButton, "onclick", async(appName) => {
                const response = await huopaAPI.fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/AppStore/" + appName);
                if (response.ok) {
                    const code = response.body;
                    await huopaAPI.writeFile("/home/applications/" + appName, "file", code);
                } else {
                    await huopaAPI.setAttribute(installButton, "textContent", "Failed to install!");
                    await huopaAPI.log("Failed to install '" + appName + "'. Status: " + response.status);
                }

            })
            
            await huopaAPI.append(appList, appDiv);
        }
    }
} else {
    const errorMessage = await huopaAPI.createElement("h3");
    await huopaAPI.setAttribute(errorMessage, "textContent", "Failed to load apps, relaunch the app and try again. Status: " + response.status);
    
    await huopaAPI.appendToApp(errorMessage);
}


