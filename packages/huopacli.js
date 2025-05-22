window.huopacli = {
    async install() {
        await new Promise(resolve => setTimeout(resolve, 500));
        addLine("## [bg=blue]huopaCLI setup[/bg]")
        addLine("Do you want to install huopaCLI as your system environment? [Y/n]")
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "y") {
            addLine("[bg=purple]Installing huopaCLI...[/bg]")
            const bootFile = `loadPackage("/system/packages/huopacli.js")`;
            createPath("/system/env")
            createPath("/system/env/boot.js", "file", bootFile);
            await loadPackage("/system/packages/huopacli.js")
            this.boot();
        } else {
            addLine("[bg=red]huopaCLI setup cancelled![/bg]")
        }
    },
    
    async boot() {
        addLine("[bg=green]# HuopaCLI booting…[/bg]");
        addLine("### What app do you want to open?")
        addLine("Terminal")
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "terminal") {
            boogMGR("termBoot");
        }
    },

    async uninstall() {
        await new Promise(resolve => setTimeout(resolve, 500));
        addLine("## [bg=red]huopaCLI uninstaller[/bg]")
        addLine("Uninstall huopaCLI? This will put you in the terminal. [y/n]")
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "y") {
            addLine("[color=red]Uninstalling huopaCLI...[/color]")
        } else {
            addLine("## huopaCLI uninstall cancelled!")
        }
    }
};