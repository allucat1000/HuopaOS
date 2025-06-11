const title = await huopaAPI.createElement("h1");
await huopaAPI.setAttribute(title, "textContent", "Claw Feed");
await huopaAPI.setAttribute(title, "style", "text-align: center; color: white; margin: 1em;");
await huopaAPI.appendToApp(title);
const loginButton = await huopaAPI.createElement("button");
await huopaAPI.setAttribute(loginButton, "textContent", "Login with Rotur");
await huopaAPI.setCertainStyle(loginButton, "position", "absolute");
await huopaAPI.setCertainStyle(loginButton, "top", "0.5em");
await huopaAPI.setCertainStyle(loginButton, "right", "0.5em");
await huopaAPI.appendToApp(loginButton);
let loginPromptOpen = false
const loadingText = await huopaAPI.createElement("h3");
await huopaAPI.setAttribute(loadingText, "textContent", "Loading Claw feed...");
await huopaAPI.setAttribute(loadingText, "style", "text-align: center; color: white;");
await huopaAPI.appendToApp(loadingText);
let postDiv;
// Login
let token = "";
let loggedIn = false
await huopaAPI.setAttribute(loginButton, "onclick", async () => {
    if (loginPromptOpen) return;
    loginPromptOpen = true;
    const token = await huopaAPI.openRoturLogin();
    if (token) {
        await huopaAPI.setCertainStyle(loginButton, "opacity", "0.7");
        await huopaAPI.setAttribute(loginButton, "textContent", "Logged in")
    }
})



// Feed loading

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
                "margin: 1em; border-radius: 0.5em; background-color: rgba(65, 65, 65, 0.5); border-style: solid; border-color: rgba(105, 105, 105, 0.65); text-align: left; color: white; padding: 1em;"
            );
            await huopaAPI.setCertainStyle(author, "margin", "0 0 1em 0");
            await huopaAPI.appendToApp(postDiv);
        }
    }
} else {
    const errorMessage = await huopaAPI.createElement("h3");
    await huopaAPI.setAttribute(errorMessage, "textContent", "Failed to load Claw Feed, relaunch the app and try again. Status: " + response.status);
    
    await huopaAPI.appendToApp(errorMessage);
}


