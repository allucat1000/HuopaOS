let ws = new WebSocket("wss://chats.mistium.com");
ws.onopen = () => huopaAPI.log("WebSocket connected!");
let auth;
let appState = "auth"
let userList;
let userObj;
let userData;
let server;
let userInternalStatus;
let userColors;
let channelPerms
let roles;
let openedChannel;
const mainDiv = await huopaAPI.createElement("div");
const wsHandlers = new Map();
let channelMsgs;
const channelListEl = await huopaAPI.createElement("div");
let channelList;
const bg = await huopaAPI.createElement("div");
const messageArea = await huopaAPI.createElement("div");
await huopaAPI.setAttribute(messageArea, "style", "position: absolute; right: 0; top: 0; width: calc(100% - 270px); height: 100%;");
const messageList = await huopaAPI.createElement("div");
await huopaAPI.setAttribute(messageList, "style", "position: absolute; right: 0; top: 0; width: 100%; height: calc(100% - 5em); display: flex;flex-direction: column-reverse; overflow: auto; overflow-x: hidden;");
const chatBar = await huopaAPI.createElement("input");
let loading;
const loadingEl = await huopaAPI.createElement("h2");
ws.onmessage = async (msg) => {
    if (appState === "auth") {
        await new Promise((res) => setTimeout(res, 1));
        const data = JSON.parse(msg?.data);
        switch (data.cmd) {
            case "handshake":
                server = data.val.server;
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
    const loginDiv = await huopaAPI.createElement("div");
    if (storedToken) token = storedToken;
    if (!storedToken) {
        token = await huopaAPI.openRoturLogin();
        await tryLogin();
    } else {
        tryLogin();
    }
    
    async function tryLogin() {
        const response = await huopaAPI.fetch(`https://social.rotur.dev/generate_validator?auth=${token}&key=originChats-iswt`);
        if (response.ok) {
            await huopaAPI.safeStorageWrite("token.txt", "file", token);
            auth = response.body.validator;
            await huopaAPI.deleteElement(loginDiv);
            ws.send(`{"cmd":"auth","validator":"${auth}"}`);
            await setAttrs(loadingEl, {
                "style":"color: white; text-align: center; margin: 1em auto;",
                "textContent":"Loading..."
            });
            await huopaAPI.appendToApp(loadingEl);
        } else {
            if (storedToken) {
                await huopaAPI.safeStorageWrite("token.txt", "file", undefined);
                await huopaAPI.deleteElement(loginDiv);
                await loginPrompt();
            }
        }
    }
}


async function createMainUI() {
    ws.onmessage = async (msg) => {
        if (appState === "auth") return;
        const data = JSON.parse(msg?.data);
        const handler = wsHandlers.get(data.cmd);
        if (handler) {
            await handler(data);
        } else {
            await huopaAPI.warn(`Unknown CMD sent by server: '${data.cmd}'`);
        }
    };
    while (!userData) {
        await new Promise((res) => setTimeout(res, 10));
    }
    appState = "main";
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
    await huopaAPI.deleteElement(loadingEl);
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
        "style":"position: absolute; left: 50%; transform: translateX(-50%); bottom: 0.92em; width: calc(100% - 43px); padding: 1em; border-radius: 0.5em; background-color: rgba(35, 35, 35, 0.65); border: rgba(105, 105, 105, 0.65) 1px solid;",
        "placeholder":`Click on a channel to view and send messages!`,
        "disabled":true
    });
    loading = false;

    await huopaAPI.append(mainDiv, channelListEl);
    await huopaAPI.append(mainDiv, messageArea);
    await huopaAPI.append(messageArea, chatBar);
    await huopaAPI.append(messageArea, messageList);
    await huopaAPI.setAttribute(chatBar, "onkeypress", async (key) => {
        if (key === "Enter") {
            if (openedChannel) {
                const message = await huopaAPI.getAttribute(chatBar, "value");
                if (!message) return;
                const messageToSend = `{"cmd":"message_new", "channel": "${openedChannel}", "content": ${JSON.stringify(message)}}`;
                ws.send(messageToSend);
                await huopaAPI.setAttribute(chatBar, "value", "");
            }
        }
    });
    await huopaAPI.append(mainDiv, bg);
    await huopaAPI.appendToApp(mainDiv);
}


