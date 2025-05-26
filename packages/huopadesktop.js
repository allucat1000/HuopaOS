window.huopadesktop = {
    async install() {
        await new Promise(resolve => setTimeout(resolve, 100));
        await addLine("## [line=blue]HuopaDesktop setup[/line]");
        await addLine("Do you want to install HuopaDesktop? [Y/n]");
        await addLine("HuopaDesktop uses the Quantum display manager.");
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "y") {
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
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.boot()
        } else {
            addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]");
        }
    },
    async boot() {
        const bootConfig = JSON.parse(internalFS.getFile("/system/env/config.json"));
        if (bootConfig) {
            addLine("Boot config found! Attempting to boot from specified path.");
            if (!bootConfig.path) {
                addLine("Incorrect boot config!");
                addLine("Please reinstall HuopaDesktop!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                await this.install();
            } else {
                internalFS.runUnsandboxed(bootConfig.path);
                await new Promise(resolve => setTimeout(resolve, 50));
                try {
                    quantum.init();
                } catch (e) {
                    addLine("Failed to initialize Quantum. Reinstall HuopaDesktop.");
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await this.install();
                }
            }

        } else {
            addLine("HuopaDesktop isn't installed yet!");
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.install();
        }
    }
};