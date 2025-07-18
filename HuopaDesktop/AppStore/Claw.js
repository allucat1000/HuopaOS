const title = document.createElement("h1");
title.textContent = "Claw Feed";
title.style = "text-align: center; color: white; margin: 1em;";
document.body.append(title);
const postCreateDiv = document.createElement("div");
const loginButton = document.createElement("button");
loginButton.textContent = "Login with Rotur";
loginButton.style.position = "absolute"
;
loginButton.style.top = "0.5em"
;
loginButton.style.right = "0.5em"
;
document.body.append(loginButton);
document.body.append(postCreateDiv);
const loadingText = document.createElement("h3");
loadingText.textContent = "Loading Claw feed...";
loadingText.style = "text-align: center; color: white;";
document.body.append(loadingText);
let token = "";
let loggedIn = false
let loginState = false
let storedToken = await huopaAPI.safeStorageRead("roturToken");
if (storedToken) {
    loginButton.style.opacity = "1"
;
    loginButton.textContent = "Sign out"
    token = storedToken
    storedToken = "";
    loggedIn = true;
    loginState = true;
    await createPostSendDiv()
}

// Login
loginButton.onclick = async () => {
    if (loginState === true) {
        await huopaAPI.safeStorageWrite("roturToken", "file", "");
        token = "";
        loggedIn = false;
        loginState = false;
        loginButton.textContent = "Login with Rotur";
        return;
    }
    if (loginState === "inProcess") {
        loginButton.textContent = "Login with Rotur";
        loginButton.style.opacity = "1"
;
        loginState = false;
        return;
    }
    loginState = "inProcess"
    loginButton.style.opacity = "0.85"
;
    loginButton.textContent = "Logging in..."
    token = await huopaAPI.openRoturLogin();
    if (token) {
        loginState = true
        loginButton.style.opacity = "1"
;
        loginButton.textContent = "Sign out"
        await huopaAPI.safeStorageWrite("roturToken", "file", token);
        createPostSendDiv()
    }
}

async function createPostSendDiv() {
        // Post creation
        const oldPostCreateDiv = document.getElementById("postCreateDiv");
        if (oldPostCreateDiv) oldPostCreateDiv.remove();
        const postTextArea = document.createElement("textarea");
        postCreateDiv.append(postTextArea);
        const postButton = document.createElement("button");
        postButton.margin = "0.5em auto";
        postButton.textContent = "Send post";
        postCreateDiv.append(postButton);
        const postSendInfoText = document.createElement("p");
        postSendInfoText.style = "color: white; margin: 0.5em; text-align: center;";
        postCreateDiv.id = "postCreateDiv";
        postCreateDiv.append(postSendInfoText);
        postCreateDiv.style.outline = "none"
;

        // Post sending

        postButton.onclick = async () => {
            const response = await fetch("https://social.rotur.dev/post?auth=" + token + "&content=" + postTextArea.value + "&os=HuopaOS");
            if (response.ok) {
                postSendInfoText.textContent = "Sent post successfully!";
                await new Promise(resolve => setTimeout(resolve, 1500));
                postSendInfoText.textContent = "";
                const response = await fetch("https://social.rotur.dev/feed?limit=1&offset=0");
                if (response.ok) {
                    const post = await response.json()[0];
                    const postDiv = document.createElement("div");
                    const author = document.createElement("h3");
                    const pfp = document.createElement("img");
                    await setAttrs(pfp, {
                        "src":"https://avatars.rotur.dev/" + post.user,
                        "style":"border-radius: 50%; width: 1.5em; height: 1.5em;"
                    })
                    const postContent = document.createElement("p");

                    author.textContent = post.user;
                    postContent.textContent = post.content;
                    const userBar = document.createElement("div");
                    userBar.style = "display: flex; align-items: center; margin: 0; margin-bottom: 1em;";
                    userBar.append(pfp);
                    userBar.append(author);
                    postDiv.append(userBar);
                    postDiv.append(postContent);

                    postDiv.style = "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1em; overflow: hidden; position: relative";
                    author.style.margin = "0 0.5em";
                    author.style.paddingBottom = "0.15em";
                    const osSendInfo = document.createElement("p");
                    if (post.os) {
                        osSendInfo.style = "position: absolute; right: 0.5em; top: 0.5em; color: rgba(255, 255, 255, 0.3); text-align: right; font-size: 0.5em;";
                        osSendInfo.textContent = post.os;
                        postDiv.append(osSendInfo);
                    }
                    postList.prepend(postDiv);
                }
            } else {
                postSendInfoText.textContent = "Failed to send post! Error: " + response.body.error;
                await new Promise(resolve => setTimeout(resolve, 10000));
                postSendInfoText.textContent = "";
            }
        }
}


// Feed loading
const postList = document.createElement("div");
document.body.append(postList)
const response = await fetch("https://social.rotur.dev/feed?limit=25&offset=0");
if (response.ok) {
    const feed = response.json();
    if (Array.isArray(feed)) {
        loadingText.remove();
        for (const post of feed) {
            const postDiv = document.createElement("div");
            const author = document.createElement("h3");
            const pfp = document.createElement("img");
            await setAttrs(pfp, {
                "src":"https://avatars.rotur.dev/" + post.user,
                "style":"border-radius: 50%; width: 1.5em; height: 1.5em;"
            })
            const postContent = document.createElement("p");

            author.textContent = post.user;
            postContent.textContent = post.content;
            const userBar = document.createElement("div");
            userBar.style = "display: flex; align-items: center; margin: 0; margin-bottom: 1em;";
            userBar.append(pfp);
            userBar.append(author);
            postDiv.append(userBar);
            postDiv.append(postContent);

            
            postDiv.style = "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1em; overflow: hidden; position: relative;";
            author.margin = "0 0.5em";
            author.style.paddingBottom = "0.15em"
;
            const osSendInfo = document.createElement("p");
            if (post.os) {
                osSendInfo.style = "position: absolute; right: 0.5em; top: 0.5em; color: rgba(255, 255, 255, 0.3); text-align: right; font-size: 0.5em;";
                osSendInfo.textContent = post.os;
                postDiv.append(osSendInfo);
            }
            postList.append(postDiv);
        }
    }
} else {
    const errorMessage = document.createElement("h3");
    errorMessage.textContent = "Failed to load Claw Feed, relaunch the app and try again. Status: " + response.status;
    
    document.body.append(errorMessage);
}


