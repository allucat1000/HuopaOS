window.huopadesktop = {
    async install() {
        await new Promise(resolve => setTimeout(resolve, 100));
        addLine("## [line=blue]HuopaDesktop setup[/line]")
        addLine("Do you want to install HuopaDesktop? [Y/n]")
        addLine("HuopaDesktop uses the Quantum display manager.")
        inputAnswerActive = true;
        await waitUntil(() => !inputAnswerActive);
        if (inputAnswer.toLowerCase() === "y") {
            addLine("[line=blue]Installing HuopaDesktop...[/line]")
            internalFS.downloadPackage("huopadesktop/quantum")
            const bootConfig = {
                "path":"/system/env/quantum.js",
            }
            internalFS.createPath("/system/env/config.json", "file", bootConfig);
            internalFS.loadPackage("/system/packages/huopadesktop/quantum.js")
        } else {
            addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]")
        }
    }
};
