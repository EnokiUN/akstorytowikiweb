import { convert } from "../lib/akstorytowiki_wasm_bindings.js";

const RESOURCE_URL_ROOT =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/story/";
const STAGE_MAP_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/story_review_table.json";

const urlInput: HTMLInputElement = document.querySelector("#url-input")!;
const stageInput: HTMLInputElement = document.querySelector("#stage-input")!;
const button: HTMLButtonElement = document.querySelector("#convert")!;
const output: HTMLTextAreaElement = document.querySelector("#output")!;

const stageMap: { [code: string]: string } = {};

button.addEventListener("click", async () => {
  button.disabled = true;
  let url = urlInput.value;
  if (url) {
    if (url.indexOf("github.com") > -1) {
      url = url.replace("github.com", "raw.githubusercontent.com").replace(
        "/blob",
        "",
      );
    }
  } else if (stageInput.value) {
    if (!stageMap.length) {
      const data = await fetch(STAGE_MAP_URL).then((r) => r.json());
      Object.values(data).forEach((d: any) => {
        d.infoUnlockDatas.forEach((s: any) => {
          let stageName = s.storyCode;
          if (!stageName) {
            stageName = s.storyName.toUpperCase().replace(" ", "").replace(
              "'",
              "",
            );
          }
          if (s.avgTag == "Before Operation") {
            stageName += "BEFORE";
          } else if (s.avgTag == "After Operation") {
            stageName += "AFTER";
          }
          stageMap[stageName] = s.storyTxt;
        });
      });
    }
    url = RESOURCE_URL_ROOT +
      stageMap[
        stageInput.value.toUpperCase().replace(" ", "").replace("'", "")
      ] + ".txt";
  }
  const resp = await fetch(url);
  if (resp.status == 404) {
    output.value = "Not Found";
  } else {
    const content = await resp.text();
    output.value = convert(content);
  }
  button.disabled = false;
});
