use akstorytowiki::story_to_wiki;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn convert(text: String) -> String {
  story_to_wiki(text)
}
