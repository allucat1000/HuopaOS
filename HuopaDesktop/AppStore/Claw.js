const title = await huopaAPI.createElement("h1");
await huopaAPI.setAttribute(title, "textContent", "Claw Feed");
await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
await huopaAPI.appendToApp(title);
const postCreateDiv = await huopaAPI.createElement("div");
const loginButton = await huopaAPI.createElement("button");
await huopaAPI.setAttribute(loginButton, "textContent", "Login with Rotur");
await huopaAPI.setCertainStyle(loginButton, "position", "absolute");
await huopaAPI.setCertainStyle(loginButton, "top", "0.5em");
await huopaAPI.setCertainStyle(loginButton, "right", "0.5em");
await huopaAPI.appendToApp(loginButton);
await huopaAPI.appendToApp(postCreateDiv);
const loadingText = await huopaAPI.createElement("h3");
await huopaAPI.setAttribute(loadingText, "textContent", "Loading Claw feed...");
await huopaAPI.setAttribute(loadingText, "style", "text-align: center; color: white;");
await huopaAPI.appendToApp(loadingText);
let token = "";
let loggedIn = false
let loginState = false
let storedToken = await huopaAPI.safeStorageRead("roturToken");
if (storedToken) {
    await huopaAPI.setCertainStyle(loginButton, "opacity", "1");
    await huopaAPI.setAttribute(loginButton, "textContent", "Sign out")
    token = storedToken
    storedToken = "";
    loggedIn = true;
    loginState = true;
    await createPostSendDiv()
}

// Login
await huopaAPI.setAttribute(loginButton, "onclick", async () => {
    if (loginState === true) {
        await huopaAPI.safeStorageWrite("roturToken", "file", "");
        token = "";
        loggedIn = false;
        loginState = false;
        await huopaAPI.setAttribute(loginButton, "textContent", "Login with Rotur");
        return;
    }
    if (loginState === "inProcess") {
        await huopaAPI.setAttribute(loginButton, "textContent", "Login with Rotur");
        await huopaAPI.setCertainStyle(loginButton, "opacity", "1");
        loginState = false;
        return;
    }
    loginState = "inProcess"
    await huopaAPI.setCertainStyle(loginButton, "opacity", "0.85");
    await huopaAPI.setAttribute(loginButton, "textContent", "Logging in...")
    token = await huopaAPI.openRoturLogin();
    if (token) {
        loginState = true
        await huopaAPI.setCertainStyle(loginButton, "opacity", "1");
        await huopaAPI.setAttribute(loginButton, "textContent", "Sign out")
        await huopaAPI.safeStorageWrite("roturToken", "file", token);
        createPostSendDiv()
    }
})

async function createPostSendDiv() {
        // Post creation
        const oldPostCreateDiv = await huopaAPI.getElementById("postCreateDiv");
        if (oldPostCreateDiv) await huopaAPI.deleteElement(oldPostCreateDiv);
        const postTextArea = await huopaAPI.createElement("textarea");
        await huopaAPI.append(postCreateDiv, postTextArea);
        const postButton = await huopaAPI.createElement("button");
        await huopaAPI.setCertainStyle(postButton, "margin", "0.5em auto");
        await huopaAPI.setAttribute(postButton, "textContent", "Send post");
        await huopaAPI.append(postCreateDiv, postButton);
        const postSendInfoText = await huopaAPI.createElement("p");
        await huopaAPI.setAttribute(postSendInfoText, "style", "color: white; margin: 0.5em; text-align: center;");
        await huopaAPI.setAttribute(postCreateDiv, "id", "postCreateDiv");
        await huopaAPI.append(postCreateDiv, postSendInfoText);
        await huopaAPI.setCertainStyle(postCreateDiv, "outline", "none");

        // Post sending

        await huopaAPI.setAttribute(postButton, "onclick", async () => {
            const response = await huopaAPI.fetch("https://social.rotur.dev/post?auth=" + token + "&content=" + await huopaAPI.getAttribute(postTextArea, "value") + "&os=HuopaOS");
            if (response.ok) {
                await huopaAPI.setAttribute(postSendInfoText, "textContent", "Sent post successfully!");
                await new Promise(resolve => setTimeout(resolve, 1500));
                await huopaAPI.setAttribute(postSendInfoText, "textContent", "");
                const response = await huopaAPI.fetch("https://social.rotur.dev/feed?limit=1&offset=0");
                if (response.ok) {
                    const post = response.body[0];
                    const postDiv = await huopaAPI.createElement("div");
                    const author = await huopaAPI.createElement("h3");
                    const postContent = await huopaAPI.createElement("p");

                    await huopaAPI.setAttribute(author, "textContent", post.user);
                    await huopaAPI.setAttribute(postContent, "textContent", post.content);

                    await huopaAPI.append(postDiv, author);
                    await huopaAPI.append(postDiv, postContent);

                    await huopaAPI.setAttribute(
                        postDiv,
                        "style",
                        "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1em;"
                    );
                    await huopaAPI.setCertainStyle(author, "margin", "0 0 1em 0");
                    await huopaAPI.prepend(postList, postDiv);
                }
            } else {
                await huopaAPI.setAttribute(postSendInfoText, "textContent", "Failed to send post! Error: " + response.body.error);
                await new Promise(resolve => setTimeout(resolve, 10000));
                await huopaAPI.setAttribute(postSendInfoText, "textContent", "");
            }
        })
}


// Feed loading
const postList = await huopaAPI.createElement("div");
await huopaAPI.appendToApp(postList)
const response = await huopaAPI.fetch("https://social.rotur.dev/feed?limit=25&offset=0");
if (response.ok) {
    const feed = response.body;
    if (Array.isArray(feed)) {
        huopaAPI.deleteElement(loadingText);
        for (const post of feed) {
            const postDiv = await huopaAPI.createElement("div");
            const author = await huopaAPI.createElement("h3");
            const postContent = await huopaAPI.createElement("p");

            await huopaAPI.setAttribute(author, "textContent", post.user);
            await huopaAPI.setAttribute(postContent, "textContent", post.content);

            await huopaAPI.append(postDiv, author);
            await huopaAPI.append(postDiv, postContent);

            await huopaAPI.setAttribute(
                postDiv,
                "style",
                "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1em; overflow: hidden; position: relative;"
            );
            await huopaAPI.setCertainStyle(author, "margin", "0 0 1em 0");
            const osSendInfo = await huopaAPI.createElement("p");
            if (post.os) {
                await huopaAPI.setAttribute(osSendInfo, "style", "position: absolute; right: 0.5em; top: 0.5em; color: rgba(255, 255, 255, 0.3); text-align: right; font-size: 0.5em;");
                await huopaAPI.setAttribute(osSendInfo, "textContent", post.os);
                await huopaAPI.append(postDiv, osSendInfo);
            }
            await huopaAPI.append(postList, postDiv);
        }
    }
} else {
    const errorMessage = await huopaAPI.createElement("h3");
    await huopaAPI.setAttribute(errorMessage, "textContent", "Failed to load Claw Feed, relaunch the app and try again. Status: " + response.status);
    
    await huopaAPI.appendToApp(errorMessage);
}


