import * as wasm from "akstorytowiki";

const RESOURCE_URL_ROOT = 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/story/';
const STAGE_MAP_URL = 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/story_review_table.json';

const urlInput = document.querySelector("#url-input");
const stageInput = document.querySelector("#stage-input");
const button = document.querySelector("#convert");
const output = document.querySelector("#output");

let stageMap = {};

button.addEventListener('click', async () => {
  button.disabled = true;
  let url = urlInput.value;
  if (url) {
    if (url.indexOf('github.com') > -1) {
      url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob', '');
    }
  } else if (stageInput.value) {
    if (!stageMap.length) {
      let data = await fetch(STAGE_MAP_URL).then((r) => r.json());
      Object.values(data).forEach((d) => {
        d.infoUnlockDatas.forEach((s) => {
          let stageName = s.storyCode
          if (!stageName)
            stageName = s.storyName.toUpperCase().replace(' ', '').replace('\'', '');
          if (s.avgTag == 'Before Operation') {
            stageName += 'BEFORE'
          } else if (s.avgTag == 'After Operation') {
            stageName += 'AFTER'
          }
          stageMap[stageName] = s.storyTxt;
        });
      });
    }
    url = RESOURCE_URL_ROOT + stageMap[stageInput.value.toUpperCase().replace(' ', '').replace('\'', '')] + '.txt';
  }
  let content = await fetch(url);
  if (content.status == 404) {
    output.value = 'Not Found';
  } else {
    content = await content.text();
    output.value = wasm.convert(content);
  }
  button.disabled = false;
})
