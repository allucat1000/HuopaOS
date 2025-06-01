window.apppackage = {
    async app(){
        sys.addLine("# [bg=rgb(168, 168, 142)][color=black]Tung Tung Tung Sahur game![/color][/bg]")
        let activateSahurTimes = 0
        while (activateSahurTimes < 3) {
            sys.addLine("Will you skip Sahur? [y/N]")
            inputAnswerActive = true;
            await waitUntil(() => !inputAnswerActive);
            if (inputAnswer.toLowerCase() === "y") {
                sys.addLine("You have skipped Sahur!!")
                activateSahurTimes++;
                inputAnswer = "";
            }
        }
        sys.addLine("# [color=red]You have skipped Sahur 3 times! Tung Tung Tung Sahur will enter your house now![/color]");
        await new Promise(resolve => setTimeout(resolve, 5000));
        window.location.href = "https://example.com";
    }
};