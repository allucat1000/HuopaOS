window.huopadesktop = {
    async install() {
        await new Promise(resolve => setTimeout(resolve, 100));
        addLine("## [line=blue]HuopaDesktop setup[/line]");
        addLine("Do you want to install HuopaDesktop? [Y/n]");
        addLine("HuopaDesktop uses the Quantum display manager.");
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "y") {
            addLine("[line=blue]Installing HuopaDesktop...[/line]")
            try {
                internalFS.downloadPackage("huopadesktop/quantum");
            } catch (error) {
                addLine(`Failed to fetch Quantum package! Error: ${error}`);
            }
            const bootConfig = {
                "path":"/system/packages/huopadesktop/quantum.js",
            }
            internalFS.createPath("/system/env/config.json", "file", bootConfig);
            internalFS.loadPackage("/system/packages/huopadesktop/quantum.js");
        } else {
            addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]");
        }
    },
    async boot() {
        const bootConfig = internalFS.getFile("/system/env/config.json");
        if (bootConfig) {
            addLine("Boot config found! Attempting to boot from specified path.");
            if (!bootConfig.path) {
                addLine("Incorrect boot config!");
                addLine("Please reinstall HuopaDesktop!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.install();
            } else {
                loadPackage(bootConfig.path);
                await new Promise(resolve => setTimeout(resolve, 50));
                quantum.init()
            }

        } else {
            addLine("HuopaDesktop isn't installed yet!");
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.install();
        }
    }
};