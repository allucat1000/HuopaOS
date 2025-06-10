const title = await huopaAPI.createElement("h1");
await huopaAPI.setText(title, "App Sideloader");
await huopaAPI.setStyle(title, "text-align: center; color: white; margin: 1em;");
const importButton = await huopaAPI.createElement("button")
await huopaAPI.setStyle(importButton, "display: block; border-radius: 0.5em; padding: 2em; width: 25%; background-color: rgba(105, 105, 105, 0.3); margin: 1em auto; cursor: pointer;  border: solid 2px white; color: white; text-align: center;")
await huopaAPI.setText(importButton, "Sideload app from computer")
await huopaAPI.appendToApp(title);
await huopaAPI.appendToApp(importButton);
await huopaAPI.setOnClick(importButton, async () => {
    const file = await huopaAPI.openFileImport(".js", "text");
    if (file) {
        await huopaAPI.writeFile("/home/applications/" + file.name, "file", file.content);
    }
})