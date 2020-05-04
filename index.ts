import core from "@actions/core";
import tc from "@actions/tool-cache";

type MainArgs = {
  version: string;
  arch: string;
};

const monodiff = "monodiff";

main().catch((error) => core.setFailed(error.message));

async function main() {
  const version = core.getInput("version"); // TODO: Use latest version
  const arch = core.getInput("arch") || "linux_x86_64"; // TODO: Detect from environment
  await setup({ version, arch });
}

async function setup({ version, arch }: MainArgs) {
  if (!version.startsWith("v")) {
    version = "v" + version;
  }
  const url = `https://github.com/orangain/monodiff/releases/download/${version}/monodiff_${arch}.tar.gz`;

  let toolPath = tc.find(monodiff, version, arch);
  if (toolPath) {
    core.debug(`Tool ${monodiff} found in cache ${toolPath}`);
  } else {
    core.debug(`Downloading monodiff from ${url}`);
    const archivePath = await tc.downloadTool(url);
    const extractedPath = await tc.extractTar(archivePath);
    toolPath = await tc.cacheDir(extractedPath, monodiff, version, arch);
  }

  core.addPath(toolPath);
}
