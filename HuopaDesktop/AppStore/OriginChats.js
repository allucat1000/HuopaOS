async function loop() {
    let ws;
    let serverList;
    serverList = await huopaAPI.getFile("/home/applications/OriginChats/serverlist.json");
    let serverToOpen = await huopaAPI.getFile("/home/applications/OriginChats/currentServerOpen.txt");
    let extraConfig = await huopaAPI.getFile("/home/applications/OriginChats/config.json");;
    if (!serverList) {
        firstOpen = true;
        serverList = '["chats.mistium.com"]';
        await huopaAPI.writeFile("/home/applications/OriginChats/serverlist.json", "file", serverList);
        serverToOpen = "0"
        await huopaAPI.writeFile("/home/applications/OriginChats/currentServerOpen.txt", "file", serverToOpen);
    }
    if (!extraConfig) {
        extraConfig = '{"messageLogger":false,"notifications":false}';
        await huopaAPI.writeFile("/home/applications/OriginChats/config.json", "file", extraConfig);
    }
    serverList = JSON.parse(serverList);
    extraConfig = JSON.parse(extraConfig);
    let url = serverList[serverToOpen];
    try {
        ws = new WebSocket("wss://" + url);
    } catch (error) {
        connectError();
        return;
    }
    async function connectError() {
        const icon = await huopaAPI.getFile(`/home/applications/OriginChats/serverIconStore/${url}`);
        if (!icon) {
            serverList.splice(serverToOpen, 1);
            await huopaAPI.writeFile("/home/applications/OriginChats/serverlist.json", "file", JSON.stringify(serverList));
        }
        serverToOpen = "0"
        await huopaAPI.writeFile("/home/applications/OriginChats/currentServerOpen.txt", "file", serverToOpen);
        const errorMsg = document.createElement("h2");
        await huopaAPI.setTitle("OriginChats - Failed to connect to server");
        await setAttrs(errorMsg, {
            "textContent":"Unable to connect to the server, check whether this is the correct URL. If it is, contact the server owner / administrators for more info. Returning to menu in 3 seconds...",
            "style":"color: white; margin: 1em; text-align: center;"
        })
        document.body.append(errorMsg);
        await new Promise((res) => setTimeout(res, 3000));
        errorMsg.remove();
        loop();
        return;
    }
    ws.onerror = async() => {
        connectError();
        return;
    }
    let auth;
    let appState = "auth"
    let userList;
    let ratelimited;
    let userObj;
    let userData;
    let server;
    let messageLengthLimit;
    let userColors;
    let roles;
    let openedChannel;
    const mainDiv = document.createElement("div");
    const wsHandlers = new Map();
    let channelMsgs;
    let channelListEl = document.createElement("div");
    let channelList;
    const bg = document.createElement("div");
    const messageArea = document.createElement("div");
    await huopaAPI.setAttribute(messageArea, "style", "position: absolute; right: 0; top: 0; width: calc(100% - 270px); height: 100%;");
    const messageList = document.createElement("div");
    await huopaAPI.setAttribute(messageList, "style", "position: absolute; right: 0; top: 0; width: 100%; height: calc(100% - 5em); display: flex;flex-direction: column-reverse; overflow: auto; overflow-x: hidden;");
    const chatBar = document.createElement("input");
    let loading;
    const loadingEl = document.createElement("h2");
    let editingMessage = false; 
    let validatorKey = undefined;
    let messageTable = {};
    let delAllowed = false;
    let loading2 = false;
    const sidebarEl = document.createElement("div");
   
        let connectedToWS;
        ws.onopen = () => {
            connectedToWS = true;
            huopaAPI.log("WebSocket connected!");
        }
        await huopaAPI.writeFile("/home/applications/OriginChats/currentServerOpen.txt", "file", "0");
        
        await setAttrs(sidebarEl, {
            "style":"position: absolute; width: 50px; height: calc(100%); left: 0; top: 0; display: flex; flex-direction: column; align-items: center;"
        });
        const userArea = document.createElement("div");
        await setAttrs(userArea, {
            "style":""
        }) 
        const mainArea = document.createElement("div");
        await setAttrs(mainArea, {
            "style":"position: absolute; right: 0; top: 0; width: calc(100% - 34px - 1em); height: 100%;"
        });

        ws.onmessage = async (msg) => {
            if (appState === "auth") {
                await new Promise((res) => setTimeout(res, 1));
                const data = JSON.parse(msg?.data);
                switch (data.cmd) {
                    case "handshake":
                        messageLengthLimit = data.val.limits?.post_content;
                        if (!messageLengthLimit) messageLengthLimit = 65536;
                        validatorKey = (data.val.validator_key);
                        server = data.val.server;
                        await huopaAPI.writeFile(`/home/applications/OriginChats/serverIconStore/${url}`, "file", server.icon);
                        await huopaAPI.setTitle(`OriginChats - ${server.name}`);
                        loginPrompt();
                        break;
                    case "auth_success":
                        huopaAPI.log("Successfully authed!");
                        createMainUI();
                        break;
                    case "ready":
                        userData = data.user;
                        break;
                    case "user_connect":
                        break;
                    default:
                        huopaAPI.warn(`Unknown CMD sent by server: '${data.cmd}' (in auth state)`);
                        break;
                }
            }
            
        };

        async function loginPrompt() {
            registerFuncs();
            const storedToken = await huopaAPI.safeStorageRead("token.txt");
            let token;
            const loginDiv = document.createElement("div");
            if (storedToken) token = storedToken;
            if (!storedToken) {
                token = await huopaAPI.openRoturLogin();
                await tryLogin();
            } else {
                tryLogin();
            }
            
            async function tryLogin() {
                const response = await huopaAPI.fetch(`https://social.rotur.dev/generate_validator?auth=${token}&key=${validatorKey}`);
                if (response.ok) {
                    await huopaAPI.safeStorageWrite("token.txt", "file", token);
                    auth = response.body.validator;
                    loginDiv.remove();
                    ws.send(`{"cmd":"auth","validator":"${auth}"}`);
                    await setAttrs(loadingEl, {
                        "style":"color: white; text-align: center; position: absolute; left: 50%; top: calc(50% - 25px); transform: translate(-50%, -50%);",
                        "textContent":"Loading..."
                    });
                    document.body.append(loadingEl);
                } else {
                    if (storedToken) {
                        await huopaAPI.safeStorageWrite("token.txt", "file", undefined);
                        (loginDiv).remove();
                        await loginPrompt();
                    }
                }
            }
        }


        async function createMainUI() {
            try {
                ws.onmessage = async (msg) => {
                    try {
                        if (appState !== "auth") {
                            const data = JSON.parse(msg?.data);
                            const handler = wsHandlers.get(data.cmd);
                            if (handler) {
                                await handler(data);
                            } else {
                                await huopaAPI.warn(`Unknown CMD sent by server: '${data.cmd}'`);
                            }
                        }
                    } catch (error) {
                        crashError(error);
                    }
                    
                    
                };
                while (!userData) {
                    await new Promise((res) => setTimeout(res, 10));
                }
                appState = "main";
                await huopaAPI.writeFile("/home/applications/OriginChats/currentServerOpen.txt", "file", serverToOpen);
                userObj = userData;
                roles = userObj.roles;
                ws.send('{"cmd":"users_list"}');
                while (!userColors) {
                    await new Promise((res) => setTimeout(res, 10));
                }
                
                ws.send('{"cmd":"channels_get"}');
                while (!channelList) {
                    await new Promise((res) => setTimeout(res, 10));
                }
                for (const serverI in serverList) {
                    const serverUrl = serverList[serverI];
                    const icon = await huopaAPI.getFile(`/home/applications/OriginChats/serverIconStore/${serverUrl}`);
                    const serverIcon = document.createElement("img");
                    if (icon) {
                        await setAttrs(serverIcon, {
                            "src":icon,
                            "style":"width: 32px; height: 32px; border-radius: 0.5em; margin: 0.5em; cursor: pointer;",
                            "onclick": async () => {
                                await huopaAPI.writeFile("/home/applications/OriginChats/currentServerOpen.txt", "file", serverI)
                                mainArea.remove();
                                sidebarEl.remove();
                                ws.close();
                                loop();
                            }
                        });
                       sidebarEl.append(serverIcon);
                    }
                    
                }
                const addServerButton = document.createElement("button");
                
                await setAttrs(addServerButton, {
                    "style":"width: 36px; height: 36px; border-radius: 0.5em; background-color: rgba(35, 35, 35, 0.5); border: rgba(105, 105, 105, 0.65) 1px solid; color: white; padding: 0;",
                    "textContent":"+",
                    "onclick": async() => {
                        const serverUrlInput = document.createElement("input");
                        await setAttrs(serverUrlInput, {
                            "style":"width: 1000%; height: 45px; position: absolute; right: -825px; padding: 0.5em; top: 50%; transform: translateY(-50%); z-index: 9999;",
                            "placeholder":"Enter a server URL here (example: 'myserver.myusername.com'):"
                        });
                        await huopaAPI.setAttribute(serverUrlInput, "onkeypress", async (key) => {
                            if (key === "Enter") {
                                const value = await huopaAPI.getAttribute(serverUrlInput, "value")
                                if (value) {
                                    if (serverList.includes(value)) {
                                        await huopaAPI.writeFile("/home/applications/OriginChats/currentServerOpen.txt", "file", serverList.indexOf(value))
                                    } else {
                                        serverList.push(value);
                                        await huopaAPI.writeFile("/home/applications/OriginChats/serverlist.json", "file", JSON.stringify(serverList));
                                        await huopaAPI.writeFile("/home/applications/OriginChats/currentServerOpen.txt", "file", serverList.length - 1)
                                    }
                                    
                                    (mainArea).remove();
                                    (sidebarEl).remove;
                                    ws.close();
                                    loop();
                                } else {
                                    (serverUrlInput).remove();
                                }
                                
                            }
                        });
                        sidebarEl.append(serverUrlInput);
                    }
                });
                sidebarEl.append(addServerButton);
                (loadingEl).remove();
                openedChannel = channelList[0].name;
                if (channel.wallpaper) {
                    await huopaAPI.setAttribute(bg, "style", `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; background-image: url(${channelList[0].wallpaper}); background-size: cover; background-position: center; overflow: hidden;`);
                } else {
                    await huopaAPI.setAttribute(bg, "style", `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden;`);
                }
                openedChannel = undefined;
                wsHandlers.set("ok", (data) => {
                    huopaAPI.setAttribute(chatBar, "value", "");
                });

                await setAttrs(chatBar, {
                    "style":"position: absolute; left: 50%; transform: translateX(-50%); bottom: 1.2em; width: calc(100% - 50px); padding: 1em; border-radius: 0.5em; background-color: rgba(35, 35, 35, 0.65); border: rgba(105, 105, 105, 0.65) 1px solid;",
                    "placeholder":`Click on a channel to view and send messages!`,
                    "disabled":true
                });
                loading = false;

                mainDiv.append(channelListEl);
                mainDiv.append(messageArea);
                messageArea.append(chatBar);
                messageArea.append(messageList);
                await huopaAPI.setAttribute(chatBar, "onkeypress", async (key) => {
                    if (key === "Enter") {
                        if (openedChannel) {
                            const message = await huopaAPI.getAttribute(chatBar, "value");
                            if (!message) return;
                            if (messageLengthLimit && message.length > messageLengthLimit) {
                                await huopaAPI.setAttribute(chatBar, "value", "");
                                await huopaAPI.setAttribute(chatBar, "placeholder", `You can only post messages up to '' characters!`);
                                await new Promise((res) => setTimeout(res, 1000));
                                await huopaAPI.setAttribute(chatBar, "placeholder", `Send a message in "#${openedChannel}" | Max message length: ${messageLengthLimit} characters`);
                            } else {
                                const messageToSend = `{"cmd":"message_new", "channel": "${openedChannel}", "content": ${JSON.stringify(message)}}`;
                                ws.send(messageToSend);
                                await huopaAPI.setAttribute(chatBar, "value", "");
                            }
                            
                        }
                    }
                });
                mainDiv.append(bg);
                mainArea.append(mainDiv);

                document.body.append(sidebarEl);
                document.body.append(mainArea);
            } catch (error) {
                crashError(error)
            }
            
        }


        async function registerFuncs() {
            wsHandlers.set("user_connect", async() => {
                // Test
            })

            wsHandlers.set("user_disconnect", async() => {
                // hmarbrugrer
            })
            
            
            wsHandlers.set("ping", () => {
                // Pong!
            });

            ws.onclose = async () => {
                roles = undefined;
                await new Promise((res) => setTimeout(res, 15000));
                await checkForDisconnect();
            }

            wsHandlers.set("users_list", async(data) => {
                const users = data.users;
                userColors = {};
                for (const user of users) {
                    const name = user.username;
                    userColors[name] = user.color;
                }
            });

            wsHandlers.set("message_delete", async(data) => {
                if (data.channel !== openedChannel) return;
                const msg = messageTable[data.id];
                if (extraConfig.messageLogger) {
                    const children = await huopaAPI.getChildren(msg)
                    const textEl = children[1];
                    await huopaAPI.setCertainStyle(textEl, "color", "red");
                } else {
                    (msg).remove();
                }
            
            });

            wsHandlers.set("message_edit", async(data) => {
                if (data.channel !== openedChannel) return;
                const msg = messageTable[data.id];
                const children = await huopaAPI.getChildren(msg)
                const textEl = children[1];
                await huopaAPI.setAttribute(textEl, "textContent", msg.content);
            });

            wsHandlers.set("channels_get", async(data) => {
                if (loading2) return;
                loading2 = true;
                channelList = data.val;
                const newChannelListEl = document.createElement("div");
                (channelListEl).remove;
                await setAttrs(newChannelListEl, {
                    "style":"width: 250px; height: calc(100%); padding: 0; margin: 0; position: absolute; left: 0; top: 0; background-color: rgba(0, 0, 0, 0.2); padding-right: 1.25em; overflow: scroll; overflow-x: hidden;"
                });
                const serverInfo = document.createElement("div");
                await setAttrs(serverInfo, {
                    "style":"background-color: rgba(45, 45, 45, 0.5); border-radius: 0.5em; margin-bottom: 0.5em; width: 100%; margin: 1em 0.5em; margin-top: 0.5em; display: flex; align-items: center; border: rgba(105, 105, 105, 0.65) 1px solid;"
                });
                const serverName = document.createElement("p");
                await setAttrs(serverName, {
                    "textContent":server.name,
                    "style":"color: white; padding: 1em; display: inline;"
                });
                const serverIcon = document.createElement("img");
                await setAttrs(serverIcon, {
                    "src":server.icon,
                    "style":"display: inline; border-radius: 0.5em; width: 32px; height: 32px; margin-left: 0.66em;"
                });
                serverInfo.append(serverIcon);
                serverInfo.append(serverName);
                newChannelListEl.append(serverInfo);

                for (channel of channelList) {
                    const channelDiv = document.createElement("div");
                    await setAttrs(channelDiv, {
                        "style":"padding: 0; width: 100%; margin: 0.5em; background-color: rgba(45, 45, 45, 0.5); border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 1px solid; cursor: pointer;",
                    });
                    const channelSave = channel;
                    const channelPerms = channelSave.permissions;
                    await huopaAPI.setAttribute(channelDiv, "onclick", async() => {
                        try {
                            let viewAllowed
                            for (const role of roles) {
                                if (channelPerms.view.includes(role)) {
                                    viewAllowed = true
                                }
                            }
                            if (!viewAllowed || loading === true) return;
                            await huopaAPI.setAttribute(messageList, "innerHTML", "");
                            if (channel.wallpaper) {
                                await huopaAPI.setAttribute(bg, "style", `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; background-image: url(${channel.wallpaper}); background-size: cover; background-position: center; overflow: hidden;`);
                            } else {
                                await huopaAPI.setAttribute(bg, "style", `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden;`);
                            }
                            
                            openedChannel = channelSave.name;
                            
                            delAllowed = false;
                            for (const role of roles) {
                                if (channelPerms.send.includes(role)) {
                                    delAllowed = true
                                }
                            }
                            let sendAllowed
                            for (const role of roles) {
                                if (channelPerms.send.includes(role)) {
                                    sendAllowed = true
                                }
                            }
                            if (sendAllowed === true) {
                                await huopaAPI.setAttribute(chatBar, "placeholder", `Send a message in "#${openedChannel}" | Max message length: ${messageLengthLimit} characters`);
                                await huopaAPI.setAttribute(chatBar, "disabled", false);
                            } else {
                                await huopaAPI.setAttribute(chatBar, "disabled", true);
                                await huopaAPI.setAttribute(chatBar, "placeholder", `You cannot send messages in this channel`);
                            }
                            channelMsgs = undefined;
                            await huopaAPI.setTitle(`OriginChats - #${channelSave.name} - ${server.name}`);
                            loading = true;
                            ws.send(`{"cmd":"messages_get", "channel": "${channelSave.name}"}`);
                            while (!channelMsgs) {
                                await new Promise((res) => setTimeout(res, 10));
                            }
                            channelMsgs = channelMsgs.reverse();
                            
                            for (const msg of channelMsgs) {
                                const msgDiv = document.createElement("div");
                                                
                                await setAttrs(msgDiv, {
                                    "style":"width: calc(100% - 1em); padding: 0em; background-color: rgba(35, 35, 35, 0.65); margin: 0.5em; position: relative; border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 1px solid;"
                                });
                                messageTable[msg.id] = msgDiv;
                                const user = document.createElement("p");
                                const text = document.createElement("p");
                                let changeButtons = false;
                                const deleteButton = document.createElement("button");
                                if (msg.user === userObj.username || delAllowed) {
                                    changeButtons = true
                                    await setAttrs(deleteButton, {
                                        "style":"position: absolute; top: -0.5em; color: red; right: 0.5em; padding: 0.5em 0.75em; display: none;",
                                        "textContent":"x",
                                        "onclick": async() => {
                                            ws.send(`{"cmd":"message_delete", "id":"${msg.id}", "channel":"${openedChannel}"}`)
                                        }
                                    });
                                    await huopaAPI.addEventListener(msgDiv, "mouseenter", async() => {
                                        if (!ratelimited) {
                                            await huopaAPI.setCertainStyle(deleteButton, "display", "block");
                                        }
                                    });
                                    await huopaAPI.addEventListener(msgDiv, "mouseleave", async() => {
                                        await huopaAPI.setCertainStyle(deleteButton, "display", "none");
                                    });
                                }
                                await setAttrs(user, {
                                    "style":`position: absolute; left: 0.5em; top: 0.5em; padding: 0em; color: ${userColors[msg.user]}; text-align: left; text-wrap: wrap;`,
                                    "textContent":msg.user
                                });
                                await setAttrs(text, {
                                    "style":"padding: 2.5em 0.5em 1em;; color: white; text-align: left; text-wrap: wrap; user-select: text;",
                                    "textContent":msg.content
                                });
                                const urlRegex = /(?<!<)https?:\/\/[^\s>]+(?!>)/g;
                                const match = msg.content.match(urlRegex);
                                let msgContent = msg.content;
                                let imgEl;
                                if (match) {
                                    let url = match[0];
                                    if (!url) return
                                    const extRegex = /\.(png|jpe?g|gif|bmp|webp|tiff)$/i;
                                    const extMatch = url.match(extRegex);
                                    if (!extMatch) url = url + ".gif";
                                    url = "https://proxy.mistium.com/?url=" + url;
                                    const response = await huopaAPI.fetch(url);
                                    if (response.ok) {
                                        if (response.contentType.startsWith("video/") || response.contentType.startsWith("image/")) {
                                            if (response.contentType.startsWith("video/")) {
                                                imgEl = document.createElement("video");
                                            } else {
                                                imgEl = document.createElement("img");
                                            }
                                            await setAttrs(imgEl, {
                                                "style":"border-radius: 0.5em; margin: 0.5em; max-width: calc(100% - 1em);",
                                                "src":url
                                            });
                                            msgContent = msgContent.replace(/(https?:\/\/[^\s]+)/, "");
                                            await huopaAPI.setAttribute(text, "textContent", msgContent)
                                        }
                                        
                                    }
                                    
                                    
                                    
                                }
                                msgDiv.append(user);
                                if (msgContent.length > 0) {
                                    msgDiv.append(text);
                                } else {
                                    await huopaAPI.setCertainStyle(imgEl, "marginTop", "2.5em");
                                }
                                if (imgEl) {msgDiv.append(imgEl);}
                                if (changeButtons) {
                                    msgDiv.append(deleteButton);
                                }
                                messageList.append(msgDiv);
                            }
                            loading = false;
                        } catch (error) {
                            crashError(error);
                        }
                        
                    })
                    if (channel.type === "text") {
                        const channelName = document.createElement("p");
                        await setAttrs(channelName, {
                            "style":"padding: 0.5em; color: white; text-align: left;",
                            "textContent":`# ${channel.name}`
                        });
                        
                        channelDiv.append(channelName);
                    } else if (channel.type === "separator") {
                        await huopaAPI.setAttribute(channelDiv, "style", `padding: ${channel.size / 100}em; width: 100%; margin: 0;`);         
                    }
                    
                    newChannelListEl.append(channelDiv);
                    bg.append(newChannelListEl);
                    channelListEl = newChannelListEl
                    loading2 = false;
                };
            });

            wsHandlers.set("error", async(data) => {
                huopaAPI.error(JSON.stringify(data));
            });

            wsHandlers.set("rate_limit", async(data) => {
                ratelimited = true;
                await huopaAPI.setAttribute(chatBar, "placeholder", `You have been ratelimited! You cannot send a message for ${Math.round(data.length / 1000)} seconds`);
                await huopaAPI.setAttribute(chatBar, "disabled", true);
                await new Promise((res) => setTimeout(res, data.length));
                await huopaAPI.setAttribute(chatBar, "disabled", false);
                await huopaAPI.setAttribute(chatBar, "placeholder",`Send a message in "#${openedChannel}" | Max message length: ${messageLengthLimit} characters`);
                ratelimited = false;
            });

            wsHandlers.set("messages_get", (data) => {
                channelMsgs = data.messages;
            });

            wsHandlers.set("message_new", async(data) => {
                if (data.channel !== openedChannel) return;
                const msg = data.message;
                if (msg.user !== userObj.username && extraConfig.notifications) {
                    huopaAPI.createNotification(`${msg.user} - #${data.channel} - ${server.name}`, msg.content);
                }
                await huopaAPI.setAttribute(messageList, "scrollTop", await huopaAPI.getAttribute(messageList, "scrollHeight"));
                const msgDiv = document.createElement("div");
                await setAttrs(msgDiv, {
                    "style":"width: calc(100% - 1em); padding: 0em; background-color: rgba(35, 35, 35, 0.65); margin: 0.5em; position: relative; border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 1px solid;"
                });
                messageTable[msg.id] = msgDiv;
                const user = document.createElement("p");
                const text = document.createElement("p");
                let changeButtons = false;
                const deleteButton = document.createElement("button");
                if (msg.user === userObj.username || delAllowed) {
                    changeButtons = true
                    await setAttrs(deleteButton, {
                        "style":"position: absolute; top: -0.5em; color: red; right: 0.5em; padding: 0.5em 0.75em; display: none;",
                        "textContent":"x",
                        "onclick": async() => {
                            ws.send(`{"cmd":"message_delete", "id":"${msg.id}", "channel":"${openedChannel}"}`)
                        }
                    });
                    await huopaAPI.addEventListener(msgDiv, "mouseenter", async() => {
                        if (!ratelimited) {
                            await huopaAPI.setCertainStyle(deleteButton, "display", "block");
                        }
                    });
                    await huopaAPI.addEventListener(msgDiv, "mouseleave", async() => {
                        await huopaAPI.setCertainStyle(deleteButton, "display", "none");
                    });
                }
                await setAttrs(user, {
                    "style":`position: absolute; left: 0.5em; top: 0.5em; padding: 0em; color: ${userColors[msg.user]}; text-align: left; text-wrap: wrap;`,
                    "textContent":msg.user
                });
                await setAttrs(text, {
                    "style":"padding: 2.5em 0.5em 1em;; color: white; text-align: left; text-wrap: wrap; user-select: text;",
                    "textContent":msg.content
                });
                const urlRegex = /(?<!<)https?:\/\/[^\s>]+(?!>)/g;
                const match = msg.content.match(urlRegex);
                let msgContent = msg.content;
                let imgEl;
                if (match) {
                    let url = match[0];
                    if (!url) return
                    const extRegex = /\.(png|jpe?g|gif|bmp|webp|tiff)$/i;
                    const extMatch = url.match(extRegex);
                    if (!extMatch) url = url + ".gif";
                    url = "https://proxy.mistium.com/?url=" + url;
                    const response = await huopaAPI.fetch(url);
                    if (response.ok) {
                        if (response.contentType.startsWith("video/") || response.contentType.startsWith("image/")) {
                            if (response.contentType.startsWith("video/")) {
                                imgEl = document.createElement("video");
                            } else {
                                imgEl = document.createElement("img");
                            }
                            await setAttrs(imgEl, {
                                "style":"border-radius: 0.5em; margin: 0.5em; max-width: calc(100% - 1em);",
                                "src":url
                            });
                            msgContent = msgContent.replace(/(https?:\/\/[^\s]+)/, "");
                            await huopaAPI.setAttribute(text, "textContent", msgContent)
                        }
                        
                    }
                    
                    
                    
                }
                msgDiv.append(user);
                if (msgContent.length > 0) {
                    msgDiv.append(text);
                } else {
                    await huopaAPI.setCertainStyle(imgEl, "marginTop", "2.5em");
                }
                if (imgEl) msgDiv.append(imgEl);
                if (changeButtons) {
                    msgDiv.append(deleteButton);
                }
                messageList.prepend(msgDiv);
            });

        }
        async function checkForDisconnect() {
            if (!connectedToWS) {
                await huopaAPI.log("Disconnected! Attempting to reconnect...");
                (mainDiv).remove();
                (sidebarEl).remove();
                loop();
                return;
            }
        }

    

}

loop();

async function crashError(error) {
    const errorText = document.createElement("h2");
    await setAttrs(errorText, {
        "textContent":`Whoopsies! Your client has crashed, error log: ${error}`,
        "style":"color: white; text-align: center; margin: 1em;"
    });
    const retryButton = document.createElement("button");
    await setAttrs(retryButton, {
        "textContent":"Reload",
        "onclick": async() => {
            (errorText).remove();
            (retryButton).remove();
            loop();
            return;
        }
    })
}
