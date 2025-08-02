let contextMenu;
let listener;
return {
    set: async(el, options) => {
        el.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            if (contextMenu) contextMenu.remove();
            contextMenu = document.createElement("div");
            contextMenu.style = "background-color: rgba(45, 45, 45, 0.8); border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 1px solid; position: absolute; z-index: 9999; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); display: block; padding: 0;";
            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.style.left = `${e.clientX}px`;
            for (const opt of options) {
                const optText = document.createElement("p")
                optText.textContent = opt.name;
                optText.style.cursor = "pointer";
                optText.style.margin = "0";
                optText.style.padding = "0.5em";
                optText.onclick = () => opt["function"]();
                contextMenu.append(optText);
            }
            document.body.append(contextMenu);
        });

        document.addEventListener('click', () => {
            if (contextMenu) contextMenu.remove();
        });
    },

    disableDefault: () => {
        listener = document.addEventListener("contextmenu", (e) => e.preventDefault());
    },

    enableDefault: () => {
        document.removeEventListener("contextmenu", listener)
    }
}