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
    const version = "1.3.6";
    const processDigitList = {};
    const processArrayList = []
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
                if (!await internalFS.getFile("/home/downloads")) internalFS.createPath("/home/downloads", "dir", "[]");
                await internalFS.createPath("/system/env/config.json", "file", JSON.stringify(bootConfig));
                await sys.addLine("Boot config created!");
                await sys.addLine("Installing system apps...");
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Settings.js`, "/home/applications/Settings.js");
                if (true) {
                    await internalFS.createPath("/home/applications/Settings.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`);
                }
                
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/App%20Store.js`, "/home/applications/App Store.js");
                if (true) {
                    await internalFS.createPath("/home/applications/App Store.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`);
                }
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Desktop.js`, "/system/coreapplications/.Desktop.js");
                if (true) {
                    await internalFS.createPath("/system/coreapplications/.Desktop.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>`);
                }
                if (!await internalFS.getFile("/system/bootapps")) {
                    await internalFS.createPath("/system/bootapps", "dir", "[]");
                }
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Calculator.js`, "/home/applications/Calculator.js");
                if (true) {
                    await internalFS.createPath("/home/applications/Calculator.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator-icon lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`);
                }
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/File%20Manager.js`, "/home/applications/File Manager.js");
                if (true) {
                    await internalFS.createPath("/home/applications/File Manager.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-closed-icon lucide-folder-closed"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>`);
                }
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Terminal.js`, "/home/applications/Terminal.js");
                if (true) {
                    await internalFS.createPath("/home/applications/Terminal.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-terminal-icon lucide-square-terminal"><path d="m7 11 2-2-2-2"/><path d="M11 13h4"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>`);
                }
                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Processes.js`, "/home/applications/Processes.js");

                await downloadApp(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Preview.js`, "/home/applications/Preview.js");
                if (true) {
                    await internalFS.createPath("/home/applications/Preview.js.icon", "file", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-icon lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`);
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
                // RWL is mainly made by Flufi (GH: @Flufi-Boi).
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
                const response4 = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/huopaAPIModules/contextmenu.js`);
                if (response4.ok) {
                    const data = await response4.text();
                    await internalFS.createPath("/system/env/modules/contextmenu.js", "file", data);
                }
                await sys.addLine("[line=blue]Downloading and installing wallpapers...[/line]")
                let wallpaper1Success;
                let wallpaper2Success;
                let wallpaper3Success;
                let wallpaper4Success;
                let wallpaper5Success;
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
                if (!await internalFS.getFile("/system/env/wallpapers/Deep Space.jpg")) {
                    // Credits to https://wallpaperaccess.com/real-space-hd-desktop (image #4)
                    wallpaper5Success = await fetchAndStoreImage(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/Wallpapers/Deep%20Space.jpg`, "/system/env/wallpapers/Deep Space.png");
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
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/bgopac.txt", "file", "0.85")
                }

                if (!await internalFS.getFile("/system/env/systemconfig/settings/customization/dockopac.txt")) {
                    await internalFS.createPath("/system/env/systemconfig/settings/customization/dockopac.txt", "file", "0.7")
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
                if (!await huopaAPI.getFile("/system/env/systemStyles.css") && !skipStyles) {
                    styleDownloadSuccess = await new Promise(async (resolve, reject) => {
                        try {
                            const response = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/main/HuopaDesktop/Themes/Dark&20Mode.css`);
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
        titleText.style = "text-align: center; margin: 1em;"
        infoText.style = "text-align: center; margin: 0.5em;"
        container.append(infoText);
    }

    const createRoturLoginWindow = async (app) => {
        return new Promise( async(resolve, reject) => {
                try {
                    await new Promise(r => setTimeout(r, 1000));
                    const result = await new Promise(async(resolve, reject) => {
                        const win = window.open(`https://rotur.dev/auth?styles=https://origin.mistium.com/Resources/auth.css&return_to=${window.location.origin}/HuopaOS/AuthSuccess`, "_blank");
                        if (!win) {
                            console.error("Login window doesn't exist!");
                            reject("Fail");
                        }
                        const interval = setInterval(() => {
                            if (win.closed) {
                                console.error("Login window closed!");
                                clearInterval(interval);
                                reject("Fail");
                            }
                            try {
                                if (win.location.origin === window.location.origin) {
                                    const token = win.location.search.replace("?token=", "")
                                    if (token) {
                                        clearInterval(interval)
                                        win.close();
                                        resolve(token);
                                    } else {
                                        reject("Fail")
                                    }
                                }
                            } catch {}
                        }, 200)
                    });
                    if (result === "Fail") {
                        reject("Fail");
                        return;
                    }
                    resolve(result);
                    return;
                } catch (error) {
                    console.error("Login error:", error);
                    reject(error);
                }

        })
        
    }
    const GitHubAPI = (() => {

        async function fetchGitHub(credentials, url, method = 'GET', body = null) {
            const githubAuthToken = credentials;
            const headers = {
            'Accept': 'application/vnd.github.v3+json',
            };
            if (githubAuthToken) headers['Authorization'] = `token ${githubAuthToken}`;
            if (body) headers['Content-Type'] = 'application/json';

            const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            return await response.json();
        }

        async function getRepositoryInfo(credentials, user, repo) {
            const data = await fetchGitHub(credentials, `https://api.github.com/repos/${user}/${repo}`);
            return {
            name: data.name,
            description: data.description,
            owner: data.owner.login,
            stars: data.stargazers_count,
            watchers: data.watchers_count,
            forks: data.forks_count,
            avatar: data.owner.avatar_url
            };
        }

        async function getFile(credentials, user, repo, branch, path) {
            const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch file.");
            return await response.text();
        }

        async function createFile(credentials, user, repo, path, content) {
            const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
            const base64 = btoa(content);

            let sha = null;

            const body = {
            message: 'Create file',
            content: base64,
            ...(sha ? { sha } : {})
            };

            return await fetchGitHub(credentials, url, 'PUT', body);
        }

        async function updateFile(credentials, user, repo, path, content) {
            const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
            const base64 = btoa(content);

            let sha = null;
            
            const existing = await fetchGitHub(credentials, url);
            sha = existing.sha;
            

            const body = {
            message: 'Update file',
            content: base64,
            ...(sha ? { sha } : {})
            };

            return await fetchGitHub(credentials, url, 'PUT', body);
        }

        async function deleteFile(credentials, user, repo, path) {
            const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
            const existing = await fetchGitHub(credentials, url);
            const body = {
            message: 'Delete file',
            sha: existing.sha
            };
            return await fetchGitHub(credentials, url, 'DELETE', body);
        }

        async function listFolder(credentials, user, repo, folder) {
            const data = await fetchGitHub(credentials, `https://api.github.com/repos/${user}/${repo}/contents/${folder}`);
            return data.map(item => ({ name: item.name, path: item.path }));
        }

        async function listIssues(credentials, user, repo) {
            return await fetchGitHub(credentials, `https://api.github.com/repos/${user}/${repo}/issues`);
        }

        async function createIssue(credentials, user, repo, title, body) {
            return await fetchGitHub(credentials, `https://api.github.com/repos/${user}/${repo}/issues`, 'POST', {
            title,
            body
            });
        }

        async function updateIssue(credentials, user, repo, issueNumber, title, body) {
            return await fetchGitHub(credentials, `https://api.github.com/repos/${user}/${repo}/issues/${issueNumber}`, 'PATCH', {
            title,
            body
            });
        }

        return {
            getRepositoryInfo,
            getFile,
            createFile,
            updateFile,
            deleteFile,
            listFolder,
            listIssues,
            createIssue,
            updateIssue
        };
    })();

    const createSysDaemon = async (name, daemonFunc) => {
        console.log("[SYS]: Running System Daemon: " + name);
        daemonFunc();
    }
    const induceCrash = async (error) => {
        const mainDiv = quantum.document.getElementById("termDiv");
            mainDiv.innerHTML = ""
            await sys.addLine("## --!--")
            await sys.addLine("### An unhandled exeption has occurred in HuopaDesktop and the system has been forced to halt.");
            await sys.addLine(`Error: ${error}`);
            await sys.addLine("Try updating your packages (such as HuopaDesktop) using the command: \"hpkg update\".");
            await sys.addLine("If you still have issues, check if you have any custom scripts for HuopaDesktop. If you do, try booting HuopaDesktop without the scripts.");
            await sys.addLine("If you don't have any custom scripts or the issue is still occurring, please report this issue to me (for example through the HuopaOS Github).");
            await sys.addLine("Reboot the system to load into HuopaDesktop or the terminal (hold down \"C\" to load into the terminal).");
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
        const digits = container.parentElement.id;
        iframe.id = `code-${appId}-${digits}`;
        iframe.classList.add("app");
        iframe.dataset.digitId = digits;
        processArrayList.push(digits)
        iframe.style.width = "calc(100%)";
        iframe.style.height = "calc(100%)";
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.border = "none";
        iframe.sandbox = "allow-scripts";
        container.appendChild(iframe);
        const styleData = await internalFS.getFile("/system/env/systemStyles.css");
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

                    });

                    return new Proxy({}, {
                        get(_, prop) {
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
                                if (key === "class") {
                                    element.classList.add(value);
                                } else if (key === "src" {
                                    const computed = getComputedStyle(element);
                                    const updated = value.replace(/currentColor/g, computed.color);
                                    element[key] = updated;
                                } else {
                                    element[key] = value;
                                }
                            }
                        }
                        async function importModule(moduleName) {
                            const moduleCode = await huopaAPI.getFile("/system/env/modules/" + moduleName.toLowerCase() + ".js");
                            const module = eval("(() => { " + moduleCode + " })()");
                            return module;
                        }
                        const loadParams = ${JSON.stringify(startParams)};
                        const systemStyles = document.createElement("style");
                        systemStyles.textContent = ${JSON.stringify(styleData)};
                        await new Promise((resolve) => {
                        if (document.body) return resolve();
                            window.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
                        });
                        document.body.style.height = "calc(100vh - 40px)";
                        document.head.append(systemStyles);
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

    const runApp = async (appId, appCodeString, appPath, startData, extra) => {
        if (killSwitch) return;
        const container = await createAppContainer(appId, appPath, extra);
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
    const windowList = [];
    const huopaAPIHandlers = (appContainer) => {
        
        return {

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

            getWindowSize: function() {
                return {
                    width: appContainer.clientWidth,
                    height: appContainer.clientHeight,
                };
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
                const digitId = appContainer.parentElement.id;
                const blockList = ["/system/packages/huopadesktop.js"]
                for (const blockPath of blockList) {
                    if (blockPath.includes(path) && !processDigitList[digitId].elevated) {
                        console.error("[huopaAPI SAFETY]: App tried writing in blocked storage!");
                        return "[HuopaDesktop FS Security]: No permissions";
                    }
                }
                if (path.startsWith("/system/env/appconfig")) {
                    console.warn("[huopaAPI SAFETY]: App tried writing in safeStorage using default write command!");
                    return "[HuopaDesktop FS Security]: No permissions";
                }
                return internalFS.createPath(path, type, content, permissions);
            },



            openFileImport: async function(accept = "*", type = "auto", allowMultiple = false) {
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
                const detectType = (file) => {
                    if (type !== "auto") return type;

                    const mime = file.type || "";
                    const name = file.name.toLowerCase();

                    if (mime.startsWith("text/") || /\.(txt|md|json|js|ts|html|css|csv|xml|yml|yaml)$/i.test(name)) {
                        return "text";
                    } else if (mime.startsWith("image/") || mime.startsWith("video/") || mime.startsWith("audio/") || /\.(png|jpe?g|gif|svg|webp|mp4|mp3)$/i.test(name)) {
                        return "dataURL";
                    } else {
                        return "binary";
                    }
                };
                const readFile = (file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    const inferredType = detectType(file);

                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("Failed to read file"));

                    if (inferredType === "text") {
                        reader.readAsText(file);
                    } else if (inferredType === "dataURL") {
                        reader.readAsDataURL(file);
                    } else if (inferredType === "binary") {
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

            openRoturLogin: async(appId) => {
                return await createRoturLoginWindow(appId);
            },

            safeStorageWrite: async(data, appId) => {
                if (!appId) { console.warn("No app ID inputted for SafeStorageWrite. Call cancelled."); return;}
                await internalFS.createPath("/system/env/appconfig/"+ appId.replace(".js", "") + "/" + data[0], data[1], data[2], `"${appId}"`);
            },

            safeStorageRead: async(path, appId) => {
                if (!appId) { console.warn("No app ID inputted for SafeStorageRead. Call cancelled."); return;}
                return await internalFS.getFile("/system/env/appconfig/"+ appId.replace(".js", "") + "/" + path);
            },

            runApp: async(path, startParams, elevated = false) => {
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
                const digitId = appContainer.parentElement.id;
                if (elevated && processDigitList[digitId].elevated) {
                    await runApp(appName, code, path, startParams, "elevated");
                } else {
                    await runApp(appName, code, path, startParams);
                }
                
                
            },
 
            openFileDialog: async (allowed) => {
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
                const i = processArrayList.indexOf(digitId);
                if (i !== -1) processArrayList.splice(i, 1);
                delete processDigitList[digitId];
                const codeElem = quantum.document.getElementById(`code-${processDigitList.name}-${digitId}`);
                if (codeElem) {
                    codeElem.remove();
                }
                const index = windowList.indexOf([digitId, appContainer.parentElement])
                if (index !== -1) {
                    windowList.splice(index, 1);
                }
                appContainer.parentElement.remove();
                const appToDock = quantum.document.querySelector(`[data-dock-digit-id="${digitId}"]`);
                if (appToDock) {
                    appToDock.remove();
                }
            },

            setTitle: (content) => {
                const digitId = appContainer.parentElement.id;
                processDigitList[digitId].title = content
                const title = quantum.document.querySelector(`[data-title-digit-id="${digitId}"]`);
                title.textContent = content;
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
                const digitId = appContainer.parentElement.id;
                processDigitList[digitId].hidden = true;
                const appToDock = quantum.document.querySelector(`[data-dock-digit-id="${digitId}"]`);
                appToDock.style.display = "none";
            },

            showWindow: () => {
                processDigitList[digitId].hidden = false;
                appContainer.parentElement.style.display = "block";
                const appToDock = quantum.document.querySelector(`[data-dock-digit-id="${digitId}"]`);
                appToDock.style.display = "block";
            },
            
            createNotification: async (title, content) => {
                const notifEl = quantum.document.createElement("div");
                notifEl.style = "border-radius: 0.5em; width: 20em; position: absolute; top: 0.5em; right: -22em; transition: right ease 1s; z-index: 99999;";
                const titleEl = quantum.document.createElement("h3");
                const descEl = quantum.document.createElement("p");
                titleEl.style = "padding: 0.75em; margin: 0;";
                titleEl.textContent = title;
                descEl.style = "padding: 0 0.75em; padding-bottom: 0.75em;";
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
 
            calculate: (expression, scope = {}) => {
                try {
                    const result = math.evaluate(expression, scope);
                    return result;
                } catch (error) {
                    console.error(`calculate: '${error}'`);
                    return;
                }
                
            },

            parseMarkdown: (html) => {
                try {
                    const returned = marked.parse(html);
                    return returned;
                } catch (error) {
                    console.error(`parseMarkdown: Failed to parse markdown: '${error}'`);
                    return;
                }
            },

            getSystemInfo: async() => {
                async function getBrowserName() {
                    const ua = navigator.userAgent;

                    if (ua.includes("Firefox/")) return "Firefox";
                    if (ua.includes("Edg/")) return "Edge";
                    if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
                    if (ua.includes("Vivaldi")) return "Vivaldi";
                    if (ua.includes("Safari/") && !ua.includes("Chrome/") && !ua.includes("Chromium/")) return "Safari";

                    if (navigator.brave && await navigator.brave.isBrave()) {
                        return "Brave";
                    }

                    if (ua.includes("Chrome/")) return "Chrome";

                    return "Unknown";
                }
                const browser = await getBrowserName()
                const battery = await navigator.getBattery();
                const systemInfo = {
                version: version,
                bootTime: quantum.bootTime,
                battery: battery.level,
                host: navigator.userAgentData?.platform ?? "Unknown",
                browser
                };
                
                return JSON.stringify(systemInfo);
            },

            github_createFile: (credentials, user, repo, path, content) => {
                GitHubAPI.createFile(credentials, user, repo, path, content);
            },

            github_updateFile: (credentials, user, repo, path, content) => {
                GitHubAPI.updateFile(credentials, user, repo, path, content, true);
            },
            github_deleteFile: (credentials, user, repo, path) => {
                GitHubAPI.deleteFile(credentials, user, repo, path)
            },
            github_getFile: async(credentials, user, repo, branch, path) => {
                const result = await GitHubAPI.getFile(credentials, user, repo, branch, path);
                return result;
            },

            github_getRepoInfo: (credentials, user, repo) => {
                GitHubAPI.getRepositoryInfo(credentials, user, repo);
            },

            github_getIssues: (credentials, user, repo) => {
                GitHubAPI.listIssues(credentials, user, repo);
            },

            github_createIssue: (credentials, user, repo, title, content) => {
                GitHubAPI.createIssue(credentials, user, repo, title, content);
            },

            github_getFolder: (credentials, user, repo, folder) => {
                GitHubAPI.listFolder(credentials, user, repo, folder);
            },

            openSaveDialog: (def) => {
                const popup = quantum.document.createElement("div");
                popup.style = "position: absolute; left: 0; top: 0; width: 100%; height: 100%;";
                popup.classList.add("popup")
                const input = quantum.document.createElement("input");
                const title = quantum.document.createElement("h2");
                title.textContent = "Choose a filename and path";
                title.style = "margin: 1em auto; display: block; text-align: center;";
                input.style = "margin: 0.5em auto; display: block; width: 35%";
                input.placeholder = "eg: /home/test.txt";
                if (def) input.value = def;
                popup.append(title, input);
                appContainer.append(popup);
                return new Promise(async(resolve, reject) => {
                    input.addEventListener("keydown", (e) => {
                        if (e?.key === "Enter") {
                            if (input.value) {
                                popup.remove();
                                resolve(input.value)
                            }
                            
                        }
                    })
                })
                
            },

            removeTitlebar: () => {
                const titlebar = appContainer.parentElement.children[8]
                titlebar.children[0].remove();
                titlebar.children[0].remove();

                appContainer.parentElement.children[8].style.position = "absolute";
                appContainer.parentElement.children[8].style.backgroundColor = "transparent";
                appContainer.children[0].remove();
            },

            setWindowPosition: (x, y) => {
                if (x) appContainer.parentElement.style.left = x;
                if (y) appContainer.parentElement.style.top = y;
            },

            setWindowSize: (width, height) => {
                if (width) appContainer.parentElement.style.width = width;
                if (height) appContainer.parentElement.style.height = height;
            },

            setWindowColor: (bg, border) => {
                if (bg) appContainer.parentElement.style.backgroundColor = bg;
                if (border) {
                    const digitId = appContainer.parentElement.id;
                    appContainer.parentElement.setAttribute("data-border-override", digitId);
                    appContainer.parentElement.style.borderColor = border;
                }
            },

            getWindowPosition: () => {
                return `["${appContainer.parentElement.style.left}", "${appContainer.parentElement.style.top}"]`
            },

            getWindowSize: () => {
                return `["${appContainer.parentElement.style.width}", "${appContainer.parentElement.style.height}"]`
            },

            getWindowColor: () => {
                return `["${appContainer.parentElement.style.backgroundColor}", "${appContainer.parentElement.style.borderColor}"]`
            },

            setWindowBlur: (blur) => {
                if (blur) appContainer.parentElement.style.backdropFilter = `blur(${blur})`;
            },

            getProcesses: () => {
                return JSON.stringify([processArrayList, processDigitList]);
            },

            quitProcess: (id) => {
                const digitId = appContainer.parentElement.id;
                if (processDigitList[digitId].elevated === true) {
                    const win = quantum.document.getElementById(id);
                    const i = processArrayList.indexOf(id);
                    if (i !== -1) processArrayList.splice(i, 1);
                    delete processDigitList[id];
                    const appToDock = quantum.document.querySelector(`[data-dock-digit-id="${id}"]`);
                    if (appToDock) {
                        appToDock.remove();
                    }
                    if (win) win.remove();
                } else {
                    console.error("closeProcess: The process requires administrator rights for this function!")
                    return;
                }
            },

            setProcessWindowSize: (id, width, height) => {
                const digitId = appContainer.parentElement.id;
                if (processDigitList[digitId].elevated === true) {
                    const win = quantum.document.getElementById(id);
                    if (width) win.style.width = width;
                    if (height) win.style.height = height;
                } else {
                    console.error("setProcessWindowSize: The process requires administrator rights for this function!")
                    return;
                }
            },

            setProcessWindowPosition: (id, left, top) => {
                const digitId = appContainer.parentElement.id;
                if (processDigitList[digitId].elevated === true) {
                    const win = quantum.document.getElementById(id);
                    if (left) win.style.left = left;
                    if (left) win.style.top = top;
                } else {
                    console.error("setProcessWindowPosition: The process requires administrator rights for this function!")
                    return;
                }
            },

            setProcessWindowAnimation: (id, data) => {
                const digitId = appContainer.parentElement.id;
                if (processDigitList[digitId].elevated === true) {
                    const win = quantum.document.getElementById(id);
                    if (data) win.style.transition = data;
                } else {
                    console.error("setProcessWindowAnimation: The process requires administrator rights for this function!")
                    return;
                }
            },

            getProcessWindowPosition: (id) => {
                const digitId = appContainer.parentElement.id;
                if (processDigitList[digitId].elevated === true) {
                    const win = quantum.document.getElementById(id);
                    return `["${win.style.left}", "${win.style.top}"]`
                } else {
                    console.error("getProcessWindowPosition: The process requires administrator rights for this function!")
                    return;
                }
            },

            getProcessWindowSize: (id) => {
                const digitId = appContainer.parentElement.id;
                if (processDigitList[digitId].elevated === true) {
                    const win = quantum.document.getElementById(id);
                    return `["${win.style.width}", "${win.style.height}"]`
                } else {
                    console.error("getProcessWindowSize: The process requires administrator rights for this function!")
                    return;
                }
            },

            requestElevation: () => {
                return new Promise((resolve) => {
                    const digitId = appContainer.parentElement.id;
                    const popup = quantum.document.createElement("div");
                    popup.style = "position: absolute; left: 0; top: 0; width: 100%; height: 100%;";
                    popup.classList.add("popup")
                    const accept = quantum.document.createElement("button");
                    const decline = quantum.document.createElement("button");
                    const title = quantum.document.createElement("h2");
                    title.textContent = "Administrator Prompt";
                    const subtitle = quantum.document.createElement("h3");
                    subtitle.textContent = "Do you want to give this process administrator rights?";
                    title.style = "margin: 1em auto; display: block; text-align: center;";
                    subtitle.style = "margin: 1em auto; display: block; text-align: center;";
                    accept.style = "margin: 0.5em auto; display: block; width: 50%";
                    accept.textContent = "Approve";
                    decline.style = "margin: 0.5em auto; display: block; width: 50%";
                    decline.textContent = "Reject";
                    popup.append(title, subtitle, accept, decline);
                    appContainer.append(popup);

                    accept.onclick = () => {
                        processDigitList[digitId].elevated = true;
                        popup.remove();
                        resolve(true);
                    };

                    decline.onclick = () => {
                        popup.remove();
                        resolve(false);
                    };
                });
            },

            getProcessData: () => {
                const digitId = appContainer.parentElement.id;
                return JSON.stringify(processDigitList[digitId]);
            },

            // Use these for config files and such. Don't use these for tokens and other secret things (use safeStorage)!
            applicationStorageWrite: (data, appId) => {
                internalFS.createPath("/system/applicationStorage/" + appId.replace(".js", "") + "/" + data[0], data[1], data[2]);
            },

            applicationStorageRead: async(data, appId) => {
                const returnData = await internalFS.getFile("/system/applicationStorage/" + appId.replace(".js", "") + "/" + data[0]);
                return returnData;
            }
        }
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
            } else if (type === "safeStorageWrite" || type === "applicationStorageWrite") {  

                result = await huopaAPI[type]((Array.isArray(data) ? data : [data].splice(3)), event.data.appName);

            } else if (type === "safeStorageRead" || type === "applicationStorageRead"){

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
        let skipFirstMouseMove = true;
        windowEl.style.position = "absolute";
        
        const dragHandle = windowEl.querySelector(dragHandleSelector);
        if (!dragHandle) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        dragHandle.style.cursor = "grab";
        dragHandle.addEventListener("mousedown", (e) => {
            skipFirstMouseMove = true;
            windowEl.children[9].style.pointerEvents = "none";
            for (const window of windowList) {
                if (window[1]?.children[9]) {
                    window[1].children[9].style.pointerEvents = "none";
                } else if (window[1]?.children[0]) {
                    window[1].children[0].style.pointerEvents = "none";
                }
            }
            windowEl.focus({ preventScroll: true });
            isDragging = true;

            const rect = windowEl.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            windowEl.style.position = "absolute";

            appZIndex += 10;
            windowEl.style.zIndex = appZIndex;

            requestAnimationFrame(() => {
                quantum.document.addEventListener("mousemove", onMouseMove);
                quantum.document.addEventListener("mouseup", onMouseUp);
            });
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            dragHandle.style.cursor = "grabbing";
            if (skipFirstMouseMove) {
                skipFirstMouseMove = false;
                return;
            }
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            windowEl.style.left = x + "px";
            windowEl.style.top = y + "px";
        }

        function onMouseUp() {
            windowEl.children[9].style.pointerEvents = "auto";
            for (const window of windowList) {
                if (window[0] === windowEl.id) continue;
                if (window[1]?.children[9]) {
                    window[1].children[9].style.pointerEvents = "auto";
                } else if (window[1]?.children[0]) {
                    window[1].children[0].style.pointerEvents = "auto";
                }
            }
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
            win.children[9].style.pointerEvents = "none";
            for (const window of windowList) {
                if (window[0] === win.id) continue;
                if (window[1]?.children[9]) {
                    window[1].children[9].style.pointerEvents = "none";
                } else if (window[1]?.children[0]) {
                    window[1].children[0].style.pointerEvents = "none";
                }
            }
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
            win.children[9].style.pointerEvents = "auto";
            for (const window of windowList) {
                if (window[0] === win.id) continue;
                if (window[1]?.children[9]) {
                    window[1].children[9].style.pointerEvents = "auto";
                } else if (window[1]?.children[0]) {
                    window[1].children[0].style.pointerEvents = "auto";
                }
            }
            quantum.document.removeEventListener("mousemove", onMouseMove);
            quantum.document.removeEventListener("mouseup", onMouseUp);
        }

        quantum.document.addEventListener("mousemove", onMouseMove);
        quantum.document.addEventListener("mouseup", onMouseUp);
    }

    const createAppContainer = async (appId, appPath, extra) => {
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
        if (extra !== "core") {
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
        }
        const titleBar = quantum.document.createElement("div");
        titleBar.style = `
            height: 30px;
            width: 100%;
            z-index: ${appZIndex + 1};
            padding-bottom: 12px;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            position: relative;
        `;
        titleBar.classList.add("appTitlebar")
        const appIcon = quantum.document.createElement("img");
        appIcon.draggable = "false";
        appIcon.style = "margin-left: 0.75em; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; position: absolute; top: 50%; transform: translateY(-50%);";
        const appIconSrc = await internalFS.getFile(appPath + ".icon");
        if (!appIconSrc) {
            const defaultSVG = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>
            `;

            appIcon.src = `data:image/svg+xml;utf8,${encodeURIComponent(defaultSVG)}`;
        } else {
            appIcon.src = "data:image/svg+xml;utf8," + encodeURIComponent(appIconSrc);
        }
        const appTitle = quantum.document.createElement("h3");
        appTitle.textContent = appId.replace(/\.js$/, "");;
        appTitle.style = "font-family: sans-serif; margin: 0.5em; font-weight: normal; margin-left: 2em; text-wrap-mode: nowrap;"
        titleBar.className = "titlebar";
        const container = quantum.document.createElement("div");
        container.className = "app-container";
        container.style = `width: 100%; height: calc(100% - 33px); overflow: auto; position: relative;`;
        const closeButton = quantum.document.createElement("button");
        closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
        closeButton.style = `
            background: transparent;
            border: none;
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
        let elevated = false;
        if (extra === "elevated") {
            elevated = true;
        }
        processDigitList[digits] = {elevated:elevated, name:appId, id:digits, title:appId, extra:extra, hidden:false};
        await createSysDaemon("appContBordUpdater", () => {
            const loop = async () => {
                const override = quantum.document.querySelector(`[data-border-override="${digits}"]`);
                if (!override) {
                    const borderColor = await internalFS.getFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt");
                    outerContainer.style.borderColor = borderColor;
                }
                
                setTimeout(loop, 200);
            }
            loop()
            
        })
        appToDock.append(appToDockImg);
        appToDock.dataset.dockDigitId = digits;
        if (extra !== "core") {
            appBar.append(appToDock);
            appToDock.onclick = async() => {
                appZIndex = appZIndex + 10;
                outerContainer.focus({ preventScroll: true });
                outerContainer.style.display = "block";
                outerContainer.style.zIndex = appZIndex;
            }
        }
       
        closeButton.addEventListener("click", () => {
            const i = processArrayList.indexOf(digits);
            if (i !== -1) processArrayList.splice(i, 1);
            delete processDigitList[digits];
            const codeElem = quantum.document.getElementById(`code-${appId}-${digits}`);
            if (codeElem) {
                codeElem.remove();
            }
            const index = windowList.indexOf([digits, outerContainer])
            if (index !== -1) {
                windowList.splice(index, 1);
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
        if (extra !== "core") {
            titleBar.appendChild(closeButton);
        }
        if (extra !== "core") {
            outerContainer.append(titleBar);
            container.append(topBarSplitter);
        }
        outerContainer.append(container);
        outerContainer.style.display = "block";
        outerContainer.tabIndex = "0";
        if (extra !== "core") {
            outerContainer.focus({ preventScroll: true });
        }
        windowList.push([digits, outerContainer]);
        if (extra !== "core") {
            createDraggableWindow(outerContainer);
        }
        outerContainer.addEventListener("keydown", async(e) => {
            if (Number(outerContainer.style.zIndex) !== appZIndex) {
                return;
            }
            if (!e.altKey) return;
            const docked = await internalFS.getFile("/system/env/systemconfig/settings/customization/dockedTaskbar.txt");
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault()
                    outerContainer.style.left = "0";
                    outerContainer.style.top = "0";
                    outerContainer.style.right = "";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "calc(50% - 3px)";
                    if (docked === true) {
                        outerContainer.style.height = `calc(100% - 4.3em)`;
                    } else {
                        outerContainer.style.height = `calc(100% - 7em)`;
                    }
                    
                   
                    break;
                
                case "ArrowRight":
                    e.preventDefault()
                    outerContainer.style.left = "";
                    outerContainer.style.right = "0";
                    outerContainer.style.top = "0";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "calc(50% - 3px)";
                    if (docked === true) {
                        outerContainer.style.height = `calc(100% - 4.3em)`;
                    } else {
                        outerContainer.style.height = `calc(100% - 7em)`;
                    }
                    break;
               
                case "ArrowUp":
                    e.preventDefault()
                    outerContainer.style.left = "0";
                    outerContainer.style.right = "";
                    outerContainer.style.top = "0";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "calc(100% - 4px)";
                    outerContainer.style.height = `calc(50% - 3em - 3px)`;
                    break;
                
                case "ArrowDown":
                    e.preventDefault()
                    outerContainer.style.left = "0";
                    outerContainer.style.right = "";
                    if (docked === true) {
                        outerContainer.style.height = `calc(50% - 1.4em - 3px)`;
                    } else {
                        outerContainer.style.height = "calc(50% - 4em - 3px)";
                    }
                    outerContainer.style.top = "calc(100% - 50% - 3em)";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "calc(100% - 4px)";
                    break;
                case "Enter":
                    e.preventDefault()
                    outerContainer.style.left = "0";
                    outerContainer.style.right = "";
                    outerContainer.style.top = "0";
                    outerContainer.style.bottom = "";
                    outerContainer.style.width = "calc(100% - 4px)";
                    if (docked === true) {
                        outerContainer.style.height = `calc(100% - 4.3em)`;
                    } else {
                        outerContainer.style.height = `calc(100% - 7em)`;
                    }
                    break;
                default:
                    if (e.code === "KeyW") {
                        e.preventDefault()
                        const i = processArrayList.indexOf(digits);
                        if (i !== -1) processArrayList.splice(i, 1);
                        delete processDigitList[digits];
                        const codeElem = quantum.document.getElementById(`code-${appId}-${digits}`);
                        if (codeElem) {
                            codeElem.remove();
                        }
                        const index = windowList.indexOf([digits, outerContainer])
                        if (index !== -1) {
                            windowList.splice(index, 1);
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
            shutdownButton.style = "background-color: transparent; border-color: rgba(105, 105, 105, 0.6); border-style: solid; border-radius: 0.5em; position: absolute; cursor: pointer; right: 0.5em; bottom: 0.5em; padding: 0.5em;"
            shutdownButton.textContent = "Shutdown";
            shutdownButton.onclick = async () => {
                window.close()
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
            appText.style = "margin: 0.5em; text-align: left; font-family: 'Figtree', sans-serif;"
            startMenuDiv.append(appText);
            if (appList.length < 1) {
                const noAppsText = quantum.document.createElement("p");
                noAppsText.textContent = "You don't seem to have any apps installed right now!";
                noAppsText.style = "margin: 0.7em; max-width: 17em; text-align: left; font-family: sans-serif;"
                startMenuDiv.append(noAppsText);
            }
            const appListDiv = quantum.document.createElement("div");
            appListDiv.style = "height: 18em; overflow: auto; position: relative; overflow-x: hidden;"
            startMenuDiv.append(appListDiv);
            for (let i = 0; i < appList.length; i++) {
                if (appList[i].endsWith(".js") && !appList[i].startsWith(".")) {
                    const appButton = quantum.document.createElement("button");
                    const cleanedAppName = appList[i].replace("/home/applications/", "");
                    const appTitle = quantum.document.createElement("p");
                    appTitle.textContent = cleanedAppName.replace(/\.js$/, "");
                    appButton.style = "background-color: transparent; border-color: rgba(105, 105, 105, 0.6); border-style: solid; border-radius: 0.5em; padding: 0.5em; width: 35em; height: 3em; margin: 0.2em 0.5em; text-align: left; cursor: pointer; display: flex; flex-wrap: wrap; align-content: flex-start;"
                    const appIcon = quantum.document.createElement("img");
                    appIcon.draggable = "false";
                    appIcon.style = "display: inline; padding-right: 0.2em; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
                    appTitle.style = "display: inline;"
                    const appIconSrc = await internalFS.getFile(appList[i] + ".icon");
                    if (!appIconSrc) {
                        const defaultSVG = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-icon lucide-file-code"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>
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
            const wallpaperExt = wallpaperChosen.split(".").pop()
            if (wallpaperExt === "mp4") {
                const video = quantum.document.createElement("video");
                video.src = imageData;
                video.id = "wallpaperVideo";
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;";
                desktop.append(video);
                desktop.style = `width: 100%; height: 100%; font-family: sans-serif; opacity: 0; transition: 0.2s; font-family: "Figtree", sans-serif;`;
            } else {
                desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center; font-family: sans-serif; opacity: 0; transition: 0.2s; font-family: "Figtree", sans-serif;`;
            }
            
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
                        const imageDataURI = await internalFS.getFile(wallpaperChosen);
                        const blob = await dataURIToBlob(imageDataURI);
                        const imageData = URL.createObjectURL(blob);
                        desktop.style.opacity = "0";
                        setTimeout(async () => {
                        const wallpaperExt = wallpaperChosen.split(".").pop()
                        const oldVid = quantum.document.getElementById("wallpaperVideo");
                        if (oldVid) oldVid.remove();
                        if (wallpaperExt === "mp4") {
                            const video = quantum.document.createElement("video");
                            video.src = imageData;
                            video.id = "wallpaperVideo";
                            video.autoplay = true;
                            video.muted = true;
                            video.loop = true;
                            video.playsInline = true;
                            video.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;";
                            desktop.append(video);
                            desktop.style = `width: 100%; height: 100%; font-family: sans-serif; opacity: 0; transition: 0.2s; font-family: "Figtree", sans-serif;`;
                        } else {
                            desktop.style = `width: 100%; height: 100%; background-image: url(${imageData}); background-size: cover; background-position: center; font-family: sans-serif; opacity: 0; transition: 0.2s; font-family: "Figtree", sans-serif;`;
                        }
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
                acceptButton.style = "background-color: rgba(35, 35, 35, 0.75); border-radius: 0.5em; border-style: solid; border-color: rgba(55, 55, 55, 0.9); margin: 0.5em auto; text-align: center; padding: 0.7em; display: block; cursor: pointer;"
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
            dock.style.backdropFilter = `blur(${blur}px)`;


            desktop.append(dock);

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
            let batteryDiv;
            let canUseBattery = false;
            if ('getBattery' in navigator) {
                canUseBattery = await navigator.getBattery().level !== 1 || !await navigator.getBattery().charging;
                batteryDiv = quantum.document.createElement("div");
                batteryDiv.id = "batteryDiv";
                batteryDiv.style = "padding: 0em; margin: 0em; border-radius: 0; border-style: none; border-width: 0px; text-align: center; width: 5em;"
                const batteryText = quantum.document.createElement("p");
                const batteryIcon = quantum.document.createElement("img");
                createSysDaemon("batteryUpdate", () => {
                    const loop = async() => {
                        const battery = await navigator.getBattery()
                        const batteryLevel = Math.round(battery.level * 100);
                        batteryText.textContent = batteryLevel + "%";
                        let icon;
                        if (battery.charging) {
                            icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-charging-icon lucide-battery-charging"><path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/></svg>`;
                            
                        } else {
                            if (batteryLevel > 66) {
                                icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-full-icon lucide-battery-full"><path d="M10 10v4"/><path d="M14 10v4"/><path d="M22 14v-4"/><path d="M6 10v4"/><rect x="2" y="6" width="16" height="12" rx="2"/></svg>`;
                            } else if (batteryLevel > 33) {
                                icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-medium-icon lucide-battery-medium"><path d="M10 14v-4"/><path d="M22 14v-4"/><path d="M6 14v-4"/><rect x="2" y="6" width="16" height="12" rx="2"/></svg>`
                            } else if (batteryLevel > 5) {
                               icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-low-icon lucide-battery-low"><path d="M22 14v-4"/><path d="M6 14v-4"/><rect x="2" y="6" width="16" height="12" rx="2"/></svg>`;
                            } else {
                                icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-icon lucide-battery"><path d="M 22 14 L 22 10"/><rect x="2" y="6" width="16" height="12" rx="2"/></svg>`
                            }
                        }
                        batteryIcon.src = `data:image/svg+xml;utf8,${encodeURIComponent(icon)}`
                        
                        setTimeout(loop, 1000);
                    }
                    loop()
                })
                batteryDiv.append(batteryIcon);
                batteryDiv.append(batteryText);
            }
            appBar.style = `width: 100%; height: 90%; border-radius: 0.7em; display: flex; align-items: center; overflow-x: auto; overflow-y: hidden; position: relative;`
            appBar.id = "appBar";
            dock.append(startMenuButton);
            dock.append(appBar);
            if (batteryDiv && canUseBattery) dock.append(batteryDiv);
            dock.append(clockDiv);

            startMenuButton.onclick = async function() {
                openStartMenu();
            }
            startMenuButton.addEventListener("mouseenter", () => {
                startMenuButton.style.filter = "brightness(0.8)";
            });

            startMenuButton.addEventListener("mouseleave", () => {
                startMenuButton.style.filter = "brightness(1)";
            });

            requestAnimationFrame(async() => {
                const opacity = (await internalFS.getFile("/system/env/systemconfig/settings/customization/dockopac.txt")) || "0.7";
                
                const computed = getComputedStyle(dock);
                const baseColor = computed.backgroundColor;
                const rgbaMatch = baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (rgbaMatch) {
                    const [_, r, g, b] = rgbaMatch;
                    dock.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                } else {
                }
                desktop.style.opacity = "1";
            });

            const coreApps = JSON.parse(await internalFS.getFile("/system/coreapplications"));
            for (const app of coreApps) {
                const appName = app.split("/").pop().slice(0, -3);
                const code = await internalFS.getFile(app);
                await runApp(appName, code, app, undefined, "core");
            }

            const startupApps = JSON.parse(await internalFS.getFile("/system/bootapps"));
            for (const app of startupApps) {
                const appName = app.split("/").pop().slice(0, -3);
                const code = await internalFS.getFile(app);
                await runApp(appName, code, app);
            }
            quantum.document.addEventListener("keyup", async(e) => {
                if (e.code === "KeyT" && e.altKey) {
                    e.preventDefault();
                    const termCode = await internalFS.getFile("/home/applications/Terminal.js");
                    runApp("Terminal.js", termCode, "/home/applications/Terminal.js");
                }
            })

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