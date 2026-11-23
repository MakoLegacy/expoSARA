import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clamp01, smoothstep, climateAt } from "../src/living-world.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const js = fs.readFileSync(path.join(root, "src", "main.js"), "utf8");

assert.equal(clamp01(-20), 0);
assert.equal(clamp01(2), 1);
assert.equal(smoothstep(1, 5, 1), 0);
assert.equal(smoothstep(1, 5, 5), 1);
assert(Math.abs(smoothstep(1, 5, 3) - .5) < 1e-8);

const keys = ["cloud","darkness","lights","rain","digital","lightning"];
let last = climateAt(0);
for (let chapter=0; chapter<=6; chapter+=.1) {
  const state=climateAt(chapter);
  for (const key of keys) {
    assert(state[key]>=0 && state[key]<=1, key + " must be in [0,1]");
    assert(state[key] >= last[key] - 1e-12, key + " must be monotone");
  }
  last = state;
}
assert.equal(climateAt(0).rain,0);
assert.equal(climateAt(6).rain,1);
assert.equal(climateAt(0).lights,0);
assert.equal(climateAt(6).lights,1);
assert.equal(climateAt(0).digital,0);
assert.equal(climateAt(6).digital,1);

assert.equal((html.match(/class="haul-vehicle"/g)||[]).length,5,"5 animated trucks");
assert.equal((html.match(/class="mine-lightpoint"/g)||[]).length,7,"7 floodlight points");
assert.equal((html.match(/class="mine-excavator/g)||[]).length,2,"2 excavators");
const ids=[...html.matchAll(/<path id="(haul-route-[^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,4,"4 routes");
for(const id of [...html.matchAll(/data-route="([^"]+)"/g)].map(m=>m[1])){
  assert(ids.includes(id),"Unbound route "+id);
}
assert(js.includes("livingWorld.render(frameTime / 1000, smoothPosition)"));
assert(html.includes("https://qr.keraunos.co/t/mHMsMSjw7fLzlVFzMsh9K99cFG7tiC"));
assert(html.includes("https://antito-yanac.github.io/sara/"));
assert(html.includes('id="fallback-sim"'));
console.log("V5 checks passed: routes, equipment, weather progression, controls and original links.");
