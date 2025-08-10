const moduleEl = document.createElement("script");
moduleEl.type = "module";
const code = `
(async () => {
    const inputPath = await huopaAPI.openFileDialog();
    const input = await huopaAPI.getFile(inputPath);
    const { transpile } = await import("https://esm.sh/typescript");

    let transpiled;
    try {
        transpiled = transpile(input);
    } catch (error) {
        await huopaAPI.createNotification("TypescriptTranspiler", "Failed to transpile code! Error in console.");
        console.error(error);
        return;
    }

    const path = await huopaAPI.openSaveDialog(inputPath.replace(".ts", ".js"));
    await huopaAPI.writeFile(path, "file", transpiled)
})();
`;
const dataURL = "data:text/javascript;charset=utf-8," + encodeURIComponent(code);
moduleEl.src = dataURL;
document.body.append(moduleEl);