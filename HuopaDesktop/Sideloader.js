const title = await huopaAPI.createElement("h1");
await huopaAPI.setAttribute(title, "textContent", "App Sideloader");
await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
const importButton = await huopaAPI.createElement("button")
await huopaAPI.setAttribute(importButton, "style", "display: block; border-radius: 0.5em; padding: 2em; width: 25%; background-color: rgba(105, 105, 105, 0.3); margin: 1em auto; cursor: pointer;  border: solid 2px white; color: white; text-align: center;")
await huopaAPI.setAttribute(importButton, "textContent", "Sideload app from computer")
await huopaAPI.appendToApp(title);
await huopaAPI.appendToApp(importButton);
await huopaAPI.setAttribute(importButton, "onclick", async () => {
    const file = await huopaAPI.openFileImport(".js", "text");
    if (file) {
        await huopaAPI.writeFile("/home/applications/" + file.name, "file", file.content);
    }
})