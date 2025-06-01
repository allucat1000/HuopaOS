window.huopadesktop = (() => {
    let sysTempInfo = {
        "startMenuOpen":false
    }
    // Priv Sys Funcs
    const fetchAndStoreImage = async (url, path) => {
        const response = await fetch(url);
        if (!response.ok) {
            await sys.addLine(`Failed to fetch image: ${url}`);
            return false;
        }
        const blob = await response.blob();
        const base64data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        await internalFS.createPath(path, "file", base64data);
        return true;
    }

    const openStartMenu = async () => {
        if (!sysTempInfo.startMenuOpen) {
            sysTempInfo.startMenuOpen = true;
            const startMenuDiv = quantum.document.createElement("div")
            startMenuDiv.style = "width: 40em; height: 55%; background-color: rgba(45, 45, 45, 0.85); position: absolute; border-radius: 1em; left: 3%; bottom: 8.5em;"
            const mainDiv = quantum.document.getElementById("termDiv");
            const desktop = quantum.document.getElementById("desktop");
            desktop.append(startMenuDiv)
        }
    };

    
    return {
        // Main Sys

        async boot() {
            const bootConfig = JSON.parse(internalFS.getFile("/system/env/config.json"));
            if (!bootConfig) {
                await sys.addLine("HuopaDesktop isn't installed yet!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.install();
            }

            await sys.addLine("Boot config found! Attempting to boot from specified path.");
            if (!bootConfig.path) {
                await sys.addLine("Incorrect boot config!");
                await sys.addLine("Please reinstall HuopaDesktop!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.install();
            }

            await internalFS.runUnsandboxed(bootConfig.path);
            await new Promise(resolve => setTimeout(resolve, 500));

            try {
                await quantum.init();
            } catch (e) {
                if (e.message.includes("quantum is not defined")) return; 
                await sys.addLine("Failed to initialize Quantum. Reinstall HuopaDesktop.");
                await sys.addLine(`Error: ${e}`);
                console.error(`Error: ${e}`);

            }

            try {
                await sys.addLine("Loading HuopaDesktop...");
                await new Promise(resolve => setTimeout(resolve, 500));

                const mainDiv = quantum.document.getElementById("termDiv");
                mainDiv.innerHTML = "";

                const desktop = quantum.document.createElement("div");
                const appBar = quantum.document.createElement("div");
                const imageData = internalFS.getFile("/system/env/wallpapers/default.png");

                desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center;`;
                desktop.id = "desktop";
                appBar.id = "appBar";
                appBar.style = `position: absolute; bottom: 20px; width: 96%; height: 5em; background-color: rgba(45, 45, 45, 0.85); border-radius: 1em; left: 50%; transform: translateX(-50%); display: flex; align-items: center;`;
                mainDiv.style = "position: relative; width: 100vw; height: 100vh; overflow: hidden;";
                quantum.document.body.style.margin = "0";

                mainDiv.append(desktop);
                desktop.append(appBar);

                const inputLabel = quantum.document.getElementById("inputLabel");
                inputLabel?.remove();

                const huopalogo = internalFS.getFile("/system/env/assets/huopalogo.png");
                const startMenuButton = quantum.document.createElement("button");
                startMenuButton.style = `background-image: url(${huopalogo}); background-size: contain; background-repeat: no-repeat; background-position: center; width: 3.5em; height: 3.5em; border: none; background-color: transparent; border-radius: 50%; margin: 1em;`;

                appBar.id = "appBar";
                appBar.append(startMenuButton);
                startMenuButton.onclick = async function() {
                    openStartMenu();
                }
            } catch (error) {
                await sys.addLine("HuopaDesktop loading failed! Error: " + error);
            }
        },


        // Installer (ignore)


        async install() {
            await new Promise(resolve => setTimeout(resolve, 100));
            await sys.addLine("## [line=blue]HuopaDesktop setup[/line]");
            await sys.addLine("Do you want to install HuopaDesktop? [Y/n]");
            await sys.addLine("HuopaDesktop uses the Quantum display manager.");
            inputAnswerActive = true;
            await waitUntil(() => !inputAnswerActive);
            if (inputAnswer.toLowerCase() === "y" || inputAnswer.toLowerCase() === "") {
                await sys.addLine("[line=blue]Installing HuopaDesktop...[/line]");
                try {
                    await sys.import("quantum");
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    await sys.addLine(`Failed to fetch Quantum module! Error: ${error}`);
                    return;
                }
                await sys.addLine("Quantum installed!");
                const bootConfig = {
                    path: "/system/modules/quantum.js",
                    bootpath: "/system/packages/huopadesktop.js",
                    bootname: "huopadesktop",
                    bootcmd: "boot"
                };
                await internalFS.createPath("/system/env/config.json", "file", JSON.stringify(bootConfig));
                await sys.addLine("Boot config created!");

                const wallpaperSuccess = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/DefaultBG.png`, "/system/env/wallpapers/default.png");

                const logoSuccess = await fetchAndStoreImage("https://raw.githubusercontent.com/allucat1000/HuopaOS/dev/HuopaLogo.png", "/system/env/assets/huopalogo.png");

                if (wallpaperSuccess && logoSuccess) {
                    await sys.addLine("Wallpaper and logo fetched and installed!");
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await this.boot();
                }
            } else {
                await sys.addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]");
            }
        },
        
    };
})();
