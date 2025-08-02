const style = document.createElement("style");
style.textContent = `
    p{
        margin: 0.25em;
        color: white;
    }
`;
const ContextMenu = await importModule("contextmenu");
ContextMenu.disableDefault();
document.body.append(style);
async function loop() {
    let ws;
    let serverList;
    serverList = await huopaAPI.applicationStorageRead("serverlist.json");
    let serverToOpen = await huopaAPI.applicationStorageRead("currentServerOpen.txt");
    let extraConfig = await huopaAPI.applicationStorageRead("config.json");
    if (await huopaAPI.getFile("/home/applications/OriginChats")) await huopaAPI.deleteFile("/home/applications/OriginChats")
    if (!serverList || !JSON.parse(serverList)[0]) {
        firstOpen = true;
        serverList = '["chats.mistium.com"]';
        await huopaAPI.applicationStorageWrite("serverlist.json", "file", serverList);
        serverToOpen = "0"
        await huopaAPI.applicationStorageWrite("currentServerOpen.txt", "file", serverToOpen);
    }
    if (!extraConfig) {
        extraConfig = '{"messageLogger":false,"notifications":false}';
        await huopaAPI.applicationStorageWrite("config.json", "file", extraConfig);
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
        const icon = await huopaAPI.applicationStorageRead(`serverIconStore/${url}`);
        if (!icon) {
            serverList.splice(serverToOpen, 1);
            await huopaAPI.applicationStorageWrite("serverlist.json", "file", JSON.stringify(serverList));
        }
        serverToOpen = "0"
       await huopaAPI.applicationStorageWrite("currentServerOpen.txt", "file", serverToOpen);
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
    let ratelimited = false;
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
    messageArea.style = "position: absolute; right: 0; top: 0; width: calc(100% - 270px); height: 100%;";
    const messageList = document.createElement("div");
    messageList.style = "position: absolute; right: 0; top: 0; width: 100%; height: calc(100% - 5em); display: flex; flex-direction: column-reverse; overflow: auto; overflow-x: hidden;";
    const chatBar = document.createElement("input");
    
    let loading;
    const loadingEl = document.createElement("h2");
    let editingMessage = false; 
    let editedMessageId;
    let validatorKey = undefined;
    let messageTable = {};
    let delAllowed = false;
    let loading2 = false;

    const sidebarEl = document.createElement("div");
   
        let connectedToWS;
        ws.onopen = () => {
            connectedToWS = true;
            console.log("WebSocket connected!");
        }
        await huopaAPI.applicationStorageWrite("currentServerOpen.txt", "file", "0");
        
        await setAttrs(sidebarEl, {
            "style":"position: absolute; width: 50px; height: calc(100% - 5em); left: 0; top: 0; display: flex; flex-direction: column; align-items: center;"
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
                        await huopaAPI.applicationStorageWrite(`serverIconStore/${url}`, "file", server.icon);
                        await huopaAPI.setTitle(`OriginChats - ${server.name}`);
                        loginPrompt();
                        break;
                    case "auth_success":
                        console.log("Successfully authed!");
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
                const response = await fetch(`https://social.rotur.dev/generate_validator?auth=${token}&key=${validatorKey}`);
                if (response.ok) {
                    await huopaAPI.safeStorageWrite("token.txt", "file", token);
                    const responseData = await response.json()
                    auth = responseData.validator;
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
                await huopaAPI.applicationStorageWrite("currentServerOpen.txt", "file", serverToOpen);
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
                    const icon = await huopaAPI.applicationStorageRead(`serverIconStore/${serverUrl}`);
                    const serverIcon = document.createElement("img");
                    await ContextMenu.set(serverIcon, [
                        {
                            name:"Remove",
                            "function":async() => {   
                                const index = serverList.indexOf(serverUrl)
                                if (index !== -1) {
                                    serverList.splice(index, 1);
                                }
                                await huopaAPI.applicationStorageWrite("serverlist.json", "file", JSON.stringify(serverList));
                                serverIcon.remove();
                            }
                        }
                    ])
                    if (icon) {
                        await setAttrs(serverIcon, {
                            "src":icon,
                            "style":"width: 32px; height: 32px; border-radius: 0.5em; margin: 0.5em; cursor: pointer;",
                            "onclick": async () => {
                                await huopaAPI.applicationStorageWrite("currentServerOpen.txt", "file", serverI)
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
                        serverUrlInput.onkeydown = async (e) => {
                            if (e.key === "Enter") {
                                const value = serverUrlInput.value
                                if (value) {
                                    if (serverList.includes(value)) {
                                        await huopaAPI.applicationStorageWrite("currentServerOpen.txt", "file", serverList.indexOf(value))
                                    } else {
                                        serverList.push(value);
                                        await huopaAPI.applicationStorageWrite("serverlist.json", "file", JSON.stringify(serverList));
                                        await huopaAPI.applicationStorageWrite("currentServerOpen.txt", "file", serverList.length - 1)
                                    }
                                    
                                    (mainArea).remove();
                                    (sidebarEl).remove;
                                    ws.close();
                                    loop();
                                } else {
                                    (serverUrlInput).remove();
                                }
                                
                            }
                        };
                        sidebarEl.append(serverUrlInput);
                    }
                });
                sidebarEl.append(addServerButton);
                (loadingEl).remove();
                openedChannel = channelList[0].name;
                if (channel.wallpaper) {
                    bg.style = `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; background-image: url(${channelList[0].wallpaper}); background-size: cover; background-position: center; overflow: hidden;`;
                } else {
                    bg.style = `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden;`;
                }
                wsHandlers.set("ok", (data) => {
                    chatBar.value = "";
                });

                await setAttrs(chatBar, {
                    "style":"position: absolute; left: 50%; transform: translateX(-50%); bottom: 1.2em; width: calc(100% - 50px); padding: 1em; border-radius: 0.5em; background-color: rgba(35, 35, 35, 0.65); border: rgba(105, 105, 105, 0.65) 1px solid; color: white; font-size: 1em;",
                    "placeholder":`Click on a channel to view and send messages!`,
                    "disabled":true
                });
                loading = false;
                const accountDiv = document.createElement("div");
                accountDiv.style = "bottom: 1em; left: -2.75em; height: 3.5em; width: 310px; border: rgba(105, 105, 105, 0.65) 1px solid; border-radius: 0.5em; background-color: rgba(45, 45, 45, 0.65); position: absolute; display: flex; align-items: center;"
                const usernameEl = document.createElement("p");
                await setAttrs(usernameEl, {
                    "textContent":userData.username,
                    "style":"text-align: left; padding: 0;"
                })
                const iconEl = document.createElement("img");
                await setAttrs(iconEl, {
                    "src":`https://avatars.rotur.dev/${userData.username}`,
                    "style":"width: 32px; height: 32px; margin: 0.75em; border-radius: 50%;"
                })
                const signoutButton = document.createElement("img");
                await setAttrs(signoutButton, {
                    "src":"data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-door-open-icon%20lucide-door-open%22%3E%3Cpath%20d%3D%22M11%2020H2%22%2F%3E%3Cpath%20d%3D%22M11%204.562v16.157a1%201%200%200%200%201.242.97L19%2020V5.562a2%202%200%200%200-1.515-1.94l-4-1A2%202%200%200%200%2011%204.561z%22%2F%3E%3Cpath%20d%3D%22M11%204H8a2%202%200%200%200-2%202v14%22%2F%3E%3Cpath%20d%3D%22M14%2012h.01%22%2F%3E%3Cpath%20d%3D%22M22%2020h-3%22%2F%3E%3C%2Fsvg%3E",
                    "style":"position: absolute; right: 0.75em; cursor: pointer;",
                    "onclick":async() => {
                        await huopaAPI.safeStorageWrite("token.txt", "file", undefined);
                        mainDiv.remove();
                        sidebarEl.remove();
                        ws.close()
                        loop();
                        return;
                    }
                })
                accountDiv.append(iconEl);
                accountDiv.append(usernameEl);
                accountDiv.append(signoutButton);
                mainDiv.append(channelListEl);
                mainDiv.append(accountDiv);
                mainDiv.append(messageArea);
                messageArea.append(chatBar);
                messageArea.append(messageList);
                chatBar.onkeydown = async (e) => {
                    if (e.key === "Enter") {
                        if (openedChannel) {
                            const message = chatBar.value;
                            if (!message) {
                                editingMessage = false;
                                editedMessageId = undefined;
                                return;
                            }
                            if (messageLengthLimit && message.length > messageLengthLimit) {
                                chatBar.value = "";
                                chatBar.placeholder = `You can only post messages up to '' characters!`;
                                await new Promise((res) => setTimeout(res, 1000));
                                chatBar.placeholder = `Send a message in "#${openedChannel}" | Max message length: ${messageLengthLimit} characters`;
                            } else {
                                let messageToSend;
                                if (editingMessage) {
                                    messageToSend = `{"cmd":"message_edit", "channel": "${openedChannel}", "content": ${JSON.stringify(message)}, "id":"${editedMessageId}"}`;
                                    editingMessage = false;
                                    editedMessageId = undefined;
                                    chatBar.placeholder = `Send a message in "#${openedChannel}" | Max message length: ${messageLengthLimit} characters`;
                                } else {
                                    messageToSend = `{"cmd":"message_new", "channel": "${openedChannel}", "content": ${JSON.stringify(message)}}`;
                                }
                                
                                ws.send(messageToSend);
                                chatBar.value = "";
                            }
                            
                        }
                    }
                };
                mainDiv.append(bg);
                mainArea.append(mainDiv);

                document.body.append(sidebarEl);
                document.body.append(mainArea);
                console.log("[OriginChats Plugin Manager]: Activating plugins...");
                console.log("[OriginChats Plugin Manager]: Beware of malicious plugins!");
                let pluginList = await huopaAPI.getFile("/home/applications/OriginChats/plugins");
                if (pluginList) {
                    pluginList = JSON.parse(pluginList);
                    for (const pluginPath of pluginList) {
                        const code = await huopaAPI.getFile(pluginPath);
                        console.log("[OriginChats Plugin Manager]: Executing plugin at path: " + pluginPath);
                        (async () => {
                            eval(code);
                        })();
                        
                    }
                } else {
                    console.log("[OriginChats Plugin Manager]: No plugins found.");
                }
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
                    const children = msg.children
                    const textEl = children[1];
                    textEl.style.color = "red";
                } else {
                    (msg).remove();
                }
            
            });

            wsHandlers.set("message_edit", async(data) => {
                if (data.channel !== openedChannel) return;
                const msg = messageTable[data.id];
                const children = msg.children
                const textEl = children[1];
                textEl.textContent = data.content;
            });

            wsHandlers.set("channels_get", async(data) => {
                if (loading2) return;
                loading2 = true;
                channelList = data.val;
                const newChannelListEl = document.createElement("div");
                (channelListEl).remove;
                await setAttrs(newChannelListEl, {
                    "style":"width: 250px; height: calc(100% - 5em); padding: 0; margin: 0; position: absolute; left: 0; top: 0; padding-right: 1.25em; overflow: scroll; overflow-x: hidden;"
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
                    channelDiv.onclick = async() => {
                        try {
                            let viewAllowed
                            for (const role of roles) {
                                if (channelPerms.view.includes(role)) {
                                    viewAllowed = true
                                }
                            }
                            if (!viewAllowed || loading === true) return;
                            messageList.innerHTML = "";
                            if (channel.wallpaper) {
                                bg.style = `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; background-image: url(${channel.wallpaper}); background-size: cover; background-position: center; overflow: hidden;`;
                            } else {
                                bg.style = `position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden;`;
                            }
                            
                            openedChannel = channelSave.name;
                            
                            delAllowed = false;
                            for (const role of roles) {
                                if (channelPerms.delete.includes(role)) {
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
                                chatBar.placeholder = `Send a message in "#${openedChannel}" | Max message length: ${messageLengthLimit} characters`;
                                chatBar.disabled = false;
                            } else {
                                chatBar.disabled = true;
                                chatBar.placeholder = `You cannot send messages in this channel`;
                            }
                            channelMsgs = undefined;
                            await huopaAPI.setTitle(`OriginChats - #${channelSave.name} - ${server.name}`);
                            loading = true;
                            ws.send(`{"cmd":"messages_get", "channel": "${channelSave.name}"}`);
                        } catch (error) {
                            crashError(error);
                        }
                        
                    }
                    if (channel.type === "text") {
                        const channelName = document.createElement("p");
                        await setAttrs(channelName, {
                            "style":"padding: 0.5em; color: white; text-align: left;",
                            "textContent":`# ${channel.name}`
                        });
                        
                        channelDiv.append(channelName);
                    } else if (channel.type === "separator") {
                        channelDiv.style = `padding: ${channel.size / 100}em; width: 100%; margin: 0;`;         
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
                chatBar.placeholder = `You have been ratelimited! You cannot send a message for ${Math.round(data.length / 1000)} seconds`;
                chatBar.disabled = true;
                await new Promise((res) => setTimeout(res, data.length));
                chatBar.disabled = false;
                chatBar.placeholder = `Send a message in "#${openedChannel}" | Max message length: ${messageLengthLimit} characters`;
                ratelimited = false;
            });

            wsHandlers.set("messages_get", async(data) => {
                channelMsgs = data.messages;
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
                    const editButton = document.createElement("button");
                    if (msg.user === userObj.username || delAllowed) {
                        changeButtons = true
                        await setAttrs(deleteButton, {
                            "style":"position: absolute; top: -0.5em; color: red; right: 0.5em; padding: 0.5em 0.75em; display: none;",
                            "textContent":"x",
                            "onclick": async() => {
                                ws.send(`{"cmd":"message_delete", "id":"${msg.id}", "channel":"${openedChannel}"}`)
                            }
                        });
                        await setAttrs(editButton, {
                            "style":"position: absolute; top: -0.5em; color: white; right: 3.5em; padding: 0.5em 0.75em; display: none;",
                            "textContent":"Edit",
                            "onclick": async() => {
                                chatBar.placeholder = `Editing a message... | Max message length: ${messageLengthLimit} characters`;
                                chatBar.value = msg.content;
                                editingMessage = true;
                                editedMessageId = msg.id;
                            }
                        });
                        msgDiv.addEventListener("mouseenter", async() => {
                            if (!ratelimited) {
                                editButton.style.display = "block";
                                deleteButton.style.display = "block";
                            }
                        });
                        msgDiv.addEventListener("mouseleave", async() => {
                            editButton.style.display = "none";
                            deleteButton.style.display = "none";
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
                        const response = await fetch(url);
                        if (response.ok) {
                            const contentType = response.headers.get('Content-Type');
                            if (contentType.startsWith("video/") || contentType.startsWith("image/")) {
                                if (contentType.startsWith("video/")) {
                                    imgEl = document.createElement("video");
                                } else {
                                    imgEl = document.createElement("img");
                                }
                                await setAttrs(imgEl, {
                                    "style":"border-radius: 0.5em; margin: 0.5em; max-height: 20em; max-width: calc(100% - 1em);",
                                    "src":url
                                });
                                msgContent = msgContent.replace(/(https?:\/\/[^\s]+)/, "");
                                text.textContent = msgContent
                            }
                            
                        }
                        
                        
                        
                    }
                    msgDiv.append(user);
                    if (msgContent.length > 0) {
                        msgDiv.append(text);
                    } else {
                        imgEl.style.marginTop = "2.5em";
                    }
                    if (imgEl) msgDiv.append(imgEl);
                    if (changeButtons) {
                        msgDiv.append(editButton);
                        msgDiv.append(deleteButton);
                    }
                    messageList.append(msgDiv);
                }
                loading = false;
            });

            wsHandlers.set("message_new", async(data) => {
                if (data.channel !== openedChannel) return;
                const msg = data.message;
                if (msg.user !== userObj.username && extraConfig.notifications) {
                    huopaAPI.createNotification(`${msg.user} - #${data.channel} - ${server.name}`, msg.content);
                }
                messageList.scrollTop = messageList.scrollHeight;
                const msgDiv = document.createElement("div");
                await setAttrs(msgDiv, {
                    "style":"width: calc(100% - 1em); padding: 0em; background-color: rgba(35, 35, 35, 0.65); margin: 0.5em; position: relative; border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 1px solid;"
                });
                messageTable[msg.id] = msgDiv;
                const user = document.createElement("p");
                const text = document.createElement("p");
                let changeButtons = false;
                const deleteButton = document.createElement("button");
                const editButton = document.createElement("button");
                if (msg.user === userObj.username || delAllowed) {
                    changeButtons = true
                    await setAttrs(deleteButton, {
                        "style":"position: absolute; top: -0.5em; color: red; right: 0.5em; padding: 0.5em 0.75em; display: none;",
                        "textContent":"x",
                        "onclick": async() => {
                            ws.send(`{"cmd":"message_delete", "id":"${msg.id}", "channel":"${openedChannel}"}`)
                        }
                    });
                    await setAttrs(editButton, {
                        "style":"position: absolute; top: -0.5em; color: white; right: 3.5em; padding: 0.5em 0.75em; display: none;",
                        "textContent":"Edit",
                        "onclick": async() => {
                            chatBar.placeholder = `Editing a message... | Max message length: ${messageLengthLimit} characters`;
                            chatBar.value = msg.content;
                            editingMessage = true;
                            editedMessageId = msg.id;
                        }
                    });
                    msgDiv.addEventListener("mouseenter", async() => {
                        if (!ratelimited) {
                            editButton.style.display = "block";
                            deleteButton.style.display = "block";
                        }
                    });
                    msgDiv.addEventListener("mouseleave", async() => {
                        editButton.style.display = "none";
                        deleteButton.style.display = "none";
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
                    const response = await fetch(url);
                    if (response.ok) {
                        const contentType = response.headers.get('Content-Type');
                        if (contentType.startsWith("video/") || contentType.startsWith("image/")) {
                            if (contentType.startsWith("video/")) {
                                imgEl = document.createElement("video");
                            } else {
                                imgEl = document.createElement("img");
                            }
                            await setAttrs(imgEl, {
                                "style":"border-radius: 0.5em; margin: 0.5em; max-height: 20em; max-width: calc(100% - 1em);",
                                "src":url
                            });
                            msgContent = msgContent.replace(/(https?:\/\/[^\s]+)/, "");
                            text.textContent = msgContent
                        }
                        
                    }
                    
                    
                    
                }
                msgDiv.append(user);
                if (msgContent.length > 0) {
                    msgDiv.append(text);
                } else {
                    imgEl.style.marginTop = "2.5em";
                }
                if (imgEl) msgDiv.append(imgEl);
                if (changeButtons) {
                    msgDiv.append(editButton);
                    msgDiv.append(deleteButton);
                }
                messageList.prepend(msgDiv);
            });

        }
        async function checkForDisconnect() {
            if (!connectedToWS) {
                console.log("Disconnected! Attempting to reconnect...");
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

async function uploadFile(fileData) {
    const file = fileData

    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("userhash", "");
    formData.append("time", "72h");
    formData.append("fileToUpload", file, file.name);

    const response = await fetch("https://corsproxy.io/?url=https://litterbox.catbox.moe/resources/internals/api.php", {
    method: "POST",
    body: formData
    });

    if (response.ok) {
        const result = await response.text();
        return result
    } else {
        return false;
    }
}