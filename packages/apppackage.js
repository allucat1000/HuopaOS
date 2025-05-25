window.apppackage = {
    async app(){
        addLine("# [line=rgb(168, 168, 142)]Tung Tung Tung Sahur game![/line]")
        let activateSahurTimes = 0
        while (activateSahurTimes < 3) {
            addLine("Will you skip Sahur? [y/N]")
            inputAnswerActive = true;
            await waitUntil(() => !inputAnswerActive);
            if (inputAnswer.toLowerCase() === "y") {
                addLine("You have skipped Sahur!!")
                activateSahurTimes++;
                inputAnswer = "";
            }
        }
        addLine("# [line=red]You have skipped Sahur 3 times! Tung Tung Tung Sahur will enter your house now![/line]");
        await new Promise(resolve => setTimeout(resolve, 5000));
        addLine("# Boo! Spookylicious");
    }
};
