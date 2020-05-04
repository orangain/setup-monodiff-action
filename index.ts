import https from "https";
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
  let version = core.getInput("version");
  if (!version) {
    version = await getLatestVersion();
    core.debug(`Got latest version: ${version}`);
  } else if (!version.startsWith("v")) {
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

async function getLatestVersion(): Promise<string> {
  const url = "https://api.github.com/repos/orangain/monodiff/releases/latest";
  const json = await getJSON(url);
  return json.tag_name;
}

async function getJSON(url: string): Promise<any> {
  const options = {
    headers: {
      accept: "application/json",
      "user-agent": "setup-monodiff-action",
    },
  };
  return new Promise((resolve, reject) => {
    https
      .get(url, options, (res) => {
        core.debug(`res.statusCode: ${res.statusCode}`);
        if (res.statusCode! < 200 || res.statusCode! >= 300) {
          reject(new Error(`Non successful response: ${res.statusCode}`));
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (e) => {
        reject(e);
      });
  });
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
