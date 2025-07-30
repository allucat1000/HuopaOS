const title = document.createElement("h1");
title.textContent = "File Importer";
title.style = "text-align: center; color: white; margin: 1em;";
const importButton = document.createElement("button")
importButton.style =  "display: block; border-radius: 0.5em; padding: 2em; width: 25%; background-color: rgba(105, 105, 105, 0.3); margin: 1em auto; cursor: pointer;  border: solid 2px white; color: white; text-align: center;"
importButton.textContent = "Import file from computer"
document.body.append(title);
document.body.append(importButton);
importButton.onclick = async () => {
    const file = await huopaAPI.openFileImport();
    if (file) {
        path = await huopaAPI.openSaveDialog("/home/desktop/" + file.name);
        const parent = path.split("/").slice(0, -1).join("/");
        const dir = await isDir(parent);
        const exists = await huopaAPI.getFile(parent)
        if (exists && !dir) {
            await huopaAPI.writeFile(path, "file", file.content);
        } else if (exists) {
            huopaAPI.createNotification("Failed to import file!", "The path you entered for the save location is a directory!");
        } else {
            huopaAPI.createNotification("Failed to import file!", "The path you entered for the save location doen't exist!");
        }
        
    }
}

async function isDir(path) {
    try {
        const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
        const lastSegment = normalizedPath.split("/").pop();
        if (lastSegment.includes(".") && !lastSegment.startsWith(".")) {
            return false;
        }
        
        const fileContent = await huopaAPI.getFile(normalizedPath);
        if (path === "/") return true;
        let parsed;
        try {
            parsed = JSON.parse(fileContent);
        } catch {
            return false;
        }

        if (!Array.isArray(parsed)) return false;
        if (!parsed.every(item => typeof item === "string")) return false;
        
        return true;
    } catch (err) {
        await huopaAPI.error(err);
        return false;
    }
}