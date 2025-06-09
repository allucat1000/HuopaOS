window.huopadesktop = (() => {
    let killSwitch = false
    let sysTempInfo = {
        "startMenuOpen":false
    }
    // Priv Sys Funcs

    const createSysDaemon = async (name, daemonFunc) => {
        console.log("[SYS]: Running System Daemon: " + name);
        daemonFunc();
    }
    const induceCrash = async (error) => {
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
        const safeAppCode = appCode
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');

        const iframeHTML = `
            <script>
                const appName = ${JSON.stringify(appId)};
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
                                            id,
                                            appName
                                        }, "*");
                                    });
                                };
                            }

                            // All other calls forwarded to parent
                            return (...args) => {
                                return new Promise((resolve, reject) => {
                                    const id = "msg_" + msgId++;
                                    callbacks.set(id, { resolve, reject });
                                    window.parent.postMessage({ type: prop, data: args, id, appName }, "*");
                                });
                            };
                        }
                    });
                })();

                (async () => {
                    try {
                        ${safeAppCode}
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
            const { type, data, id, appName } = event.data || {};
            if (typeof type !== "string" || !huopaAPI[type]) return;

            try {
                const result = await huopaAPI[type](...(Array.isArray(data) ? data : [data]), appName);
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
            deleteElement: function(id) {
                const el = elementRegistry[id]
                if (!el) {
                    console.warn(`delete: Element with ID '${id}' not found.`);
                    return;
                }
                el.remove();
                delete elementRegistry[id];

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

            getText: function(id) {
                const el = elementRegistry[id];
                if (el) el.textContent = text;
            },

            setInnerHTML: function(id, content, appID) {
                const el = elementRegistry[id];
                if (content || "".length > 0) {
                    console.warn(`[APP SAFETY] Application '${appID} set innerHTML.`);
                }
                
                if (el) el.innerHTML = content || "";
            },
            getInnerHTML: function(id) {
                const el = elementRegistry[id];
                return el.innerHTML || "";
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
            },

            getFile: function(path, permissions) {
                return internalFS.getFile(path, permissions);
            },

            writeFile: function(path, type, content, permissions = {
                "read":"",
                "write":"",
                "modify":"",
            }) {
                return internalFS.createPath(path, type, content, permissions);
            },

            setSrc: function(id, src) {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`setSrc: Element with ID: '${id}' not found.`);
                    return;
                }
                el.src = src;
            },
            getSrc: function(id) {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`setSrc: Element with ID: '${id}' not found.`);
                    return;
                }
                if (el.src) return el.src;
            },

            setCertainStyle: function(id, styleName, content) {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`setCertainStyle: Element with ID: '${id}' not found.`);
                    return;
                }
                el.style[styleName] = content;
            },

            openFileImport: async function(accept = "*", type = "text", allowMultiple = false) {
                const files = await new Promise((resolve, reject) => {
                    const input = quantum.document.createElement("input");
                    input.type = "file";
                    input.accept = accept;
                    input.multiple = allowMultiple;
                    input.style.display = "none";

                    input.addEventListener("change", () => {
                        if (input.files.length > 0) {
                            resolve(Array.from(input.files));
                        } else {
                            reject(new Error("No files selected!"));
                        }
                        appContainer.removeChild(input);
                    });

                    appContainer.appendChild(input);
                    input.click();
                });

                const readFile = (file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("Failed to read file"));

                    if (type === "text") {
                        reader.readAsText(file);
                    } else if (type === "dataURL") {
                        reader.readAsDataURL(file);
                    } else if (type === "binary") {
                        reader.readAsArrayBuffer(file);
                    } else {
                        reject(new Error(`Unsupported file type "${type}"!`));
                    }
                });

                const results = await Promise.all(files.map(readFile));

                if (allowMultiple) {
                    return files.map((file, index) => ({
                        content: results[index],
                        name: file.name,
                        type: file.type,
                        size: file.size
                    }));
                } else {
                    return {
                        content: results[0],
                        name: files[0].name,
                        type: files[0].type,
                        size: files[0].size
                    };
                }
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
    let appZIndex = 500;
    function createDraggableWindow(windowEl, dragHandleSelector = ".titlebar") {
        windowEl.style.position = "absolute";
        
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
            appZIndex = appZIndex + 10;
            windowEl.style.zIndex = appZIndex;


            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            windowEl.style.left = x + "px";
            windowEl.style.top = y + "px";

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
            quantum.document.body.style.userSelect = "";
            isDragging = false;
            quantum.document.removeEventListener("mousemove", onMouseMove);
            quantum.document.removeEventListener("mouseup", onMouseUp);
        }
    }

    const createAppContainer = async (appId) => {
        const outerContainer = quantum.document.createElement("div");
        const winSpawnX = window.innerWidth / 2;
        outerContainer.style = `
            position: absolute;
            width: 700px;
            height: 500px;
            top: 100px;
            left: ${winSpawnX}px;
            overflow: hidden;
            resize: both;
            border: 2px solid gray;
            border-radius: 0.5em;
            background: rgba(30, 30, 30, 0.65);
            margin: 0;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.15s ease, transform 0.15s ease;
            backdrop-filter: blur(2px);
        `;
        const titleBar = quantum.document.createElement("div");
        titleBar.style = `
            position: absolute;
            top: 0px;
            left: 0;
            height: 22px;
            width: 100%;
            background: rgba(0, 0, 0, 0);
            z-index: ${appZIndex + 1}
        `;
        const appTitle = quantum.document.createElement("h3");
        appTitle.textContent = appId.replace(/\.js$/, "");;
        appTitle.style = "font-family: sans-serif; margin: 0.5em;"
        titleBar.className = "titlebar";
        const container = quantum.document.createElement("div");
        container.className = "app-container";
        container.style = `width: 100%; height: 100%; overflow: auto; position: relative;`;
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
        requestAnimationFrame(() => {
            outerContainer.style.opacity = "1";
            outerContainer.style.transform = "translateY(0px)";
        });

        return container;
        
    }

    
    const openStartMenu = async () => {
        if (killSwitch) return;
        try {
            
        
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
                    bottom: 7.5em;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    z-index: 99999;
                    backdrop-filter: blur(2px);
                `;
                desktop.append(startMenuDiv);
            }
            startMenuDiv.style.display = "block";
            const shutdownButton = quantum.document.createElement("button");
            shutdownButton.style = "background-color: rgba(45, 45, 45, 0.7); border-color: rgba(105, 105, 105, 0.6); border-style: solid; border-radius: 0.5em; position: absolute; cursor: pointer; right: 0.5em; bottom: 0.5em; color: white; padding: 0.5em;"
            shutdownButton.textContent = "Shutdown";
            shutdownButton.onclick = async () => {
                mainDiv.innerHTML = ""; killSwitch = true;
                sys.addLine(`The system has shut down! Date (Unix epoch): ${Date.now()}`); 
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.href = window.location.href;
                

            }
            startMenuDiv.append(shutdownButton);
            let appList = JSON.parse(await internalFS.getFile("/home/applications") || "[]");

            if (!appList) {
                console.warn("/home/applications does not exist. Creating...");
                internalFS.createPath("/home/applications");
                return;
            }
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
            const appListDiv = quantum.document.createElement("div");
            appListDiv.style = "height: 18em; overflow: auto; position: relative;"
            startMenuDiv.append(appListDiv);
            for (let i = 0; i < appList.length; i++) {
                const appButton = quantum.document.createElement("button");
                const cleanedAppName = appList[i].replace("/home/applications/", "")
                appButton.textContent = cleanedAppName.replace(/\.js$/, "");;
                appButton.style = "color: white; background-color: rgba(45, 45, 45, 0.7); border-color: rgba(105, 105, 105, 0.6); border-style: solid; border-radius: 0.5em; padding: 0.5em; width: 35em; height: 3em; margin: 0.2em 0.5em; text-align: left; cursor: pointer;"
                appButton.onclick = async () => {
                    const code = await internalFS.getFile(appList[i]);
                    await runApp(cleanedAppName, code);
                    await openStartMenu()
                };
                appListDiv.append(appButton);
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
                startMenuDiv.style.display = "none";
                setTimeout(() => {
                    sysTempInfo.startMenuOpen = false;
                }, 50);
            }, 300);
        
        }
        } catch (error) {
            induceCrash(error);
        }
    };

    const createMainGUI = async () => {
        if (killSwitch) return;
        try {
            const mainDiv = quantum.document.getElementById("termDiv");
            mainDiv.innerHTML = "";
            const desktop = quantum.document.createElement("div");

            const dock = quantum.document.createElement("div");
            const wallpaperChosen = await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt");
            const imageData = await internalFS.getFile(wallpaperChosen);
            quantum.document.body.style.margin = "0";
            desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center; font-family: sans-serif;`;
            quantum.document.body.style.userSelect = "none";
            desktop.id = "desktop";
            mainDiv.append(desktop);
            createSysDaemon("wallpaperUpdater", async () => {
                let oldwallpaper = await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt");
                async function loop() {
                    const updateCheck = oldwallpaper === await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt");
                    if (updateCheck === false) {
                        oldwallpaper = await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt");
                        const wallpaperChosen = await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt");
                        const imageData = await internalFS.getFile(wallpaperChosen);
                        desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center; font-family: sans-serif;`;
                    }
                    setTimeout(loop, 250);
                }
                loop()
            })

            const inputLabel = quantum.document.getElementById("inputLabel");
            inputLabel?.remove();
            mainDiv.style = "position: relative; width: 100vw; height: 100vh; overflow: hidden;";
            let popupClosed = false;
            if (window.innerWidth < 850 || window.innerHeight < 650) {
                const popupBG = quantum.document.createElement("div");
                const popup = quantum.document.createElement("div");
                popup.style = "width: 90%; height: 20%; background-color: rgba(35, 35, 35, 0.75); border-radius: 0.5em; border-style: solid; border-color: rgba(55, 55, 55, 0.9); border-width: 2px; position: absolute; left: 50%; transform: translateX(-50%); top: 5%; "
                const popupText = quantum.document.createElement("h1");
                popupText.textContent = "It is recommended to have a screen size of at least 850px x 650px. Click OK to continue.";
                popupText.style = "padding: 0.5em; max-width: 90%; margin: 0.5em auto; text-align: center; font-size: 1.25em;"
                popupBG.style = "background-color: rgba(0, 0, 0, 0.5); width: 100%; height: 100%;"
                desktop.append(popupBG);
                popupBG.append(popup);
                const acceptButton = quantum.document.createElement("button");
                acceptButton.style = "background-color: rgba(35, 35, 35, 0.75); border-radius: 0.5em; border-style: solid; border-color: rgba(55, 55, 55, 0.9); color: white; margin: 0.5em auto; text-align: center; padding: 0.7em; display: block; cursor: pointer;"
                popup.append(popupText);
                acceptButton.textContent = "OK";
                acceptButton.onclick = () => {
                    popupBG.remove();
                    popupClosed = true;
                }
                popup.append(acceptButton);
            } else popupClosed = true;
            await waitUntil(() => popupClosed);
            dock.id = "dock";
            dock.style = `position: absolute; bottom: 20px; width: 96%; height: 4em; background-color: rgba(45, 45, 45, 0.75); border-radius: 1em; left: 50%; transform: translateX(-50%); display: flex; align-items: center; border: 2.5px; border: 2.5px; border-style: solid; border-color: rgba(105, 105, 105, 1); z-index: 15000; backdrop-filter: blur(2px);`;

            await desktop.append(dock);

            const huopalogo = await internalFS.getFile("/system/env/assets/huopalogo.png");
            const startMenuButton = quantum.document.createElement("button");
            startMenuButton.style = `outline: none; background-image: url(${huopalogo}); background-size: contain; background-repeat: no-repeat; background-position: center; width: 4em; height: 4em; border: none; background-color: transparent; border-radius: 50%; margin: 1em; transition: 0.15s;cursor: pointer; transform-origin: center;`;
            const appBar = quantum.document.createElement("div");
            const clockDiv = quantum.document.createElement("div");
            clockDiv.id = "clockDiv";
            clockDiv.style = "padding: 0.33em; margin: 0.33em; border-radius: 0.75em; background-color: rgba(94, 94, 94, 0.37); border-style: solid; border-width: 2.5px; border-color: rgba(255, 255, 255, 0.19); text-align: center; width: 11.5em; max-height: 2.5em;"
            const clockCurrentTime = quantum.document.createElement("p");
            const clockCurrentDate = quantum.document.createElement("p");
            createSysDaemon("clockUpdate", () => {
                const pad = n => String(n).padStart(2, "0");
                const monthNameList = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                const loop = () => {
                    const now = new Date();
                    clockCurrentTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}.${pad(now.getSeconds())}`;

                    let date = now.getDate();
                    let dateEnding = "th";

                    if (date % 100 < 11 || date % 100 > 13) {
                        if (date % 10 === 1) dateEnding = "st";
                        else if (date % 10 === 2) dateEnding = "nd";
                        else if (date % 10 === 3) dateEnding = "rd";
                    }

                    clockCurrentDate.textContent = `${date}${dateEnding} of ${monthNameList[now.getMonth()]}, ${now.getFullYear()}`;
                    setTimeout(loop, 1000);
                };

                loop();
            });

            clockDiv.append(clockCurrentTime);
            clockDiv.append(clockCurrentDate);
            appBar.style = `width: 100%; height: 90%; border-radius: 0.7em;`
            appBar.id = "appBar";
            await dock.append(startMenuButton);
            await dock.append(appBar);
            await dock.append(clockDiv);

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
            induceCrash(error);
        }

    }

    
    return {
        // Main Sys

        async boot() {
            const bootConfig = JSON.parse(await internalFS.getFile("/system/env/config.json"));
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
                if (e.message.includes("ReferenceError:")) return;

                console.error(`Failed to initialize Quantum. Error: ${e}`);
                return;
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
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaDesktop/HuopaClicker.js`, "/home/applications/HuopaClicker.js");
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaDesktop/Settings.js`, "/home/applications/Settings.js");

                const wallpaper1Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/Wallpapers/Chilly%20Mountain.png`, "/system/env/wallpapers/Chilly Mountain.png");
                const wallpaper2Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/Wallpapers/Peaceful%20Landscape.png`, "/system/env/wallpapers/Peaceful Landscape.png");
                const wallpaper3Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/dharmx/walls/main/anime/a_cartoon_of_a_woman_with_pink_hair.jpg`, "/system/env/wallpapers/AnimeGrill.png");
                

                const logoSuccess = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaLogo.png`, "/system/env/assets/huopalogo.png");
                await internalFS.createPath("/system/env/systemconfig/settings/customization/wallpaperchosen.txt", "file", "/system/env/wallpapers/Chilly Mountain.png")
                if (wallpaper1Success && wallpaper2Success && wallpaper3Success && logoSuccess) {
                    await sys.addLine("Wallpapers and logo fetched and installed!");
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await this.boot();
                }
            } else {
                await sys.addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]");
            }
        },
        
    };
})();