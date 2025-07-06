const rwl = await importModule("rwl");

await rwl.render(`
    root {
        "text :D",
        Button [id="button", onclick="click()"] {
            "heyo :D"
        }

        container {
            "text in div :D",
            "more text :D:D"
        }
    }
`);
