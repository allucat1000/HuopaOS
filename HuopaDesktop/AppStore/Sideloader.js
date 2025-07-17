const title = document.createElement("h1");
title.textContent = "App Sideloader";
title.style = "text-align: center; color: white; margin: 1em;";
const importButton = document.createElement("button")
importButton.style =  "display: block; border-radius: 0.5em; padding: 2em; width: 25%; background-color: rgba(105, 105, 105, 0.3); margin: 1em auto; cursor: pointer;  border: solid 2px white; color: white; text-align: center;"
importButton.textContent = "Sideload app from computer"
document.body.append(title);
document.body.append(importButton);
importButton.onclick = async () => {
    const file = await huopaAPI.openFileImport(".js", "text");
    if (file) {
        await huopaAPI.writeFile("/home/applications/" + file.name, "file", file.content);
    }
}