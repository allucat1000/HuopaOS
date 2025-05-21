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
            createDir("/system/env")
            addResultToDir("/system", "/system/env")
            addResultToDir("/system/env", "/system/env/boot.js")
            localStorage.setItem("/system/env/boot.js", bootFile);
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
    }
};