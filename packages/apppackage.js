window.apppackage = {
    async app(){
        addLine("[bg=rgb(168, 168, 142)]|color=black]# Tung Tung Tung Sahur game![/color][/bg]")
        let activateSahurTimes = 0
        while (activateSahurTimes < 3) {
            addLine("Will you skip Sahur?")
            inputAnswerActive = true;
            await waitUntil(() => !inputAnswerActive);
            if (inputAnswer === false) {
                addLine("You have skipped Sahur!!")
                activateSahurTimes++;
                inputAnswer = "";
            }
        }
        addLine("[color=red] # You have skipped Sahur 3 times! Tung Tung Tung Sahur will enter your house now![/color]");
        await new Promise(resolve => setTimeout(resolve, 5000));
        window.location.href = "https://example.com";
    }
};
