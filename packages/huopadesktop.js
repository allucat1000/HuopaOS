window.huopadesktop = {
    async install() {
        await new Promise(resolve => setTimeout(resolve, 100));
        await addLine("## [line=blue]HuopaDesktop setup[/line]");
        await addLine("Do you want to install HuopaDesktop? [Y/n]");
        await addLine("HuopaDesktop uses the Quantum display manager.");
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "y" || inputAnswer.toLowerCase() === "") {
            await addLine("[line=blue]Installing HuopaDesktop...[/line]")
            try {
                await sys.import("quantum")
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                await addLine(`Failed to fetch Quantum module! Error: ${error}`);
            }
            await addLine("Quantum installed!")
            const bootConfig = {
                "path":"/system/modules/quantum.js",
            }
            
            await internalFS.createPath("/system/env/config.json", "file", JSON.stringify(bootConfig));
            await addLine("Boot config created!")
            const response = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/DefaultBG.png`);
            if (response.ok) {
                const blob = await response.blob();
                const base64data = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                await internalFS.createPath("/system/env/wallpapers/default.png", "file", base64data);
                await addLine("Wallpaper fetched and installed!");
            } else {
                await addLine("Failed to fetch wallpaper!");
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.boot()
        } else {
            addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]");
        }
    },
    async boot() {
        const bootConfig = JSON.parse(internalFS.getFile("/system/env/config.json"));
        if (bootConfig) {
            await addLine("Boot config found! Attempting to boot from specified path.");
            if (!bootConfig.path) {
                await addLine("Incorrect boot config!");
                await addLine("Please reinstall HuopaDesktop!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                await this.install();
            } else {
                await internalFS.runUnsandboxed(bootConfig.path);
                await new Promise(resolve => setTimeout(resolve, 500));
                try {
                    await quantum.init();
                } catch (e) {
                    await addLine("Failed to initialize Quantum. Reinstall HuopaDesktop.");
                    await addLine(`Error: ${e}`);
                    console.error(`Error: ${e}`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await this.install();
                }
                await addLine("Loading HuopaDesktop...")
                await new Promise(resolve => setTimeout(resolve, 500));
                const mainDiv = quantum.document.getElementById("termDiv");
                mainDiv.innerHTML = "";
                const desktop = quantum.document.createElement("div");
                const appBar = quantum.document.createElement("div");
                const imageData = internalFS.getFile("/system/env/wallpapers/default.png");
                appBar.style = `position: absolute; bottom: 20px; width: 96%; height: 5em; background-color:rgba(45, 45, 45, 0.7); border-radius: 4em; left: 50%; transform: translateX(-50%); display: block;`;
                desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center;`;
                mainDiv.style = "position: relative; width: 100vw; height: 100vh; overflow: hidden;";
                quantum.document.body.style.margin = "0";
                await mainDiv.append(desktop);
                await desktop.append(appBar);
                
            }   

        } else {
            await addLine("HuopaDesktop isn't installed yet!");
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.install();
        }
    }
};