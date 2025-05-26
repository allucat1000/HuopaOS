window.quantum = {
    initialized: false,
    version: "0.0.1",
    bootTime: null,

    get document() {
        return new Proxy(document, {
            get(target, prop) {
                if (prop === "createElement") {
                    return (tag) => {
                        const restrictedTags = ["script", "iframe", "object"];
                        if (restrictedTags.includes(tag.toLowerCase())) {
                            throw new Error(`Quantum security: <${tag}> tag is not allowed.`);
                        }
                        return target.createElement(tag);
                    };
                }

                const value = target[prop];

                if (typeof value === "function") {
                    return value.bind(target);
                }

                return value;
            },
            set(target, prop, value) {
                target[prop] = value;
                return true;
            }
        });
    },


    init() {
        if (this.initialized) return "Quantum initialized already!";
        this.initialized = true;
        this.bootTime = Date.now();
        addLine("[line=cyan]Loading Quantum Display Manager...[/line]");
        addLine(`Version: ${this.version}`)
    }
};
