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
        async load() {
            await sys.addLine("We are not responsible for any loss, due to malicious packages.");

            try {
                const sandboxCheck = document;
            } catch (error) {
                await sys.addLine("To sideload a package, run unsandboxed! (sideloader -unsx)");
                return;
            }

            let file;
            try {
                file = await loadFile(".js");
            } catch (e) {
                await sys.addLine("No file selected.");
                return;
            }

            const appCode = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });

            inputAnswerActive = true;
            await sys.addLine("What name do you want to give for the sideloaded package? If the name is the same as another package, the old package will get overwritten.");
            await waitUntil(() => !inputAnswerActive);

            if (!inputAnswer) {
                await sys.addLine("Give a name for the package!");
                return;
            }

            try {
                await internalFS.createPath(`/system/packages/${inputAnswer}.js`, "file", appCode);
                await sys.addLine("Successfully sideloaded package!");
                await sys.addLine(`You can view your package at: /system/packages/${inputAnswer}.js`);
            } catch (error) {
                await sys.addLine("Failed to sideload package. Error: " + error);
            }
        }
    };
})();
