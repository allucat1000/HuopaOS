window.quantum = {
    initialized: false,
    version: "0.0.1",
    bootTime: null,
    get document() {
        return new Proxy(document, {
            get(target, prop) {
                if (prop === "createElement") {
                    return (tag) => {
                        const restrictedTags = [""];
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
        try {
            const sandboxCheck = document.getElementById("termDiv");
        } catch (error) {
            sys.addLine("Quantum initialized with sandbox! Execution cancelled!")
            return;
        }

        if (this.initialized) return "Quantum initialized already!";
        this.initialized = true;
        this.bootTime = Date.now();

    }
};
