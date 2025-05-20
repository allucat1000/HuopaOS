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
        addLine("Installing huopaCLI...")
    } else {
        addLine("huopaCLI setup cancelled!")
    }
}
};

// Immediately run the init function after registration
window.huopaCLI.init();
