window.quantum = {
    initialized: false,
    document: {},
    version: "0.0.1",
    bootTime: null,

    init() {
        if (this.initialized) return "Quantum initialized already!";
        this.initialized = true;
        this.bootTime = Date.now();
        addLine("[line=cyan]Loading Quantum Display Manager...[/line]");
        addLine(`Current version: ${this.version}`)

        this.document = {
            createElement(tagName) {
                return document.createElement(tagName);
            },
            getElementById(id) {
                return document.getElementById(id);
            },
            addClass(element, className) {
                element.classList.add(className);
            },
            append(parentElement, elements) {
                parentElement.append(elements);
            },
            appendChild(parentElement, element) {
                return parentElement.appendChild(element);
            },
            querySelector(selector) {
                return document.querySelector(selector);
            },
            querySelectorAll(selector) {
                return document.querySelectorAll(selector);
            },
            setStyle(element, styles) {
                Object.assign(element.style, styles);
            },
            removeClass(element, className) {
                element.classList.remove(className);
            },
            toggleClass(element, className) {
            element.classList.toggle(className);
            },
            create(tag, { className, id, text, style, attrs } = {}) {
                const elem = document.createElement(tag);
                if (className) {elem.className = className;}
                if (id) {elem.id = id;}
                if (text) {elem.textContent = text;}
                if (style) {Object.assign(elem.style, style);}
                if (attrs) {
                    for (const [k, v] of Object.entries(attrs)) {
                        elem.setAttribute(k, v);
                    }
                }
                return elem;
            }
        };
    }
};
