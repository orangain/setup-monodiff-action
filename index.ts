import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

type OS = "linux" | "darwin" | "windows";

type MainArgs = {
  version: string;
  os: OS;
  arch: string;
};

const monodiff = "monodiff";

main().catch((error) => core.setFailed(error.message));

async function main() {
  let version = core.getInput("version"); // TODO: Use latest version
  if (!version.startsWith("v")) {
    version = "v" + version;
  }
  let os: OS;
  if (process.platform === "win32") {
    os = "windows";
  } else if (process.platform === "darwin") {
    os = "darwin";
  } else {
    os = "linux";
  }
  const arch = "x86_64";
  await setup({ version, os, arch });
}

async function setup({ version, os, arch }: MainArgs) {
  const ext = os === "windows" ? "zip" : "tar.gz";
  const url = `https://github.com/orangain/monodiff/releases/download/${version}/monodiff_${os}_${arch}.${ext}`;

  let toolPath = tc.find(monodiff, version, arch);
  if (toolPath) {
    core.debug(`Tool ${monodiff} found in cache ${toolPath}`);
  } else {
    core.debug(`Downloading monodiff from ${url}`);
    const archivePath = await tc.downloadTool(url);
    const extractedPath = await (ext === "zip"
      ? tc.extractZip(archivePath)
      : tc.extractTar(archivePath));
    toolPath = await tc.cacheDir(extractedPath, monodiff, version, arch);
  }

  core.addPath(toolPath);
}
