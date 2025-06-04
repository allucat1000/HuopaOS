window.huopadesktop = (() => {
    let killSwitch = false
    let sysTempInfo = {
        "startMenuOpen":false
    }
    // Priv Sys Funcs

    const downloadApp = async (url, savePath) => {
        sys.addLine(`[line=blue]Installing app to path ${savePath}...[/line]`);
        const response = await fetch(url);
        if (response.ok) {
            const code = await response.text();
            await internalFS.createPath(savePath, "file", code);
            sys.addLine("[line=green]App installed![/line]");
        } else {
            sys.addLine("Failed to install app!");
            sys.addLine(`Response status: ${response.status}`);
        }
       
    }
    const fetchAndStoreImage = async (url, path) => {
        if (killSwitch) return;
        const response = await fetch(url);
        if (!response.ok) {
            await sys.addLine(`Failed to fetch image: ${url}`);
            return false;
        }
        const blob = await response.blob();
        const base64data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        await internalFS.createPath(path, "file", base64data);
        return true;
    }

    const runAppSecure = async (appCode, appId) => {
        if (killSwitch) return null;

        const iframe = quantum.document.createElement('iframe');
        iframe.id = `code-${appId}`;

        iframe.sandbox = "allow-scripts";
        iframe.style.display = "none";
        quantum.document.body.appendChild(iframe);

        const iframeHTML = `
            <script>
                const localClickHandlers = {};

                window.addEventListener("message", (event) => {
                    const data = event.data;
                    if (data?.type === "click" && data?.elementId) {
                        const handler = localClickHandlers[data.elementId];
                        if (handler) handler();
                    }
                });

                const huopaAPI = (() => {
                    let msgId = 0;
                    const callbacks = new Map();

                    window.addEventListener("message", (event) => {
                        const { type, id, result, error } = event.data || {};
                        if (type === "apiResponse" && callbacks.has(id)) {
                            const { resolve, reject } = callbacks.get(id);
                            callbacks.delete(id);
                            if (error) reject(new Error(error));
                            else resolve(result);
                        }
                    });

                    return new Proxy({}, {
                        get(_, prop) {
                            if (prop === "setOnClick") {
                                return async (elementId, handler) => {
                                    localClickHandlers[elementId] = handler;
                                    // Notify parent to bind a click listener that sends back message
                                    return new Promise((resolve, reject) => {
                                        const id = "msg_" + msgId++;
                                        callbacks.set(id, { resolve, reject });
                                        window.parent.postMessage({
                                            type: "bindClickForward",
                                            data: [elementId],
                                            id
                                        }, "*");
                                    });
                                };
                            }

                            // All other calls forwarded to parent
                            return (...args) => {
                                return new Promise((resolve, reject) => {
                                    const id = "msg_" + msgId++;
                                    callbacks.set(id, { resolve, reject });
                                    window.parent.postMessage({ type: prop, data: args, id }, "*");
                                });
                            };
                        }
                    });
                })();

                (async () => {
                    try {
                        ${appCode}
                    } catch (e) {
                        huopaAPI.error?.("Runtime Error: " + e.message);
                    }
                })();
            </script>
        `;


        iframe.srcdoc = iframeHTML;

        await new Promise(r => setTimeout(r, 0));

        return iframe;
    };



    const huopaAPI = new Proxy({}, {
        get(target, prop) {
            return (...args) => {
            if (typeof huopaAPIHandlers[prop] === "function") {
                huopaAPIHandlers[prop](...args);
            } else {
                console.warn(`No handler for huopaAPI method '${prop}'`);
            }
            };
        }
    });




    const messageHandler = async (event) => {
            if (killSwitch) return;
            const { type, data, id } = event.data || {};
            if (typeof type !== "string" || !huopaAPI[type]) return;

            try {
                const result = await huopaAPI[type](...(Array.isArray(data) ? data : [data]));
                if (id) {
                    event.source?.postMessage({ type: "apiResponse", id, result }, "*");
                }
            } catch (err) {
                if (id) {
                    event.source?.postMessage({ type: "apiResponse", id, error: err.message }, "*");
                } else {
                    console.error("[APP ERROR] " + err.message);
                }
            }
        };


    const huopaAPIMap = new WeakMap();

    const runApp = async (appId, appCodeString) => {
        if (killSwitch) return;

        const container = await createAppContainer(appId);
        const handlers = huopaAPIHandlers(container);

        const huopaAPI = new Proxy({}, {
            get(_, prop) {
                return (...args) => {
                    if (typeof handlers[prop] === "function") {
                        return handlers[prop](...args);
                    } else {
                        console.warn(`No handler for huopaAPI method '${prop}'`);
                    }
                };
            }
        });


        const iframe = await runAppSecure(appCodeString, appId);

        if (iframe && iframe.contentWindow) {
            huopaAPIMap.set(iframe.contentWindow, huopaAPI);
        } else {
            console.error("runAppSecure failed to create iframe or contentWindow");
        }
    };
    const elementRegistry = {}
    let elementIdCounter = 0;

    const huopaAPIHandlers = (appContainer) => {

        
        return {
            createElement: function(tag) {
                const el = quantum.document.createElement(tag);
                el.style.maxWidth = "100%";
                el.style.maxHeight = "100%";
                el.style.boxSizing = "border-box";
                elementIdCounter++
                const id = `el_${elementIdCounter}`;
                el.dataset.huopaId = id;
                el.id = id;
                elementRegistry[id] = el;
                return id;
            },

            appendToApp: function(id) {    
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`append: Element with ID '${id}' not found.`);
                    return;
                }
                if (el) appContainer.appendChild(el);
            },


            append: function(parent, id) {    
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`append: Element with ID '${id}' not found.`);
                    return;
                }
                const parentEl = elementRegistry[parent];
                if (!parentEl) {
                    console.warn(`append: Element with ID '${parent}' not found.`);
                    return;
                }
                parentEl.appendChild(el);
            },

            getElementById: function(id) {
                return appContainer.querySelector(`#${id}`);
            },

            querySelector: function(sel) {
                return appContainer.querySelector(sel);
            },

            querySelectorAll: function(sel) {
                return appContainer.querySelectorAll(sel);
            },

            log: function(msg) {
                console.log(`[APP LOG]: ${msg}`);
            },

            error: function(msg) {
                console.error(`[APP ERROR]: ${msg}`);
            },

            warn: function(msg) {
                console.error(`[APP WARN]: ${msg}`);
            },

            container: appContainer,

            Math,

            Date,

            fetch,

            setTimeout,

            clearTimeout,


            getWindowSize: function() {
                return {
                    width: appContainer.clientWidth,
                    height: appContainer.clientHeight,
                };
            },

            setText: function(id, text) {
                const el = elementRegistry[id];
                if (el) el.textContent = text;
            },

            setInnerHMTL: function(id, content) {
                const el = elementRegistry[id];
                if (el) el.innerHTML = content;
            },

            setStyle: function(id, styleText) {
                const el = elementRegistry[id];
                if (el) el.style = styleText;
            },

            setOnClick: function(id) {
                const el = elementRegistry[id];
                if (!el) return;

                el.addEventListener("click", () => {
                    sandboxWindow.postMessage({
                        type: "event",
                        event: "click",
                        elementId: id
                    }, "*");
                });
            }

        };
    };


    window.addEventListener("message", async (event) => {
        if (killSwitch) return;
        const { type, data, id } = event.data || {};

        if (type === "bindClickForward") {
            const [elementId] = data;
            const el = elementRegistry[elementId];
            if (el) {
                const clickHandler = () => {
                    event.source.postMessage({ type: "click", elementId }, "*");
                };
                el.addEventListener("click", clickHandler);

                if (id) {
                    event.source.postMessage({ type: "apiResponse", id, result: true }, "*");
                }
            } else {
                if (id) {
                    console.warn(`Element ${elementId} not found in elementRegistry.`);
                    event.source.postMessage({ type: "apiResponse", id, error: "Element not found" }, "*");
                }
            }
            return;
        }

        const huopaAPI = huopaAPIMap.get(event.source);
        if (!huopaAPI || typeof huopaAPI[type] !== "function") {
            console.warn(`No handler for huopaAPI method '${type}'`);
            return;
        }

        try {
            const result = await huopaAPI[type](...(Array.isArray(data) ? data : [data]));
            if (id) {
                event.source?.postMessage({ type: "apiResponse", id, result }, "*");
            }
        } catch (err) {
            if (id) {
                event.source?.postMessage({ type: "apiResponse", id, error: err.message }, "*");
            } else {
                sys.addLine("[APP ERROR] " + err.message);
            }
        }
    });
    let appZIndex = 100;
    function createDraggableWindow(windowEl, dragHandleSelector = ".titlebar") {
        
        
        const dragHandle = windowEl.querySelector(dragHandleSelector);
        if (!dragHandle) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        dragHandle.style.cursor = "grab";
        dragHandle.addEventListener("mousedown", (e) => {
            isDragging = true;
            const rect = windowEl.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            windowEl.style.position = "absolute";
            windowEl.style.zIndex = appZIndex++;


            quantum.document.addEventListener("mousemove", onMouseMove);
            quantum.document.addEventListener("mouseup", onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            dragHandle.style.cursor = "grabbing";
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            windowEl.style.left = x + "px";
            windowEl.style.top = y + "px";
        }

        function onMouseUp() {
            isDragging = false;
            quantum.document.removeEventListener("mousemove", onMouseMove);
            quantum.document.removeEventListener("mouseup", onMouseUp);
        }
    }

    const createAppContainer = async (appId) => {
        const outerContainer = quantum.document.createElement("div");
        outerContainer.style = `
            position: absolute;
            width: 700px;
            height: 500px;
            top: 50px;
            right: 200px;
            overflow: hidden;
            resize: both;
            border: 2px solid gray;
            border-radius: 0.5em;
            background: rgba(30, 30, 30, 0.8);
            margin: 0;
        `;

        const titleBar = quantum.document.createElement("div");
        const appTitle = quantum.document.createElement("h3");
        appTitle.textContent = appId;
        appTitle.style = "font-family: sans-serif; margin: 0.5em;"
        titleBar.className = "titlebar";
        const container = quantum.document.createElement("div");
        container.className = "app-container";
        container.style = "width: 100%; height: 100%;";
        const closeButton = quantum.document.createElement("button");
        closeButton.textContent = "×";
        closeButton.style = `
            background: transparent;
            border: none;
            color: white;
            font-size: 1em;
            cursor: pointer;
            position: absolute;
            right: 0.5em;
            top: 0.5em;
        `;
        closeButton.addEventListener("click", () => {
            const codeElem = quantum.document.getElementById(`code-${appId}`);
            codeElem.remove();
            outerContainer.remove();
        });
        container.id = `app-${appId}`;
        quantum.document.getElementById("desktop").appendChild(outerContainer);
        outerContainer.append(titleBar);
        titleBar.append(appTitle);
        titleBar.appendChild(closeButton);
        outerContainer.append(container);
        createDraggableWindow(outerContainer);
        return container;
    }

    
    const openStartMenu = async () => {
        if (killSwitch) return;
        if (!sysTempInfo.startMenuOpen) {

            let startMenuDiv = quantum.document.getElementById("startMenuDiv");
            const desktop = quantum.document.getElementById("desktop");
            const mainDiv = quantum.document.getElementById("termDiv");
            sysTempInfo.startMenuOpen = "half";

            if (!startMenuDiv) {
                startMenuDiv = quantum.document.createElement("div");
                startMenuDiv.id = "startMenuDiv";
                startMenuDiv.style.cssText = `
                    width: 30em;
                    height: 385px;
                    background-color: rgba(45, 45, 45, 0.75);
                    position: absolute;
                    border-radius: 1em;
                    border: 2.5px;
                    border-style: solid;
                    border-color: rgba(105, 105, 105, 1);
                    left: 3%;
                    bottom: 8.5em;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                `;

                desktop.append(startMenuDiv);
            }
            const shutdownButton = quantum.document.createElement("button");
            shutdownButton.style = "background-color: rgba(45, 45, 45, 0.7); border-color: rgba(105, 105, 105, 0.6); border-style: solid; border-radius: 0.5em; position: absolute; cursor: pointer; right: 0.5em; bottom: 0.5em; color: white; padding: 0.5em;"
            shutdownButton.textContent = "Shutdown";
            shutdownButton.onclick = () => { mainDiv.innerHTML = ""; killSwitch = true; sys.addLine(`The system has shut down! Date (Unix epoch): ${Date.now()}`); return; }
            startMenuDiv.append(shutdownButton);
            const appList = JSON.parse(internalFS.getFile("/home/applications"));
            const appText = quantum.document.createElement("h2");
            appText.textContent = "Your apps";
            appText.style = "margin: 0.5em; text-align: left; color: white; font-family: sans-serif;"
            startMenuDiv.append(appText);
            if (appList.length < 1) {
                const noAppsText = quantum.document.createElement("p");
                noAppsText.textContent = "You don't seem to have any apps installed right now!";
                noAppsText.style = "margin: 0.7em; max-width: 17em; text-align: left; color: white; font-family: sans-serif;"
                startMenuDiv.append(noAppsText);
            }

            for (let i = 0; i < appList.length; i++) {
                const appButton = quantum.document.createElement("button");
                const cleanedAppName = appList[i].replace("/home/applications/", "")
                appButton.textContent = cleanedAppName;
                appButton.style = "color: white; background-color: rgba(45, 45, 45, 0.7); border-color: rgba(105, 105, 105, 0.6); border-style: solid; border-radius: 0.5em; padding: 0.5em; width: 22em; height: 3em; margin: 0.5em; text-align: left; cursor: pointer;"
                appButton.onclick = async () => {
                    const code = internalFS.getFile(appList[i]);
                    await runApp(cleanedAppName, code);
                };
                startMenuDiv.append(appButton);
            }
            requestAnimationFrame(() => {
                startMenuDiv.style.opacity = "1";
                startMenuDiv.style.transform = "translateY(0)";
            });

            setTimeout(() => {
                sysTempInfo.startMenuOpen = true;
            }, 300);


        } else if (sysTempInfo.startMenuOpen === true){
            sysTempInfo.startMenuOpen = "half";
            const startMenuDiv = quantum.document.getElementById("startMenuDiv");

            requestAnimationFrame(() => {
                startMenuDiv.style.opacity = "0";
                startMenuDiv.style.transform = "translateY(20px)";
            });
            setTimeout(() => {
                startMenuDiv.innerHTML = "";
                setTimeout(() => {
                    sysTempInfo.startMenuOpen = false;
                }, 50);
            }, 300);
        
        }
    };

    const createMainGUI = async () => {
        if (killSwitch) return;
        try {
            const mainDiv = quantum.document.getElementById("termDiv");
            mainDiv.innerHTML = "";

            const desktop = quantum.document.createElement("div");
            const appBar = quantum.document.createElement("div");
            const imageData = internalFS.getFile("/system/env/wallpapers/default.png");
            quantum.document.body.style.margin = "0";
            desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center;`;
            desktop.id = "desktop";
            mainDiv.append(desktop);

            const inputLabel = quantum.document.getElementById("inputLabel");
            inputLabel?.remove();
            mainDiv.style = "position: relative; width: 100vw; height: 100vh; overflow: hidden;";

            if (window.innerWidth < 1050 || window.innerHeight < 700) {
                const popup = quantum.document.createElement("div");
                popup.style = "width: 90%; height: 90%; background-color: rgba(35, 35, 35, 0.75); border-radius: 0.5em; border-style: solid; border-color: rgba(55, 55, 55, 0.9); border-width: 2px; position: absolute; left: 50%; transform: translateX(-50%); top: 5%; "
                const popupText = quantum.document.createElement("h1");
                popupText.textContent = "HuopaDesktop requires a screen size of at least 1050px x 700px!";
                popupText.style = "padding: 0.5em; max-width: 90%; margin: 1em auto; text-align: center; font-size: 3em;"
                mainDiv.append(popup);
                popup.append(popupText);
                return;
            }

            appBar.id = "appBar";
            appBar.style = `position: absolute; bottom: 20px; width: 96%; height: 5em; background-color: rgba(45, 45, 45, 0.75); border-radius: 1em; left: 50%; transform: translateX(-50%); display: flex; align-items: center; border: 2.5px; border: 2.5px; border-style: solid; border-color: rgba(105, 105, 105, 1);`;


            desktop.append(appBar);


            const huopalogo = internalFS.getFile("/system/env/assets/huopalogo.png");
            const startMenuButton = quantum.document.createElement("button");
            startMenuButton.style = `background-image: url(${huopalogo}); background-size: contain; background-repeat: no-repeat; background-position: center; width: 3.5em; height: 3.5em; border: none; background-color: transparent; border-radius: 50%; margin: 1em; transition: 0.15s;cursor: pointer; transform-origin: center;`;

            appBar.id = "appBar";
            appBar.append(startMenuButton);
            startMenuButton.onclick = async function() {
                openStartMenu();
            }
            startMenuButton.addEventListener("mouseenter", () => {
                startMenuButton.style.filter = "brightness(0.8)";
            });

            startMenuButton.addEventListener("mouseleave", () => {
                startMenuButton.style.filter = "brightness(1)";
            });

        } catch (error) {
            const mainDiv = quantum.document.getElementById("termDiv");
            mainDiv.innerHTML = "";
            await sys.addLine("# [color=red]/!\\ [/color]")
            await sys.addLine("## [line=red]An unhandled exeption has occurred in HuopaDesktop and the system has been forced to halt.[/line]");
            await sys.addLine(`## Error: ${error}`);
            await sys.addLine("Try updating your packages (such as HuopaDesktop) using the command: \"hpkg update\".");
            await sys.addLine("If you still have issues, check if you have any custom scripts for HuopaDesktop. If you do, try booting HuopaDesktop without the scripts.");
            await sys.addLine("If you don't have any custom scripts or the issue is still occurring, please report this issue to me (for example through the HuopaOS Github).");
            await sys.addLine("### Reboot the system to load into HuopaDesktop or the terminal (hold down \"C\" to load into the terminal).");
        }

    }

    
    return {
        // Main Sys

        async boot() {
            const bootConfig = JSON.parse(internalFS.getFile("/system/env/config.json"));
            if (!bootConfig) {
                await sys.addLine("HuopaDesktop isn't installed yet!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.install();
            }

            await sys.addLine("Boot config found! Attempting to boot from specified path.");
            if (!bootConfig.path) {
                await sys.addLine("Incorrect boot config!");
                await sys.addLine("Please reinstall HuopaDesktop!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.install();
            }

            await internalFS.runUnsandboxed(bootConfig.path);
            await new Promise(resolve => setTimeout(resolve, 500));

            try {
                await quantum.init();
            } catch (e) {
                if (e.message.includes("quantum is not defined")) return; 
                await sys.addLine("Failed to initialize Quantum. Reinstall HuopaDesktop.");
                await sys.addLine(`Error: ${e}`);
                console.error(`Error: ${e}`);

            }


                await sys.addLine("Loading HuopaDesktop...");
                await new Promise(resolve => setTimeout(resolve, 500));

                createMainGUI()

        },


        // Installer (ignore)


        async install() {
            await new Promise(resolve => setTimeout(resolve, 100));
            await sys.addLine("## [line=blue]HuopaDesktop setup[/line]");
            await sys.addLine("Do you want to install HuopaDesktop? [Y/n]");
            await sys.addLine("HuopaDesktop uses the Quantum display manager.");
            inputAnswerActive = true;
            await waitUntil(() => !inputAnswerActive);
            if (inputAnswer.toLowerCase() === "y" || inputAnswer.toLowerCase() === "") {
                await sys.addLine("[line=blue]Installing HuopaDesktop...[/line]");
                try {
                    await sys.import("quantum");
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    await sys.addLine(`Failed to fetch Quantum module! Error: ${error}`);
                    return;
                }
                await sys.addLine("Quantum installed!");
                const bootConfig = {
                    path: "/system/modules/quantum.js",
                    bootpath: "/system/packages/huopadesktop.js",
                    bootname: "huopadesktop",
                    bootcmd: "boot"
                };
                await internalFS.createPath("/system/env/config.json", "file", JSON.stringify(bootConfig));
                await sys.addLine("Boot config created!");
                await sys.addLine("Attempting to install example app...")
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaDesktop/HuopaClicker.js`, "/home/applications/HuopaClicker.js")

                const wallpaperSuccess = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/DefaultBG.png`, "/system/env/wallpapers/default.png");

                const logoSuccess = await fetchAndStoreImage("https://raw.githubusercontent.com/allucat1000/HuopaOS/dev/HuopaLogo.png", "/system/env/assets/huopalogo.png");

                if (wallpaperSuccess && logoSuccess) {
                    await sys.addLine("Wallpaper and logo fetched and installed!");
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await this.boot();
                }
            } else {
                await sys.addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]");
            }
        },
        
    };
})();
