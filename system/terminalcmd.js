window.terminalcmd = {
  async listpkgs(args) {
    const packages = JSON.parse(localStorage.getItem("/system/packages")).join(" ");
    if (packages) {
      addLine(`[bg=palevioletred]Packages: ${packages}[/bg]`);
    } else {
      addLine("[bg=red]No packages installed![/bg]");
    }
  },

  async clear(args) {
    termContentChange("clear");
  },

  async rm(args) {
  if (!args || args.length === 0) {
    addLine("Usage: rm <path>");
    return;
  }

  const path = args[0];

  try {
    const meta = internalFS.getMeta(path);
    if (!meta) {
      addLine(`[bg=red]File not found: ${path}[/bg]`);
      return;
    }

    await internalFS.delDir(path);

  } catch (e) {
    addLine(`[bg=red]Failed to delete ${path}[/bg]`);
    console.error(e);
  }
}
};
