let ws;
let onMsgFunc;
let userList;
let validatorKey;
let maxMessageLength;
let server;
let auth;
let userData;
let channelData;
return {
    connect: async(url) => {
        ws = new WebSocket(url);

        ws.onmessage = async (msg) => {
            const data = JSON.parse(msg?.data)
            switch (data.cmd) {
                case "handshake":
                    maxMessageLength = data.val.limits?.post_content;
                    if (!maxMessageLength) maxMessageLength = 65536;
                    validatorKey = (data.val.validator_key);
                    server = data.val.server;
                    break;
                case "auth_success":
                    huopaAPI.log("originChats: Successfully authed!");
                    break;
                case "ready":
                    userData = data.user;
                    break;
                case "message_new":
                    if (!onMsgFunc) return;
                    onMsgFunc(data);
                    break;
                case "users_list":
                    userList = data.users;
                case "error":
                    await huopaAPI.error(JSON.stringify(data.val));
                    break;
                case "messages_get":
                    channelData = data.messages;
                    break;
                case "rate_limit":
                    console.error(`originChats: You have been ratelimited by the server for: ${data.length / 1000} seconds!`)
                    break;
                default:
                    break;
            }
        }
        while (!validatorKey) {
            await new Promise((res) => setTimeout(res, 10));
        }
        
    },

    send: (content, channel) => {
        const messageToSend = `{"cmd":"message_new", "channel":"${channel}", "content":"${content}"}`
        huopaAPI.log(messageToSend);
        ws.send(messageToSend);
    },

    onNewMessage: (func) => {
        onMsgFunc = func;
    },

    login: async(token) => {
        const response = await huopaAPI.fetch(`https://social.rotur.dev/generate_validator?auth=${token}&key=${validatorKey}`);
        if (response.ok) {
            auth = response.body.validator;
            ws.send(`{"cmd":"auth","validator":"${auth}"}`);
            while (!userData) {
                await new Promise((res) => setTimeout(res, 10));
            }
        } else {
            await huopaAPI.error("originChats: Incorrect login credentials!");
        }
    },

    getParameter: (param) => {
        return [param];
    },

    getChannelMessages: async(channel) => {
        ws.send(`{"cmd":"messages_get", "channel":"${channel}"`);
        while (!channelData) {
            await new Promise((res) => setTimeout(res, 10));
        }
        return channelData;
    }
}
