window.terminalcmd = {
  async listpkgs(args) {
    const packagesArray = JSON.parse(internalFS.getFile("/system/packages")) || [];
    const cleanedPackages = packagesArray.map(pkg => pkg.replace(/^\/system\/packages\//, ""));
    const packagesString = cleanedPackages.join(" ");

    if (packagesString) {
      addLine(`[bg=palevioletred]Packages: ${packagesString}[/bg]`);
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
