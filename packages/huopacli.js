window.huopacli = {
    async install() {
        await new Promise(resolve => setTimeout(resolve, 500));
        addLine("## [line=blue]huopaCLI setup[/line]")
        addLine("Do you want to install huopaCLI as your system environment? [Y/n]")
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "y") {
            addLine("[line=blue]Installing huopaCLI...[/line]")
            const bootFile = `internalFS.loadPackage("/system/packages/huopacli.js")`;
            internalFS.createPath("/system/env")
            internalFS.createPath("/system/env/boot.js", "file", bootFile);
            await internalFS.loadPackage("/system/packages/huopacli.js")
            this.boot();
        } else {
            addLine("[line=red]huopaCLI setup cancelled![/line]")
        }
    },
    
    async boot() {
        addLine("[line=green]# HuopaCLI booting…[/line]");
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
        addLine("## [line=red]huopaCLI uninstaller[/line]")
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
