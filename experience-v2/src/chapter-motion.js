import { gsap } from "gsap";

/**
 * Semantic motion graphics for S.A.R.A.'s seven-part executive story.
 * This layer tells an explanatory story, not real-time operational status.
 *
 * A chapter's cinematic entrance plays first; the relevant motion sequence
 * then runs autonomously, with quiet repeat pauses while the presenter speaks.
 * Press R or the replay button to restart the current explanation on demand.
 */
export function createChapterMotion({ reducedMotion = false } = {}) {
  let active = null;
  let currentScene = null;
  const select = (scene, selector) => [...scene.querySelectorAll(selector)];
  const first = (scene, selector) => scene.querySelector(selector);

  const tint = (timeline, element, at, { orange = false, duration = 0.72 } = {}) => {
    if (!element) return;
    const color = orange ? "rgba(255,149,91,.19)" : "rgba(93,219,251,.17)";
    const glow = orange ? "rgba(255,139,79,.32)" : "rgba(88,213,255,.25)";
    timeline.fromTo(element,
      { backgroundColor: "rgba(4,19,31,.13)", boxShadow: "0 0 0 rgba(0,0,0,0)", filter: "brightness(1)" },
      { backgroundColor: color, boxShadow: "0 0 23px " + glow, filter: "brightness(1.2)",
        duration, ease: "sine.inOut", yoyo: true, repeat: 1 },
      at);
  };

  const light = (timeline, element, at, duration = .75) => {
    if (!element) return;
    timeline.fromTo(element,
      { filter: "drop-shadow(0 0 0 rgba(80,216,255,0))", opacity: .46 },
      { filter: "drop-shadow(0 0 13px rgba(80,216,255,.9))", opacity: 1,
        duration, ease: "sine.out", yoyo: true, repeat: 1 },
      at);
  };

  const movePacket = (timeline, packet, at, { vertical = false, duration = .92 } = {}) => {
    if (!packet || !packet.parentElement) return;
    const distance = () => Math.max(16,
      (vertical ? packet.parentElement.clientHeight - packet.offsetHeight :
        packet.parentElement.clientWidth - packet.offsetWidth));
    const axis = vertical ? "y" : "x";
    timeline.fromTo(packet,
      { [axis]: 0, autoAlpha: 0, scale: .7 },
      { [axis]: distance, autoAlpha: 1, scale: 1, duration, ease: "power2.inOut" },
      at);
    timeline.to(packet, { autoAlpha: 0, duration: .19 }, at + duration - .12);
  };

  function makeSequence(scene) {
    const index = Number(scene.dataset.scene);
    const timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 3.8 });

    if (index === 0) {
      // A signal passes from detection through monitoring to the official radio.
      const terms = select(scene, ".operational-chain span");
      const beacons = select(scene, ".signal-beacon");
      const packets = select(scene, ".signal-packet");
      terms.forEach((term, i) => tint(timeline, term, .4 + i * 1.55,
        { orange: i === 2, duration: .56 }));
      beacons.forEach((beacon, i) => light(timeline, beacon, .45 + i * 1.55, .55));
      movePacket(timeline, packets[0], 1.1, { duration: .92 });
      movePacket(timeline, packets[1], 2.75, { duration: .92 });
      timeline.to({}, { duration: .5 }, 5.0);
    } else if (index === 1) {
      // An official radio message is communicated; asking for a zone is an
      // explanatory illustration, NOT a claim that a radio system failed.
      const rows = select(scene, ".friction");
      rows.forEach((row,i)=>tint(timeline,row,.6+i*1.26,{orange:i===1,duration:.47}));
      light(timeline, first(scene, ".radio-origin"), .65, .75);
      movePacket(timeline, first(scene, ".radio-path i"), 1.48, { duration:1.15 });
      light(timeline, first(scene, ".radio-target"), 2.67, .55);
      tint(timeline, first(scene, ".radio-answer"), 3.5, { duration:.72 });
      timeline.to({}, { duration: .7 }, 5.7);
    } else if (index === 2) {
      // Different zones are inspected sequentially; no fake alert levels.
      const zones = select(scene, ".zone-item");
      const rings = select(scene, ".zone-ring");
      zones.forEach((zone,i)=>{
        tint(timeline,zone,.45+i*1.1,{orange:i===2,duration:.48});
        light(timeline,rings[i],.54+i*1.1,.43);
      });
      movePacket(timeline, first(scene, ".zone-scan-packet"), .95, { duration:3.9 });
      timeline.to({}, { duration: .3 }, 5.45);
    } else if (index === 3) {
      // Data from the existing Keraunos WEB is consulted by three computers.
      const rails=select(scene, ".flow-rail");
      const packets=select(scene, ".flow-rail .flow-packet");
      const engines=select(scene, ".engine");
      tint(timeline, first(scene, ".flow-source"), .5, {duration:.5});
      rails.forEach((rail,i)=>{
        const line=rail.querySelector("span");
        if(line)timeline.fromTo(line,{scaleY:0,transformOrigin:"top center"},
          {scaleY:1,duration:.75,ease:"power2.out"},.7+i*3.2);
        movePacket(timeline,packets[i],1.1+i*3.15,{vertical:true,duration:.83});
      });
      engines.forEach((engine,i)=>tint(timeline,engine,2+i*.8,{orange:i===1,duration:.5}));
      tint(timeline,first(scene,".flow-destination"),5.2,{duration:.65});
      timeline.to({}, { duration: .6 }, 6.8);
    } else if (index === 4) {
      // Worker habit (proposed) + official radio during the shift.
      const steps=select(scene, ".prevention-step");
      const links=select(scene, ".prevention-connector span");
      const icons=select(scene, ".prevention-icon");
      steps.forEach((step,i)=>{
        tint(timeline,step,.4+i*1.55,{orange:i===2,duration:.58});
        light(timeline,icons[i],.5+i*1.55,.6);
      });
      links.forEach((link,i)=>timeline.fromTo(link,{scaleY:0,transformOrigin:"top center"},
        {scaleY:1,duration:.6,ease:"power2.out"},1.5+i*1.55));
      light(timeline,first(scene,".notice-dot"),5.45,.72);
      timeline.to({}, {duration:.55},6.5);
    } else if (index === 5) {
      // Attention moves across three groups receiving prospective value.
      const rows=select(scene, ".value-row");
      const marker=first(scene, ".value-rail i");
      rows.forEach((row,i)=>{
        if(marker)timeline.to(marker,{y:()=>row.offsetTop + Math.min(19,row.clientHeight*.25),
          duration:.72,ease:"power3.inOut"},.4+i*1.55);
        tint(timeline,row,.7+i*1.55,{orange:i===2,duration:.59});
      });
      timeline.to({}, {duration:.5},5.7);
    } else if (index === 6) {
      // Executive roadmap: validate, strengthen, scale; no fictitious KPI.
      const steps=select(scene,".future-step");
      const links=select(scene,".future-connector");
      steps.forEach((step,i)=>tint(timeline,step,.4+i*1.62,
        {orange:i===2,duration:.6}));
      links.forEach((link,i)=>timeline.fromTo(link,{scaleY:0,transformOrigin:"top center"},
        {scaleY:1,duration:.75,ease:"power3.out"},1.35+i*1.62));
      const paths=select(scene,".sara-closing .sara-mark path");
      paths.forEach((p,i)=>{
        const length=typeof p.getTotalLength==="function"?p.getTotalLength():55;
        timeline.fromTo(p,{strokeDasharray:length,strokeDashoffset:length},
          {strokeDashoffset:0,duration:.6,ease:"power2.inOut"},5.4+i*.23);
      });
      timeline.to({}, {duration:.5},6.7);
    }

    return timeline;
  }

  function stop() {
    if (active) active.kill();
    active = null;
    currentScene = null;
  }

  function play(scene) {
    if (!scene) return;
    stop();
    currentScene = scene;
    if (reducedMotion) return;
    active = makeSequence(scene);
    active.play(0);
  }

  return { play, stop, get currentScene() { return currentScene; } };
}
