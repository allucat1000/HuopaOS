window.safetytest = {
    async test() {
        let safetyCheckI = 0;
        try {
            sys.addLine("Doing sandboxing checks...");
            const windowCheck = window;
            sys.addLine(`Window: ${windowCheck}`);
            safetyCheckI++;
            const documentCreateCheck = document.createElement("h1")
            documentCreateCheck.textContent = "No sandboxing!";
            const mainDiv = document.getElementById("termDiv");
            mainDiv.append(documentCreateCheck);
            sys.addLine(`Elem created!`);
            safetyCheckI++;
            sys.addLine("The app is unsandboxed or almost unsandboxed!");
            return;
            
        } catch (error) {
            sys.addLine(`Sandboxing happened! SafetyChecks done: ${safetyCheckI}`);
            sys.addLine(`Error: ${error}`);
            
            return;
        }
    }
}