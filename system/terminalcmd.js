window.terminalcmd = {
  async listpkgs(args) {
    const packagesArray = JSON.parse(internalFS.getFile("/system/packages") || "[]");
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

  async delDir(dir, visited = new Set(), recursive = false, force = false) {
  if (visited.has(dir)) return;
  visited.add(dir);

  const contentsRaw = internalFS.getFile(dir);
  let contents = [];

  try {
    contents = JSON.parse(contentsRaw || "[]");
  } catch (e) {
    if (!force) console.error(`Failed to parse contents of ${dir}`, e);
    return;
  }

  for (const item of contents) {
    const value = internalFS.getFile(item);
    const isDir = value && value.startsWith("[");

    if (isDir) {
      if (recursive) {
        await internalFS.delDir(item, visited, recursive, force);
      } else if (!force) {
        addLine(`[bg=red]Cannot delete directory ${item} without -r[/bg]`);
        continue;
      }
    } else {
      internalFS.delDir(item);
    }
  }

  internalFS.delDir(dir);

  if (dir !== "/") {
    const dirParts = dir.split("/");
    const parentPath = dirParts.slice(0, -1).join("/") || "/";
    const parentContentsRaw = internalFS.getFile(parentPath);

    if (parentContentsRaw) {
      try {
        const parentContents = JSON.parse(parentContentsRaw);
        const updated = parentContents.filter(item => item !== dir);
        internalFS.createPath(parentPath, "dir", JSON.stringify(updated));
      } catch (e) {
        if (!force) console.error(`Failed to update parent dir: ${parentPath}`, e);
      }
    }
  }
}

};
