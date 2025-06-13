window.huopadesktop = (() => {
    let killSwitch = false
    let sysTempInfo = {
        "startMenuOpen":false
    }
    const version = "0.6.0";
    // Priv Sys Funcs
    const mainInstaller = async () => {
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
                    bootcmd: "boot",
                    version: version
                };
                await internalFS.createPath("/system/env/config.json", "file", JSON.stringify(bootConfig));
                await sys.addLine("Boot config created!");
                await sys.addLine("Attempting to install example app...")
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaDesktop/Settings.js`, "/home/applications/Settings.js");
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaDesktop/App%20Store.js`, "/home/applications/App Store.js");
                await sys.addLine("[line=blue]Downloading and installing wallpapers...[/line]")
                const wallpaper1Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/Wallpapers/Chilly%20Mountain.png`, "/system/env/wallpapers/Chilly Mountain.png");
                const wallpaper2Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/Wallpapers/Peaceful%20Landscape.png`, "/system/env/wallpapers/Peaceful Landscape.png");
                const wallpaper3Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/Wallpapers/Chaotic%20Creek.png`, "/system/env/wallpapers/Chaotic Creek.png");
                const wallpaper4Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/Wallpapers/Forest%20Landscape.png`, "/system/env/wallpapers/Forest Landscape.png");

                const logoSuccess = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaLogo.png`, "/system/env/assets/huopalogo.png");
                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/wallpaperchosen.txt", "file", "/system/env/wallpapers/Chilly Mountain.png")
                }
                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/bgblur.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/bgblur.txt", "file", "3.5")
                }
                
                if (wallpaper1Success && wallpaper2Success && wallpaper3Success && wallpaper4Success && logoSuccess) {
                    await sys.addLine("Wallpapers and logo fetched and installed!");
                }
                sys.addLine("[line=blue]Installing styles...[/line]")
                const styleDownloadSuccess = await new Promise(async (resolve, reject) => {
                    try {
                        const response = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/HuopaDesktop/_systemStyles.css`);
                        if (response.ok) {
                            const text = await response.text();
                            await internalFS.createPath("/system/env/systemStyles.css", "file", text);
                            resolve(true);
                        } else {
                            console.error("Failed to fetch styles! Response: " + response.status);
                            resolve(false);
                        }
                    } catch (e) {
                        console.error("Error during style download:", e);
                        reject(e);

                    }
                });

                if (styleDownloadSuccess) {  
                    await sys.addLine("Styles fetched and installed!")                
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
                    await new Promise(resolve => setTimeout(resolve, 100));
                    createMainGUI();
                } else {
                    sys.addLine("[line=red]Failed to fetch system styles![/line]")
                }
    }
    const createBugAlertWindow = async (app, errorInfo) => {
        const container = await createAppContainer(`${app}`);
        const titleText = quantum.document.createElement("h2");
        titleText.textContent = `${app} has crashed, more info below:`;
        const infoText = quantum.document.createElement("p");
        infoText.textContent = `${errorInfo}`;
        container.append(titleText);
        container.id = `app-${app}`;
        titleText.style = "color: white; text-align: center; margin: 1em;"
        infoText.style = "color: white; text-align: center; margin: 0.5em;"
        container.append(infoText);
    }

