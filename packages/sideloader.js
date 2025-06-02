window.sideloader = (() => {
    const loadFile = async (accept = ".js") => {
        return new Promise((resolve, reject) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = accept;
            input.style.display = "none";

            input.addEventListener("change", () => {
                if (input.files.length > 0) {
                    resolve(input.files[0]);
                } else {
                    reject(new Error("No file selected"));
                }
            });

            document.body.appendChild(input);
            input.click();
            setTimeout(() => document.body.removeChild(input), 1000);
        });
    };

    return {
        async init() {
            await sys.addLine("We are not responsible for any loss, due to malicious packages.");

            try {
                const sandboxCheck = document.createElement("div");
                sandboxCheck.remove();
            } catch (error) {
                await sys.addLine("To sideload a package, run unsandboxed! (sideloader -nsbx)");
                return;
            }

            let file;
            try {
                file = await loadFile(".js");
            } catch (e) {
                await sys.addLine("No file selected.");
                return;
            }
            const appName = file.name;
            const appCode = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });

            try {
                await internalFS.createPath(`/system/packages/${appName}`, "file", appCode);
                await sys.addLine("Successfully sideloaded package!");
                await sys.addLine(`You can view your package at: /system/packages/${appName}`);
            } catch (error) {
                await sys.addLine("Failed to sideload package. Error: " + error);
            }
        }
    };
})();
