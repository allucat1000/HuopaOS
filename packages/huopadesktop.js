// Icons from https://lucide.dev and https://fluenticons.co/outlined

/* Lucide License:

ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.


THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

FluentIcons License:

MIT License

Copyright (c) 2020 Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

window.huopadesktop = (() => {
    let killSwitch = false
    let sysTempInfo = {
        "startMenuOpen":false
    }
    const version = "1.0.0";
    // Priv Sys Funcs
    const dataURIToBlob = async (dataURI) => {
        const [meta, base64Data] = dataURI.split(',');

        const mimeMatch = meta.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

        const binary = atob(base64Data);

        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }

        return new Blob([array], { type: mime });
    }
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
                await sys.addLine("Installing system apps...");
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Settings.js`, "/home/applications/Settings.js");
                if (!await internalFS.getFile("/home/applications/Settings.js.icon")) {
                    await internalFS.createPath("/home/applications/Settings.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`);
                }
                
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/App%20Store.js`, "/home/applications/App Store.js");
                if (!await internalFS.getFile("/home/applications/App Store.js.icon")) {
                    await internalFS.createPath("/home/applications/App Store.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`);
                }
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/File%20Manager.js`, "/home/applications/File Manager.js");
                if (!await internalFS.getFile("/home/applications/File Manager.js.icon")) {
                    await internalFS.createPath("/home/applications/File Manager.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-closed-icon lucide-folder-closed"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>`);
                }
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Preview.js`, "/home/applications/Preview.js");
                if (!await internalFS.getFile("/home/applications/Preview.js.icon")) {
                    await internalFS.createPath("/home/applications/Preview.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-icon lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`);
                }
                if (await internalFS.getFile("/home/applications/Text Editor.js")) {
                    await internalFS.delDir("/home/applications/Text Editor.js");
                    await internalFS.delDir("/home/applications/Text Editor.js.icon");
                }
                await sys.addLine("Installing app modules...");
                /* const response = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/huopaAPIModules/rwl.js`);
                if (response.ok) {
                    const data = await response.text();
                    await internalFS.createPath("/system/env/modules/rwl.js", "file", data);
                }
                
                const response2 = await fetch("https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/moduleSrc/rwlSrc.js");
                // RWL is mainly made by Flufi (GH: @ThePandaDever).
                // Integrated into HuopaOS by me, Allucat1000.
                if (response2.ok) {
                    const data = await response2.text();
                    await internalFS.createPath("/system/env/moduleSrc/rwlSrc.js", "file", data);
                }
                */
                const response3 = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/huopaAPIModules/originchats.js`);
                if (response3.ok) {
                    const data = await response3.text();
                    await internalFS.createPath("/system/env/modules/originchats.js", "file", data);
                }
                await sys.addLine("[line=blue]Downloading and installing wallpapers...[/line]")
                let wallpaper1Success;
                let wallpaper2Success;
                let wallpaper3Success;
                let wallpaper4Success;
                if (!await internalFS.getFile("/system/env/wallpapers/Chilly Mountain.png")) {
                    wallpaper1Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/Wallpapers/Chilly%20Mountain.png`, "/system/env/wallpapers/Chilly Mountain.png");
                }
                if (!await internalFS.getFile("/system/env/wallpapers/Peaceful Landscape.png")) {
                    wallpaper2Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/Wallpapers/Peaceful%20Landscape.png`, "/system/env/wallpapers/Peaceful Landscape.png");
                }
                if (!await internalFS.getFile("/system/env/wallpapers/Chaotic Creek.png")) {
                    wallpaper3Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/Wallpapers/Chaotic%20Creek.png`, "/system/env/wallpapers/Chaotic Creek.png");
                }
                if (!await internalFS.getFile("/system/env/wallpapers/Forest Landscape.png")) {
                    wallpaper4Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/Wallpapers/Forest%20Landscape.png`, "/system/env/wallpapers/Forest Landscape.png");
                }
                
                const logoSuccess = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaLogo.png`, "/system/env/assets/huopalogo.png");
                if (wallpaper1Success && wallpaper2Success && wallpaper3Success && wallpaper4Success && logoSuccess) {
                    await sys.addLine("Wallpapers and logo fetched and installed!");
                }
                sys.addLine("[line=blue]Installing styles...[/line]");

                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/wallpaperchosen.txt", "file", "/system/env/wallpapers/Chilly Mountain.png")
                }
                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/bgblur.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/bgblur.txt", "file", "3.5")
                }

                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/bgopac.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/bgopac.txt", "file", "0.90")
                }

                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/windowbordercolor.txt", "file", "#808080")
                }
                
                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/dockedTaskbar.txt", "file", false)
                }
                const skipStyles = await internalFS.getFile("/system/env/noStyleUpdate.txt");
                if (!skipStyles) {
                    await internalFS.createPath("/system/env/noStyleUpdate.txt", "file", "false");
                }
                let styleDownloadSuccess
                if (!skipStyles || skipStyles !== "true" ) {
                    styleDownloadSuccess = await new Promise(async (resolve, reject) => {
                        try {
                            const response = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/_systemStyles.css`);
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
                }
                

                if (styleDownloadSuccess || skipStyles === "true") {  
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
                    await importLib("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");
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
            passwordInput.type = "password"
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
                    return reject(data.error);
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
        console.log("[SYS]: Running System Daemon: " + name);
        daemonFunc();
    }
    const induceCrash = async (error) => {
        const mainDiv = quantum.document.getElementById("termDiv");
            mainDiv.innerHTML = ""
            await sys.addLine("--/!\\--")
            await sys.addLine("An unhandled exeption has occurred in HuopaDesktop and the system has been forced to halt.");
            await sys.addLine(`Error: ${error}`);
            await sys.addLine("Try updating your packages (such as HuopaDesktop) using the command: \"hpkg update\".");
            await sys.addLine("If you still have issues, check if you have any custom scripts for HuopaDesktop. If you do, try booting HuopaDesktop without the scripts.");
            await sys.addLine("If you don't have any custom scripts or the issue is still occurring, please report this issue to me (for example through the HuopaOS Github).");
            await sys.addLine("Reboot the system to load into HuopaDesktop or the terminal (hold down \"C\" to load into the terminal).");
            const errorTitle = quantum.document.createElement("h1");
            errorTitle.textContent = "/!\\";
            mainDiv.append(errorTitle);
            const errorInfo = quantum.document.createElement("h2");
            errorInfo.textContent = "An unhandled exeption has occurred in HuopaDesktop and the system has been forced to halt. For more info, check the DevTools console.";
            mainDiv.append(errorInfo);
    }
    function importStylesheet(content, dataURL = false) {
        const linkElement = quantum.document.createElement('link');
        linkElement.rel = 'stylesheet';
        if (!dataURL) {
            linkElement.href = content;
        } else {
            linkElement.type = 'text/css';
            const encodedContent = encodeURIComponent(content);
            linkElement.href = `data:text/css;charset=utf-8,${encodedContent}`;
        }
        
        

        quantum.document.head.appendChild(linkElement);

        return linkElement;
    }
    async function importLib(content) {
        return new Promise((resolve, reject) => {
        const scriptElement = quantum.document.createElement('script');

        scriptElement.src = content
        scriptElement.onload = () => resolve();
        scriptElement.onerror = () => reject(new Error("Failed to load library!"));
        quantum.document.head.appendChild(scriptElement);

        });
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

    const runAppSecure = async (appCode, appId, startParams, container) => {
        if (killSwitch) return null;

        const iframe = quantum.document.createElement('iframe');
        iframe.id = `code-${appId}`;
        const digits = container.parentElement.id;  
        iframe.dataset.digitId = digits;
        iframe.sandbox = "allow-scripts";
        iframe.style.display = "none";
        quantum.document.body.appendChild(iframe);
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
                        if (handler) handler()
                    } else if (data?.type === "input" && data?.elementId) {
                        const handler = localEventHandlers[data.elementId];
                        if (handler) handler();
                    } else if (data?.type === "eventListener" && data?.elementId) {
                        const elId = data.elementId;
                        const listenerName = data.listener;
                        const id = elId + listenerName;
                        const handler = localEventHandlers[id];
                        if (handler) {
                            handler();
                        }
                    } else if (data?.type === "keypress" && data?.elementId) {
                        const key = data.key;
                        const handler = localEventHandlers[data.elementId];
                        if (typeof handler === "function") {
                            handler(key);
                        } else {
                            console.warn("Handler not found or not a function for:", data.elementId);
                        }
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
                                    const customAttrList = ["onclick", "oninput", "onkeypress"];
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
                            } else if (prop === "addEventListener") {
                                return async (elementId, listenerName, handler) => {
                                    localEventHandlers[elementId + listenerName] = handler;
                                    return new Promise((resolve, reject) => {
                                        const id = "msg_" + msgId++;
                                        callbacks.set(id, { resolve, reject });
                                        try {
                                            window.parent.postMessage({
                                                type: "bindEventForward",
                                                data: [elementId, listenerName],
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
                                }
                            
                            
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
                        async function importModule(moduleName) {
                            const moduleCode = await huopaAPI.getFile("/system/env/modules/" + moduleName.toLowerCase() + ".js");
                            const module = eval("(() => { " + moduleCode + " })()");
                            return module;
                        }
                        const loadParams = ${JSON.stringify(startParams)};
                        await eval("(async () => {" + ${JSON.stringify(appCode)} + "})()");
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

    const runApp = async (appId, appCodeString, appPath, startData) => {
        if (killSwitch) return;

        const container = await createAppContainer(appId, appPath);
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


        const iframe = await runAppSecure(appCodeString, appId, startData, container);

        if (iframe && iframe.contentWindow) {
            huopaAPIMap.set(iframe.contentWindow, huopaAPI);
        } else {
            console.error("runAppSecure failed to create iframe or contentWindow");
        }
    };
    const elementRegistry = {}
    const idRegistry = {};
    let elementIdCounter = 0;
    let _returnCallbacks;
    const runAppWithReturn = async function(path, param) {
        if (!path || typeof path !== "string") {
            throw new Error("runAppWithReturn: invalid path");
        }
        let digits = "";
        for (let i = 0; i < 10; i++) {
        digits += Math.floor(Math.random() * 10);
        }
        const uid = digits;
        _returnCallbacks ??= {};
        
        _returnCallbacks[uid] = "";

        const params = { mode: param, returnId: uid };
        const code = await internalFS.getFile(path);
        const normalized = path.replace(/\/+$/, "");
        const last = normalized.split("/").pop();
        if (!last) throw new Error(`runAppWithReturn: '${path}' yielded empty filename`);

        const lastSegment = last.replace(/\.js$/, "");
        await runApp(lastSegment, code, path, params);
        await waitUntil(() => _returnCallbacks[uid]);
        const data = _returnCallbacks[uid];
        delete _returnCallbacks[uid];
        return data
    };

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
                idRegistry[id] = id;
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
                const returnData = idRegistry[id];
                return returnData;
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
                console.warn(`[APP WARN]: ${msg}`);
            },

            container: appContainer,

            Math,

            Date,

            setTimeout,

            clearTimeout,

            fetch: async (url, headers = {}, method = "GET") => {
                const response = await window.fetch(url, {
                    method,
                    headers
                });

                const contentType = response.headers.get("content-type") || "";
                const body = contentType.includes("application/json")
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

            setOnKeyPress: function(id) {
                const el = elementRegistry[id];
                if (!el) return;

                el.addEventListener("keydown", () => {
                    sandboxWindow.postMessage({
                        type: "event",
                        event: "keypress",
                        elementId: id
                    }, "*");
                });
            },

            setOnInput: function(id) {
                const el = elementRegistry[id];
                if (!el) return;

                el.addEventListener("input", () => {
                    sandboxWindow.postMessage({
                        type: "event",
                        event: "input",
                        elementId: id
                    }, "*");
                });
            },

            getFile: function(path, permissions) {
                if (path.startsWith("/system/env/appconfig")) {
                    console.warn("[huopaAPI SAFETY]: App tried reading in safeStorage using default read command!");
                    return "[HuopaDesktop FS Security]: No permissions";
                }
                return internalFS.getFile(path, permissions);
            },

            deleteFile: function(path, recursive = true, permissions) {
                if (path.startsWith("/system/env/appconfig")) {
                    console.warn("[huopaAPI SAFETY]: App tried deleting file in safeStorage using default delete command!");
                    return "[HuopaDesktop FS Security]: No permissions";
                }
                return internalFS.delDir(path, permissions, recursive);
            },

            writeFile: function(path, type, content, permissions = {
                "read":"",
                "write":"",
                "modify":"",
            }) {
                if (path.startsWith("/system/env/appconfig")) {
                    console.warn("[huopaAPI SAFETY]: App tried writing in safeStorage using default write command!");
                    return "[HuopaDesktop FS Security]: No permissions";
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

            getCertainStyle: function(id, styleName) {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`getCertainStyle: Element with ID: '${id}' not found.`);
                    return;
                }
                return el.style[styleName]
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
                if (el.tagName.toLowerCase() === "iframe" && type.toLowerCase() === "src") {
                    if (typeof content !== String) {
                        console.warn("[huopaAPI SAFETY] Invalid content type.");
                        return;
                    }

                    // Currently for safety reasons, only http(s) content is allowed in iFrames

                    if (content.startsWith("http://") || content.startsWith("https://")) {
                        el.src = content;
                        return;
                    } else {
                        console.warn("[huopaAPI SAFETY] Currently only http(s) content is allowed to be rendered in an iFrame");
                        return;
                    }
                }
                if (type === "onclick") {
                    setOnClick(id);
                    return;
                } else if (type === "oninput") {
                    setOnInput(id);
                    return;
                } else if (type.toLowerCase() === "innerhtml") {
                    try {
                        el[type] = DOMPurify.sanitize(content);
                    } catch (e) {
                        console.error("[huopaAPI RUN ERROR] Error with setting innerHTML");
                        console.error("Error: " + e);
                    }
                } else {
                    try {
                        if (type === "id") {
                            idRegistry[content] = id;
                        }
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
                    console.error("Error: " + error);
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
                await internalFS.createPath("/system/env/appconfig/"+ appId.replace(".js", "") + "/" + data[0], data[1], data[2], `"${appId}"`);
            },

            safeStorageRead: async(path, appId) => {
                if (!appId) { console.warn("No app ID inputted for SafeStorageRead. Call cancelled."); return;}
                return await internalFS.getFile("/system/env/appconfig/"+ appId.replace(".js", "") + "/" + path);
            },

            runApp: async(path, startParams) => {
                if (!path || !path.endsWith(".js")) {
                    if (!path) {
                        console.warn("No path given for app execution. Request cancelled.");
                        return;
                    } else {
                        console.warn("File not correct type or is directory. Request cancelled.");
                        return;
                    }
                }
                const appName = path.split("/").pop().slice(0, -3);
                const code = await internalFS.getFile(path);
                await runApp(appName, code, path, startParams);
            },

            addClass: async(id, className) => {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`addClass: No element with ID ${id}`);
                    return;
                }
                try {
                    el.classList.add(className);
                } catch (error) {
                    console.error("[huopaAPI RUN ERROR] Error with adding class: " + error);
                }
                
            },

            removeClass: async(id, className) => {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`removeClass: No element with ID ${id}`);
                    return;
                }
                try {
                    el.classList.remove(className);
                } catch (error) {
                    console.error("[huopaAPI RUN ERROR] Error with removing class: " + error);
                }
            },

            getChildren: async (id) => {
                const parent = elementRegistry[id];
                if (!parent) {
                    console.warn(`getChildren: No element with ID ${id}`);
                    return [];
                }

                const children = Object.entries(elementRegistry)
                    .filter(([_, el]) => el.parentElement === parent)
                    .map(([childId, _]) => childId);

                return children;
            },

            openFileDialog: async (options = {}, appName) => {
                    try {
                        const data = await runAppWithReturn("/home/applications/File Manager.js", "fileSelector");
                        return data;
                    } catch (e) {
                        throw new Error(e);
                    }

            },

            returnToHost: (returnId, data) => {
                if (_returnCallbacks) {
                    _returnCallbacks[returnId] = (data);
                }
            },

            closeApp: () => {
                const digitId = appContainer.parentElement.id;
                const codeElem = quantum.document.querySelector(`[data-digit-id="${digitId}"]`);
                if (codeElem) {
                    codeElem.remove();
                }
                appContainer.parentElement.remove();
                const appToDock = quantum.document.querySelector(`[data-dock-digit-id="${digitId}"]`);
                if (appToDock) {
                    appToDock.remove();
                }
            },

            setTitle: (content) => {
                const digitId = appContainer.parentElement.id;
                const title = quantum.document.querySelector(`[data-title-digit-id="${digitId}"]`);
                title.textContent = content;
            },

            playAudio: (url) => {
                if (typeof url !== "string") throw new Error("Content must be a string!");
                const appId = appContainer.parentElement.id;
                const existing = quantum.document.querySelector(`audio[data-app-id="${appId}"]`);
                if (existing) {
                    existing.src = url;
                    existing.play();
                    return;
                }

                const audio = quantum.document.createElement("audio");
                audio.src = url;
                audio.controls = true;
                audio.autoplay = true;
                audio.dataset.appId = appId;
                audio.display = "none";
                audio.style.zIndex = "9999";
                appContainer.appendChild(audio);

                return;
            },

            stopAudio: () => {
                const appId = appContainer.parentElement.id;
                const audio = quantum.document.querySelector(`audio[data-app-id="${appId}"]`);
                if (!audio) {
                    console.warn("stopAudio: No audio element found!");
                    return
                }
                audio.remove();
            },

            getRenderedSize: (id, type) => {
                const el = elementRegistry[id];
                if (!el) {
                    console.warn(`getRenderedSize: Element with ID: '${id}' not found.`);
                    return;
                }
                if (type === "height" || type === "width" || type === "top") {
                    return new Promise(resolve => {
                        requestAnimationFrame(() => {
                            const size = el.getBoundingClientRect()[type];
                            resolve(size);
                        });
                    });
                } else {
                    console.warn(`getRenderedSize: Invalid type '${type}'`);
                    return;
                }
                            
                
            },

            hideWindow: () => {
                appContainer.parentElement.style.display = "none";
            },

            showWindow: () => {
                appContainer.parentElement.style.display = "block";
            },
            
            createNotification: async (title, content) => {
                const notifEl = quantum.document.createElement("div");
                notifEl.style = "border-radius: 0.5em; background-color: rgba(35, 35, 35, 0.65); border-style: solid; border-color: rgba(65, 65, 65, 0.85); width: 20em; position: absolute; top: 0.5em; right: -22em; transition: right ease 1s;";
                const titleEl = quantum.document.createElement("h3");
                const descEl = quantum.document.createElement("p");
                titleEl.style = "color: white; padding: 0.75em; margin: 0;";
                titleEl.textContent = title;
                descEl.style = "color: white; padding: 0 0.75em; padding-bottom: 0.75em;";
                descEl.textContent = content;
                const desktop = quantum.document.getElementById("desktop");
                await notifEl.append(titleEl, descEl);
                await desktop.append(notifEl);
                requestAnimationFrame(() => {
                    notifEl.style.right = "0.5em";
                })
                await new Promise(resolve => setTimeout(resolve, 2000));
                notifEl.style.right = "-22em";
                await new Promise(resolve => setTimeout(resolve, 1500));
                await notifEl.remove();
                
            },
 
            addEventListener: async(id, type) => {
                const el = elementRegistry[id];
                if (!el) return;

                el.addEventListener(type, () => {
                    sandboxWindow.postMessage({
                        type: "event",
                        event: "eventListener",
                        listener: type,
                        elementId: id
                    }, "*");
                });
            },

            removeEventListener: async(id, type) => {
                const el = elementRegistry[id];
                if (!el) return;
                el.removeEventListener(type);
            },

            calculate: (expression, scope = {}) => {
                const result = math.evaluate(expression, scope);
                return result;
            }
        };

    };


    window.addEventListener("message", async (event) => {
        if (killSwitch) return;
        if (!event.source || !huopaAPIMap.has(event.source)) {
            return;
        }
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
                } else if (attrName === "onkeypress") {
                    const keyHandler = (e) => {
                        event.source.postMessage({ type: "keypress", elementId, key: e.key}, "*");
                    };
                    el.addEventListener("keydown", keyHandler);
                } else {
                    const eventHandler = () => {
                        event.source.postMessage({ type: "eventListener", listener: attrName, elementId }, "*");
                    };
                    el.addEventListener(attrName, eventHandler);
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
        createBugAlertWindow(appId, `Error: No handler for huopaAPI method ${type}`);
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
    const createDraggableWindow = (windowEl, dragHandleSelector = ".titlebar") => {
        windowEl.style.position = "absolute";
        
        const dragHandle = windowEl.querySelector(dragHandleSelector);
        if (!dragHandle) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        dragHandle.style.cursor = "grab";
        dragHandle.addEventListener("mousedown", (e) => {
            windowEl.focus();
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
    const minWidth = 375;
    const minHeight = 42;
    const onResizeStart = (e) => {
        e.preventDefault();
        const dir = e.target.dataset.direction;
        const win = e.target.parentElement;
        const startX = e.clientX;
        const startY = e.clientY;
        const startRect = win.getBoundingClientRect();

        function onMouseMove(ev) {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            let newWidth = startRect.width;
            let newHeight = startRect.height;
            let newLeft = startRect.left;
            let newTop = startRect.top;

            if (dir.includes("right")) {
                newWidth = Math.max(minWidth, startRect.width + dx);
            }

            if (dir.includes("bottom")) {
                newHeight = Math.max(minHeight, startRect.height + dy);
            }

            if (dir.includes("left")) {
                const proposedWidth = startRect.width - dx;
                if (proposedWidth >= minWidth) {
                    newWidth = proposedWidth;
                    newLeft = startRect.left + dx;
                } else {
                    newWidth = minWidth;
                    newLeft = startRect.left + (startRect.width - minWidth);
                }
            }

            if (dir.includes("top")) {
                const proposedHeight = startRect.height - dy;
                if (proposedHeight >= minHeight) {
                    newHeight = proposedHeight;
                    newTop = startRect.top + dy;
                } else {
                    newHeight = minHeight;
                    newTop = startRect.top + (startRect.height - minHeight);
                }
            }

            win.style.width = `${newWidth}px`;
            win.style.height = `${newHeight}px`;
            win.style.left = `${newLeft}px`;
            win.style.top = `${newTop}px`;
        }



        function onMouseUp() {
            quantum.document.removeEventListener("mousemove", onMouseMove);
            quantum.document.removeEventListener("mouseup", onMouseUp);
        }

        quantum.document.addEventListener("mousemove", onMouseMove);
        quantum.document.addEventListener("mouseup", onMouseUp);
    }

    const createAppContainer = async (appId, appPath) => {
        const outerContainer = quantum.document.createElement("div");
        const winSpawnX = window.innerWidth / 2;
        const blur = await internalFS.getFile("/system/env/systemconfig/settings/customization/bgblur.txt");
        const opacity = await internalFS.getFile("/system/env/systemconfig/settings/customization/bgopac.txt");
        outerContainer.classList.add("appContainer");
        outerContainer.style.left = `${winSpawnX}px`;
        outerContainer.style.display = "none";
        appZIndex = appZIndex + 10;
        outerContainer.style.zIndex = appZIndex;
        outerContainer.style.outlineStyle = "none";
        quantum.document.getElementById("desktop").appendChild(outerContainer);
        const computed = getComputedStyle(outerContainer);
        const baseColor = computed.backgroundColor;
        const rgbaMatch = baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbaMatch) {
            const [_, r, g, b] = rgbaMatch;
            outerContainer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        await createSysDaemon("appContBordUpdater", () => {
            const loop = async () => {
                const borderColor = await internalFS.getFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt");
                outerContainer.style.borderColor = borderColor;
                setTimeout(loop, 200);
            }
            loop()
            
        })

        outerContainer.style.backdropFilter = `blur(${blur}px)`;

        const resizers = [
            { dir: 'top',    cursor: 'ns-resize',   style: { top: '-2px', left: '0', width: '100%', height: '5px' }},
            { dir: 'right',  cursor: 'ew-resize',   style: { top: '0', right: '-2px', width: '5px', height: '100%' }},
            { dir: 'bottom', cursor: 'ns-resize',   style: { bottom: '-2px', left: '0', width: '100%', height: '5px' }},
            { dir: 'left',   cursor: 'ew-resize',   style: { top: '0', left: '-2px', width: '5px', height: '100%' }},
            { dir: 'top-left',     cursor: 'nwse-resize', style: { top: '-2px', left: '-2px', width: '8px', height: '8px' }},
            { dir: 'top-right',    cursor: 'nesw-resize', style: { top: '-2px', right: '-2px', width: '8px', height: '8px' }},
            { dir: 'bottom-left',  cursor: 'nesw-resize', style: { bottom: '-2px', left: '-2px', width: '8px', height: '8px' }},
            { dir: 'bottom-right', cursor: 'nwse-resize', style: { bottom: '-2px', right: '-2px', width: '8px', height: '8px' }},
        ];

        for (const r of resizers) {
            const el = quantum.document.createElement("div");
            el.dataset.direction = r.dir;
            el.style.position = "absolute";
            el.style.zIndex = "1000";
            el.style.cursor = r.cursor;
            el.style.userSelect = "none";
            el.style.background = "transparent";
            Object.assign(el.style, r.style);
            outerContainer.appendChild(el);

            el.addEventListener("mousedown", onResizeStart);
        }
        const titleBar = quantum.document.createElement("div");
        titleBar.style = `
            height: 30px;
            width: 100%;
            background: rgba(0, 0, 0, 0.15);
            z-index: ${appZIndex + 1};
            padding-bottom: 12px;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
        `;
        const appIcon = quantum.document.createElement("img");
        appIcon.draggable = "false";
        appIcon.style = "margin-left: 0.75em; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;";
        const appIconSrc = await internalFS.getFile(appPath + ".icon");
        if (!appIconSrc) {
            const defaultSVG = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>
            `;

            appIcon.src = `data:image/svg+xml;utf8,${encodeURIComponent(defaultSVG)}`;
        } else {
            appIcon.src = "data:image/svg+xml;utf8," + encodeURIComponent(appIconSrc);
        }
        const appTitle = quantum.document.createElement("h3");
        appTitle.textContent = appId.replace(/\.js$/, "");;
        appTitle.style = "font-family: sans-serif; margin: 0.5em; font-weight: normal"
        titleBar.className = "titlebar";
        const container = quantum.document.createElement("div");
        container.className = "app-container";
        container.style = `width: 100%; height: calc(100% - 33px); overflow: auto; position: relative;`;
        const closeButton = quantum.document.createElement("button");
        closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
        closeButton.style = `
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            position: absolute;
            right: 0;
            top: -4px;
        `;
        const appBar = quantum.document.getElementById("appBar");

        const appToDock = quantum.document.createElement("div");
        appToDock.style = "height: 2em; width: 2em; display: flex; align-items: center; justify-content: center; background-color: rgba(75, 75, 75, 0.3); border-radius: 25%; padding: 0.5em; margin-right: 0.5em; cursor: pointer;";
        const appToDockImg = quantum.document.createElement("img");
        appToDockImg.draggable = "false";
        appToDockImg.style = "border-radius: 0.5em; width: 2em; height: 2em; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;";
        appToDockImg.src = appIcon.src;
        let digits = "";
        for (let i = 0; i < 10; i++) {
            digits += Math.floor(Math.random() * 10);
        }
        appToDock.append(appToDockImg);
        appToDock.dataset.dockDigitId = digits;
        appBar.append(appToDock);
        appToDock.onclick = async() => {
            appZIndex = appZIndex + 10;
            outerContainer.style.display = "block";
            outerContainer.style.zIndex = appZIndex;
        }
        closeButton.addEventListener("click", () => {
            const codeElem = quantum.document.getElementById(`code-${appId}`);
            if (codeElem) {
                codeElem.remove();
            }
            
            outerContainer.remove();
            appToDock.remove();
        });

        const topBarSplitter = quantum.document.createElement("div");
        topBarSplitter.style = "width: 100%; height: 2px; background-color:rgba(128, 128, 128, 0.5); position: fixed; left: 0; top: 41px;"

        outerContainer.id = digits;
        container.id = `app-${appId}`;
        titleBar.append(appIcon);
        appTitle.dataset.titleDigitId = digits;
        titleBar.append(appTitle);
        titleBar.appendChild(closeButton);
        outerContainer.append(titleBar);
        container.append(topBarSplitter);
        outerContainer.append(container);
        outerContainer.style.display = "block";
        outerContainer.tabIndex = "0";
        outerContainer.focus();
        createDraggableWindow(outerContainer);
        outerContainer.addEventListener("keydown", (e) => {
            if (Number(outerContainer.style.zIndex) !== appZIndex) {
                return;
            }
            if (!e.altKey) return;
            switch (e.key) {
                case "ArrowLeft":
                    outerContainer.style.left = "0";
                    outerContainer.style.top = "0";
                    outerContainer.style.right = "";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "50%";
                    outerContainer.style.height = `calc(100% - 6em)`;
                    break;
                
                case "ArrowRight":
                    outerContainer.style.left = "";
                    outerContainer.style.right = "0";
                    outerContainer.style.top = "0";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "50%";
                    outerContainer.style.height = `calc(100% - 6em)`;
                    break;
               
                case "ArrowUp":
                    outerContainer.style.left = "0";
                    outerContainer.style.right = "";
                    outerContainer.style.top = "0";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "100%";
                    outerContainer.style.height = `calc(50% - 3em)`;
                    break;
                
                case "ArrowDown":
                    outerContainer.style.left = "0";
                    outerContainer.style.right = "";
                    outerContainer.style.top = "calc(100% - 50% - 3em)";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "100%";
                    outerContainer.style.height = `calc(50% - 3em)`;
                    break;
                case "Enter":
                    outerContainer.style.left = "0";
                    outerContainer.style.right = "";
                    outerContainer.style.top = "0";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "100%";
                    outerContainer.style.height = `calc(100% - 6em)`;
                    break;
                default:
                    if (e.code === "KeyW") {
                        const codeElem = quantum.document.getElementById(`code-${appId}`);
                        if (codeElem) {
                            codeElem.remove();
                        }
                        
                        outerContainer.remove();
                        appToDock.remove();
                    }
                    break;
            }
        }) 

        
        requestAnimationFrame(() => {
            outerContainer.style.opacity = "1";
            outerContainer.style.transform = "translateY(0px)";
        });

        return container;
        
    }
    let docked;

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
                if (docked) {
                    startMenuDiv.style.left = "1.5%";
                    startMenuDiv.style.bottom = "5em";
                }
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
            appListDiv.style = "height: 18em; overflow: auto; position: relative; overflow-x: hidden;"
            startMenuDiv.append(appListDiv);
            for (let i = 0; i < appList.length; i++) {
                if (appList[i].endsWith(".js")) {
                    const appButton = quantum.document.createElement("button");
                    const cleanedAppName = appList[i].replace("/home/applications/", "");
                    const appTitle = quantum.document.createElement("p");
                    appTitle.textContent = cleanedAppName.replace(/\.js$/, "");
                    appButton.style = "color: white; background-color: rgba(45, 45, 45, 0.7); border-color: rgba(105, 105, 105, 0.6); border-style: solid; border-radius: 0.5em; padding: 0.5em; width: 35em; height: 3em; margin: 0.2em 0.5em; text-align: left; cursor: pointer; display: flex; flex-wrap: wrap; align-content: flex-start;"
                    const appIcon = quantum.document.createElement("img");
                    appIcon.draggable = "false";
                    appIcon.style = "display: inline; padding-right: 0.2em; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
                    appTitle.style = "display: inline;"
                    const appIconSrc = await internalFS.getFile(appList[i] + ".icon");
                    if (!appIconSrc) {
                        const defaultSVG = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>
                        `;

                        appIcon.src = `data:image/svg+xml;utf8,${encodeURIComponent(defaultSVG)}`;
                    } else {
                        appIcon.src = "data:image/svg+xml;utf8," + encodeURIComponent(appIconSrc);
                    }
                    appButton.onclick = async () => {
                        const code = await internalFS.getFile(appList[i]);
                        await runApp(cleanedAppName, code, appList[i]);
                        await openStartMenu()
                    };
                    appButton.append(appIcon);
                    appButton.append(appTitle);
                    appListDiv.append(appButton);
                }
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
            await importLib("https://cdn.jsdelivr.net/npm/mathjs@12.4.1/lib/browser/math.min.js");
            docked = await internalFS.getFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt");
            const mainDiv = quantum.document.getElementById("termDiv");
            mainDiv.innerHTML = "";
            const desktop = quantum.document.createElement("div");
            importStylesheet(await internalFS.getFile("/system/env/systemStyles.css"), true);
            importStylesheet("https://fonts.googleapis.com/css?family=Figtree", false)
            const dock = quantum.document.createElement("div");
            const wallpaperChosen = await internalFS.getFile("/system/env/systemconfig/settings/customization/wallpaperchosen.txt");
            const imageDataURI = await internalFS.getFile(wallpaperChosen);
            const blob = await dataURIToBlob(imageDataURI);
            const imageData = URL.createObjectURL(blob);
            quantum.document.body.style.margin = "0";
            desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center; font-family: sans-serif; opacity: 0; transition: 0.2s; font-family: "Figtree", sans-serif;`;
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
            if (docked && docked === true) {
                dock.style.width = "100%";
                dock.style.bottom = "0";
                dock.style.border = "";
                dock.style.borderStyle = "none";  
                dock.style.borderTop = "rgba(65, 65, 65, 0.65) 1.5px solid";   
                dock.style.borderRadius = "0";

            }
            dock.style.backdropFilter = `bluck(${blur}px)`;
            

            await desktop.append(dock);

            const huopalogoURI = await internalFS.getFile("/system/env/assets/huopalogo.png");
            const huopalogoBlob = await dataURIToBlob(huopalogoURI);
            const huopalogo = URL.createObjectURL(huopalogoBlob);
            const startMenuButton = quantum.document.createElement("button");
            startMenuButton.style = `outline: none; background-image: url(${huopalogo}); background-size: contain; background-repeat: no-repeat; background-position: center; width: 4em; height: 4em; border: none; background-color: transparent; border-radius: 50%; margin: 0.66em; transition: 0.15s;cursor: pointer; transform-origin: center;`;
            const appBar = quantum.document.createElement("div");
            const clockDiv = quantum.document.createElement("div");
            clockDiv.id = "clockDiv";
            clockDiv.style = "padding: 0em; margin: 0em; border-radius: 0; border-style: none; border-width: 0px; text-align: center; width: 10.5em;"
            const clockCurrentTime = quantum.document.createElement("p");
            const clockCurrentDate = quantum.document.createElement("p");
            createSysDaemon("clockUpdate", () => {
                const pad = n => String(n).padStart(2, "0");
                const monthNameList = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                const loop = () => {
                    const now = new Date();
                    clockCurrentTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

                    let date = now.getDate();
                    let dateEnding = "th";

                    if (date % 100 < 11 || date % 100 > 13) {
                        if (date % 10 === 1) dateEnding = "st";
                        else if (date % 10 === 2) dateEnding = "nd";
                        else if (date % 10 === 3) dateEnding = "rd";
                    }

                    clockCurrentDate.textContent = `${monthNameList[now.getMonth()]} ${date}${dateEnding}, ${now.getFullYear()}`;
                    setTimeout(loop, 1000);
                };

                loop();
            });

            clockDiv.append(clockCurrentTime);
            clockDiv.append(clockCurrentDate);
            appBar.style = `width: 100%; height: 90%; border-radius: 0.7em; display: flex; align-items: center; overflow-x: auto; overflow-y: hidden; position: relative;`
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
            if (true) {
                await importLib("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");
                await new Promise(resolve => setTimeout(resolve, 500));
                const code = await internalFS.getFile("/system/packages/huopadesktop.js");
                const checksum = await CryptoJS.MD5(code).toString()

                const response = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/packages/huopadesktop.js`);
                if (response.ok) {
                    const newCode = await response.text();
                    const newChecksum = CryptoJS.MD5(newCode).toString();
                    if (checksum !== newChecksum) {
                        await internalFS.createPath("/system/packages/huopadesktop.js", "file", newCode);
                        await mainInstaller();
                        return;
                    }
                }
            }

            await sys.addLine("Loading HuopaDesktop...");
            await new Promise(resolve => setTimeout(resolve, 100));

            createMainGUI()
            sessionType = "graphical";

        },


        // Installer (ignore)


        async install() {
            await new Promise(resolve => setTimeout(resolve, 100));
            await sys.addLine("## [line=blue]Installing GUI system..[/line]");
            await mainInstaller();
            sessionType = "graphical";
        },
        
    };
})();