const createRoturLoginWindow = async (app) => {
        return new Promise( async(resolve, reject) => {
            const container = await createAppContainer(`Rotur Login`);
            const titleText = quantum.document.createElement("h1");
            titleText.textContent = `Login to Rotur`;
            const infoText = quantum.document.createElement("p");
            infoText.textContent = `By logging in, you agree to give your Rotur Token to ${app}`;
            container.append(titleText);
            container.id = `app-Rotur Login`;
            titleText.style = "color: white; text-align: center; margin: 1em;"
            infoText.style = "color: white; text-align: center; margin: 0.5em;"
            container.append(infoText);
            const usernameInput = quantum.document.createElement("input");
            const passwordInput = quantum.document.createElement("input");

            usernameInput.placeholder = "Username";
            passwordInput.placeholder = "Password";
            usernameInput.style.display = "block";
            passwordInput.style.display = "block";
            usernameInput.style.margin = "1em auto";
            passwordInput.style.margin = "1em auto";

            const submitButton = quantum.document.createElement("button");
            submitButton.textContent = "Login";
            container.append(usernameInput);
            container.append(passwordInput);
            submitButton.style.margin = "1em auto";
            container.append(submitButton);
            const resultText = quantum.document.createElement("p");
            resultText.style = "color: white; text-align: center; margin: 0.5em;";
            container.append(resultText);
            submitButton.onclick = async () => {
            try {
                const response = await fetch(`https://social.rotur.dev/get_user?username=${usernameInput.value}&password=${CryptoJS.MD5(passwordInput.value).toString()}`);
                const data = await response.json();
                
                if (data.error) {
                    resultText.textContent = "Failed to login to Rotur! Error: " + data.error;
                    return reject(data.error); // reject only, don't throw after
                }

                resultText.textContent = "Logged into Rotur! You may close this window.";
                resolve(data.key);
            } catch (error) {
                resultText.textContent = "Error fetching user data: " + error;
                console.error("Login error:", error);
                reject(error);
            }
        };


        })
        
    }

    const createSysDaemon = async (name, daemonFunc) => {
        consoleo("[SYS]: Running System Daemon: " + name);
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
    function importStylesheet(cssContent, id = null) {
        const linkElement = quantum.document.createElement('link');

        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        const encodedCssContent = encodeURIComponent(cssContent);
        linkElement.href = `data:text/css;charset=utf-8,${encodedCssContent}`;
        if (id) {
            linkElement.id = id;
        }
        quantum.document.head.appendChild(linkElement);

        return linkElement;
    }
    async function importLib(content) {
        const scriptElement = quantum.document.createElement('script');

        scriptElement.src = content

        quantum.document.head.appendChild(scriptElement);

        return scriptElement;
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
                const localEventHandlers = {};
                window.onerror = function (message, source, lineno, colno, error) {
                    window.parent.postMessage({
                        type: "iframeError",
                        message, appName
                    }, "*");
                };

                window.addEventListener("message", (event) => {
                    const data = event.data;
                    if (data?.type === "click" && data?.elementId) {
                        const handler = localEventHandlers[data.elementId];
                        if (handler) handler();
                    } else if (data?.type === "input" && data?.elementId) {
                        const handler = localEventHandlers[data.elementId];
                        if (handler) handler();
                    }
                });

                const huopaAPI = (() => {
                    let msgId = 0;
                    const callbacks = new Map();

                    // Listen for API responses and for forwarded events
                    window.addEventListener("message", (event) => {
                        const { type, id, result, error, event: evt, elementId } = event.data || {};

                        // Response to our RPC
                        if (type === "apiResponse" && callbacks.has(id)) {
                        const { resolve, reject } = callbacks.get(id);
                        callbacks.delete(id);
                        return error ? reject(new Error(error)) : resolve(result);
                        }

                        // Forwarded DOM event
                        if (type === "event" && localEventHandlers[elementId]) {
                        return localEventHandlers[elementId]();
                        }
                    });

                    return new Proxy({}, {
                        get(_, prop) {
                            if (prop === "setAttribute") {
                                return async (elementId, attrName, handler) => {
                                    const customAttrList = ["onclick", "oninput"];
                                    if (customAttrList.includes(attrName)) {
                                        localEventHandlers[elementId] = handler;
                                        return new Promise((resolve, reject) => {
                                            const id = "msg_" + msgId++;
                                            callbacks.set(id, { resolve, reject });
                                            try {
                                                window.parent.postMessage({
                                                    type: "bindEventForward",
                                                    data: [elementId, attrName],
                                                    id,
                                                    appName,
                                                }, "*");
                                            } catch (e) {
                                                window.parent.postMessage({
                                                    type: "iframeError",
                                                    message: e?.message || "Unknown error",
                                                    stack: e?.stack || null,
                                                    name: e?.name || "Error",
                                                    appName
                                                }, "*");   
                                                return;
                                            }
                                        });
                                    } else {
                                        return new Promise((resolve, reject) => {
                                            const id = "msg_" + msgId++;
                                            callbacks.set(id, { resolve, reject });
                                            try {
                                                window.parent.postMessage({
                                                    type: prop,
                                                    data: [elementId, attrName, handler],
                                                    id,
                                                    appName
                                                }, "*");
                                            } catch (e) {
                                                window.parent.postMessage({
                                                    type: "iframeError",
                                                    message: e?.message || "Unknown error",
                                                    stack: e?.stack || null,
                                                    name: e?.name || "Error",
                                                    appName
                                                }, "*");
                                                return;
                                            }
                                        });
                                    }
                                };
                            }

                            // Other methods
                            return (...args) => {
                                return new Promise((resolve, reject) => {
                                    const id = "msg_" + msgId++;
                                    callbacks.set(id, { resolve, reject });
                                    try {
                                        window.parent.postMessage({ type: prop, data: args, id, appName }, "*");
                                    } catch (e) {
                                        window.parent.postMessage({
                                            type: "iframeError",
                                            message: e?.message || "Unknown error",
                                            stack: e?.stack || null,
                                            name: e?.name || "Error",
                                            appName
                                        }, "*");   
                                        return;
                                    }
                                });
                            };
                        }
                    });

                })();


                (async () => {
                    try {
                        async function setAttrs(element, attrs) {
                            for (const [key, value] of Object.entries(attrs)) {
                                await huopaAPI.setAttribute(element, key, value);
                            }
                        }
                        ${safeAppCode}
                    } catch (e) {
                        try {
                            huopaAPI.error?.("Runtime Error: " + e.message);
                        } catch (logErr) {
                            window.parent.postMessage({
                                type: "iframeError",
                                message: e?.message || "Unknown error in app",
                                stack: e?.stack,
                                appName
                            }, "*");
                        }
                        
                    }
                })();
            </script>
        `;
        try {
            iframe.srcdoc = iframeHTML;

            await new Promise(r => setTimeout(r, 0));

            return iframe;
        } catch (error) {
            console.error("[APP ERROR]: " + error.message);
            createBugAlertWindow(appId, error.message);
        }
        
    };



    const huopaAPI = new Proxy({}, {
        get(target, prop, appName) {
            return (...args) => {
            if (typeof huopaAPIHandlers[prop] === "function") {
                huopaAPIHandlers[prop](...args);
            } else {
                console.warn(`No handler for huopaAPI method '${prop}'`);
                createBugAlertWindow(appName, `Error: No handler for huopaAPI method ${prop}`);
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
                    createBugAlertWindow(appId, err.message);
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
                        createBugAlertWindow(appId, `Error: No handler for huopaAPI method ${prop}`);
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

            setTimeout,

            clearTimeout,

            fetch: async (url) => {
                const response = await window.fetch(url);
                const contentType = response.headers.get("content-type");
                const body = contentType?.includes("application/json")
                    ? await response.json()
                    : await response.text();

                return {
                    ok: response.ok,
                    status: response.status,
                    contentType,
                    body,
                };
            },

            getWindowSize: function() {
                return {
                    width: appContainer.clientWidth,
                    height: appContainer.clientHeight,
                };
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
                if (path.startsWith("/system/env/appconfig")) {
                    console.warn("[huopaAPI SAFETY]: App tried reading in safeStorage using default read command!")
                }
                return internalFS.getFile(path, permissions);
            },

            deleteFile: function(path, permissions) {
                if (path.startsWith("/system/env/appconfig")) {
                    console.warn("[huopaAPI SAFETY]: App tried deleting file in safeStorage using default delete command!")
                }
                return internalFS.delDir(path, permissions);
            },

            writeFile: function(path, type, content, permissions = {
                "read":"",
                "write":"",
                "modify":"",
            }) {
                if (path.startsWith("/system/env/appconfig")) {
                    console.warn("[huopaAPI SAFETY]: App tried writing in safeStorage using default write command!")
                }
                return internalFS.createPath(path, type, content, permissions);
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
            },
            compressImage: async (dataURL, width, height, quality) => {
                function dataURLtoBlob(dataurl) {
                    const arr = dataurl.split(',');
                    const mimeMatch = arr[0].match(/:(.*?);/);
                    const mime = mimeMatch ? mimeMatch[1] : '';
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new Blob([u8arr], {type:mime});
                }

                const blob = dataURLtoBlob(dataURL);
                
                const bitmap = await createImageBitmap(blob);
                
                const canvas = quantum.document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(bitmap, 0, 0, width, height);
                
                return canvas.toDataURL('image/jpeg', quality);
            },

            setAttribute: async(id, type, content) => {
                const el = elementRegistry[id];
                if (!el) return;

                if (type === "onclick") {
                    setOnClick(id);
                    return;
                } else {
                    try {
                    el[type] = content;
                    } catch (e) {
                        console.error("[huopaAPI RUN ERROR] Error with setting attribute: " + type);
                        console.error("Error: " + e);
                    }
                }
            },

            getAttribute: async(id, type) => {
                const el = elementRegistry[id];
                if (!el) return;
                try {
                    return el[type];
                } catch (error) {
                    console.error("[huopaAPI RUN ERROR] Error with getting attribute: " + type);
                    console.error("Error: " + e);
                }
            },

            openRoturLogin: async(appId) => {
                return await createRoturLoginWindow(appId);
            },

            prependToApp: async(id) => {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`prependToApp: No element with ID ${id}`)
                }
                appContainer.insertBefore(el, appContainer.firstChild);
            },

            prepend: async(parentId, id) => {
                const el = elementRegistry[id];
                const parent = elementRegistry[parentId];
                if (!el) {
                    console.warn(`prepend: No element with ID ${id}`);
                }
                if (!parent) {
                    console.warn(`prepend: No element with ID ${parentId}`);
                }
                parent.insertBefore(el, parent.firstChild);
            },

            safeStorageWrite: async(data, appId) => {
                if (!appId) { console.warn("No app ID inputted for SafeStorageWrite. Call cancelled."); return;}
                await internalFS.createPath("/system/env/appconfig/"+ appId + "/" + data[0], data[1], data[2], `"${appId}"`);
            },

            safeStorageRead: async(path, appId) => {
                if (!appId) { console.warn("No app ID inputted for SafeStorageRead. Call cancelled."); return;}
                return await internalFS.getFile("/system/env/appconfig/"+ appId + "/" + path);
            }





        };

    };


    window.addEventListener("message", async (event) => {
        if (killSwitch) return;
        const { type, data, id, appId} = event.data || {};
        if (event.data?.type === "iframeError") {
            console.error("[APP ERROR]:", event.data);
            createBugAlertWindow(event.data.appName, event.data.message);
            return;
        }
        if (type && type === "bindEventForward") {
            const elementId = data[0];
            const attrName = data[1];
            const el = elementRegistry[elementId];
            if (el) {
                if (attrName === "onclick") {
                    const clickHandler = () => {
                        event.source.postMessage({ type: "click", elementId }, "*");
                    };
                    el.addEventListener("click", clickHandler);
                } else if (attrName === "oninput"){
                    const inputHandler = () => {
                        event.source.postMessage({ type: "input", elementId }, "*");
                    };
                    el.addEventListener("input", inputHandler);
                }
                

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
            createBugAlertWindow(appId, `Error: No handler for huopaAPI method ${prop}`);
            return;
        }

        try {
            let result;
            if (type === "openRoturLogin") {
                result = await huopaAPI[type]([event.data.appName]);
            } else if (type === "safeStorageWrite") {  

                result = await huopaAPI[type]((Array.isArray(data) ? data : [data].splice(3)), event.data.appName);

            } else if (type === "safeStorageRead"){

                result = await huopaAPI[type](Array.isArray(data) ? data : data[0], event.data.appName);

            } else {
                result = await huopaAPI[type](...(Array.isArray(data) ? data : [data]));
            }
            
            if (id) {
                event.source?.postMessage({ type: "apiResponse", id, result }, "*");
            }
        } catch (err) {
            if (id) {
                event.source?.postMessage({ type: "apiResponse", id, error: err.message }, "*");
            } else {
                createBugAlertWindow(appId, err.message);
                console.error("[APP ERROR] " + err.message);
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
            isDragging = false;
            quantum.document.removeEventListener("mousemove", onMouseMove);
            quantum.document.removeEventListener("mouseup", onMouseUp);
        }
    }

    const createAppContainer = async (appId) => {
        const outerContainer = quantum.document.createElement("div");
        const winSpawnX = window.innerWidth / 2;
        const blur = await internalFS.getFile("/system/env/systemconfig/settings/customization/bgblur.txt");
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
            backdrop-filter: blur(${blur}px);
        `;
        const titleBar = quantum.document.createElement("div");
        titleBar.style = `
            height: 22px;
            width: 100%;
            background: rgba(0, 0, 0, 0);
            z-index: ${appZIndex + 1};
            padding-bottom: 12px;
        `;
        const appTitle = quantum.document.createElement("h3");
        appTitle.textContent = appId.replace(/\.js$/, "");;
        appTitle.style = "font-family: sans-serif; margin: 0.5em;"
        titleBar.className = "titlebar";
        const container = quantum.document.createElement("div");
        container.className = "app-container";
        container.style = `width: 100%; height: calc(100% - 33px); overflow: auto; position: relative;`;
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
            top: -3.33px;
        `;
        closeButton.addEventListener("click", () => {
            const codeElem = quantum.document.getElementById(`code-${appId}`);
            if (codeElem) {
                codeElem.remove();
            }
            
            outerContainer.remove();
        });
        const topBarSplitter = quantum.document.createElement("div");
        topBarSplitter.style = "width: 100%; height: 2px; background-color:rgba(128, 128, 128, 0.5); position: fixed; left: 0; top: 41px;"
        container.id = `app-${appId}`;
        quantum.document.getElementById("desktop").appendChild(outerContainer);
        titleBar.append(appTitle);
        titleBar.appendChild(closeButton);
        outerContainer.append(titleBar);
        container.append(topBarSplitter);
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
                    background: rgba(30, 30, 30, 0.65);
                    position: absolute;
                    border-radius: 1em;
                    border: 2.5px;
                    border-style: solid;
                    border-color: #99999989;
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
            const blur = await internalFS.getFile("/system/env/systemconfig/settings/customization/bgblur.txt");
            startMenuDiv.style.display = "block";
            startMenuDiv.style.backdropFilter = `blur(${blur}px)`;
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
            importLib("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");
            const mainDiv = quantum.document.getElementById("termDiv");
            mainDiv.innerHTML = "";
            const desktop = quantum.document.createElement("div");
            importStylesheet(await internalFS.getFile("/system/env/systemStyles.css"));
            const dock = quantum.document.createElement("div");
            const wallpaperChosen = await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt");
            const imageData = await internalFS.getFile(wallpaperChosen);
            quantum.document.body.style.margin = "0";
            desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center; font-family: sans-serif; opacity: 0; transition: 0.2s;`;
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
                        desktop.style.opacity = "0";
                        setTimeout(async () => {
                        const imageData = await internalFS.getFile(wallpaperChosen);
                        desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center; font-family: sans-serif; transition: 0.2s; opacity: 0;`;
                        setTimeout(async () => {
                            desktop.style.opacity = "1";
                        }, 250)
                        }, 200)

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
                requestAnimationFrame(() => {
                    desktop.style.opacity = "1";
                });
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
            const blur = await internalFS.getFile("/system/env/systemconfig/settings/customization/bgblur.txt");
            dock.style = `position: absolute; bottom: 20px; width: 96%; height: 4em; background: rgba(30, 30, 30, 0.65); border-radius: 1em; left: 50%; transform: translateX(-50%); display: flex; align-items: center; border: 2.5px; border: 2.5px; border-style: solid; border-color: #99999989; z-index: 15000; backdrop-filter: blur(${blur}px);`;

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

            requestAnimationFrame(() => {
                desktop.style.opacity = "1";
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
            if (!bootConfig.version || bootConfig.version !== version) {
                await sys.addLine("## You are in an outdated version of HuopaDesktop, updating...");
                mainInstaller();
                return;
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
            await new Promise(resolve => setTimeout(resolve, 100));

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
                await mainInstaller()
            } else {
                await sys.addLine("[line=red]HuopaDesktop installation has been cancelled.[/line]");
            }
        },
        
    };
})();