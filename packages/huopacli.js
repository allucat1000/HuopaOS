window.huopaCLI = {
  initialized: false,
  async init() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.initialized = true;
    addLine("## [bg=blue]huopaCLI setup[/bg]")
    addLine("Do you want to install huopaCLI as your system environment? [Y/n]")
    inputAnswerActive = true;
    await waitUntil(() => !inputAnswerActive);
    if (inputAnswer.toLowerCase() === "y") {
        addLine("[bg=purple]Installing huopaCLI...[/bg]")
        const bootFile = `addLine("# Welcome to [color=purple]huopaCLI![/color]"); addLine("What app do you want to load?"); addLine("\n"); addLine("**Terminal**") inputAnswerActive = true; await waitUntil(() => !inputAnswerActive); if (inputAnswer === "Terminal") { addLine("[color=blue]Opening Terminal...[/color]")}`
        localStorage.setItem("/system/env/boot.js", bootFile)
    } else {
        addLine("[bg=red]huopaCLI setup cancelled![/bg]")
    }
}
};

window.huopaCLI.init();