async function registerFuncs() {
    wsHandlers.set("user_connect", async() => {
        // Test
    })

    wsHandlers.set("user_disconnect", async() => {
        // hmarbrugrer
    })
    
    
    await setAttrs(channelListEl, {
        "style":"width: 250px; height: calc(100%); padding: 0; margin: 0; position: absolute; left: 0; top: 0; background-color: rgba(0, 0, 0, 0.2); padding-right: 1.25em; overflow: scroll; overflow-x: hidden;"
    });
    
    wsHandlers.set("ping", () => {
        // Pong!
    });

    ws.onclose = async () => {
        await huopaAPI.deleteElement(mainDiv);
        await new Promise((res) => setTimeout(res, 1000));
        const error = await huopaAPI.createElement("h2");
        await setAttrs(error, {
            "textContent":"You have disconnected from the websocket! Try reconnecting soon.",
            "style":"color: white; text-align: center; margin: 1em;"
        })
        await huopaAPI.appendToApp(error);
    }

    wsHandlers.set("users_list", async(data) => {
        const users = data.users;
        userColors = {};
        for (user of users) {
            const name = user.username;
            userColors[name] = user.color;
        }
    });
    wsHandlers.set("channels_get", async(data) => {
        channelList = data.val;
        await huopaAPI.setAttribute(channelListEl, "innerHTML", "");
        const serverInfo = await huopaAPI.createElement("div");
        await setAttrs(serverInfo, {
            "style":"background-color: rgba(45, 45, 45, 0.5); border-radius: 0.25em; margin-bottom: 0.5em; width: 100%; margin: 1em 0.5em; margin-top: 0.5em; display: flex; align-items: center; border: rgba(105, 105, 105, 0.65) 1px solid;"
        });
        const serverName = await huopaAPI.createElement("p");
        await setAttrs(serverName, {
            "textContent":server.name,
            "style":"color: white; padding: 1em; display: inline;"
        });
        const serverIcon = await huopaAPI.createElement("img");
        await setAttrs(serverIcon, {
            "src":server.icon,
            "style":"display: inline; border-radius: 0.25em; width: 32px; height: 32px; margin-left: 0.66em;"
        });
        await huopaAPI.append(serverInfo, serverIcon);
        await huopaAPI.append(serverInfo, serverName);
        await huopaAPI.append(channelListEl, serverInfo);

        for (channel of channelList) {
            const channelDiv = await huopaAPI.createElement("div");
            await setAttrs(channelDiv, {
                "style":"padding: 0; width: 100%; margin: 0.5em; background-color: rgba(45, 45, 45, 0.5); border-radius: 0.25em; border: rgba(105, 105, 105, 0.65) 1px solid; cursor: pointer;",
            });
            const channelSave = channel;
            channelPerms = channelSave.permissions;
            await huopaAPI.setAttribute(channelDiv, "onclick", async() => {
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
                
                let sendAllowed = false;
                for (const role of roles) {
                    if (channelPerms.send.includes(role)) {
                        sendAllowed = true
                    }
                }
                if (sendAllowed) {
                    await huopaAPI.setAttribute(chatBar, "placeholder", `Send a message in "#${openedChannel}"`);
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
                
                for (msg of channelMsgs) {
                    const msgDiv = await huopaAPI.createElement("div");
                    await setAttrs(msgDiv, {
                        "style":"width: calc(100% - 1em); padding: 0em; background-color: rgba(35, 35, 35, 0.65); margin: 0.5em; position: relative; border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 1px solid;",
                        "id":msg.id
                    });
                    const user = await huopaAPI.createElement("p");
                    const text = await huopaAPI.createElement("p");
                    await setAttrs(user, {
                        "style":`position: absolute; left: 0.5em; top: 0.5em; padding: 0em; color: ${userColors[msg.user]}; text-align: left; text-wrap: wrap;`,
                        "textContent":msg.user
                    });
                    await setAttrs(text, {
                        "style":"padding: 2.5em 0.5em 1em;; color: white; text-align: left; text-wrap: wrap;",
                        "textContent":msg.content
                    });
                    await huopaAPI.append(msgDiv, user);
                    await huopaAPI.append(msgDiv, text);
                    await huopaAPI.append(messageList, msgDiv);
                }
                loading = false;
            })
            if (channel.type === "text") {
                const channelName = await huopaAPI.createElement("p");
                await setAttrs(channelName, {
                    "style":"padding: 0.5em; color: white; text-align: left;",
                    "textContent":`# ${channel.name}`
                });
                
                await huopaAPI.append(channelDiv, channelName);
            } else if (channel.type === "separator") {
                await huopaAPI.setAttribute(channelDiv, "style", `padding: ${channel.size / 100}em; width: 100%; margin: 0;`);         
            }
            
            await huopaAPI.append(channelListEl, channelDiv);
        };
    });

    wsHandlers.set("error", (data) => {
        huopaAPI.error(JSON.stringify(data));
    });

    wsHandlers.set("messages_get", (data) => {
        channelMsgs = data.messages;
    });

    wsHandlers.set("message_new", async(data) => {
        if (data.channel !== openedChannel) return;
        const msg = data.message;
        const msgDiv = await huopaAPI.createElement("div");
        await setAttrs(msgDiv, {
            "style":"width: calc(100% - 1em); padding: 0em; background-color: rgba(35, 35, 35, 0.65); margin: 0.5em; position: relative; border-radius: 0.5em; border: rgba(105, 105, 105, 0.65) 1px solid;",
            "id":msg.id
        });
        const user = await huopaAPI.createElement("p");
        const text = await huopaAPI.createElement("p");
        const deleteButton = await huopaAPI.createElement("img");
        await setAttrs(user, {
            "style":`position: absolute; left: 0.5em; top: 0.5em; padding: 0em; color: ${userColors[msg.user]}; text-align: left; text-wrap: wrap;`,
            "textContent":msg.user
        });
        await setAttrs(text, {
            "style":"padding: 2.5em 0.5em 1em;; color: white; text-align: left; text-wrap: wrap;",
            "textContent":msg.content
        });
        await huopaAPI.append(msgDiv, user);
        await huopaAPI.append(msgDiv, text);
        await huopaAPI.prepend(messageList, msgDiv);
    });

}
