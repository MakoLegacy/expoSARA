/**
 * S.A.R.A. V5 — living mine visualization.
 * Visual-only 2.5D choreography. Roads and equipment are illustrative and
 * are not based on official Antamina coordinates, geofences, or live telemetry.
 *
 * Everything tied to the world-camera belongs to one SVG coordinate space.
 * The camera's transform is inherited by both the photograph and equipment.
 */
export const clamp01 = value => Math.min(1, Math.max(0, value));

export function smoothstep(start, end, value) {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Returns bounded scene intensity values for chapter position 0..6. */
export function climateAt(position) {
  return {
    cloud: smoothstep(0.65, 3.8, position),
    darkness: smoothstep(1.6, 5.6, position),
    lights: smoothstep(2.3, 5.1, position),
    rain: smoothstep(3.7, 5.7, position),
    digital: smoothstep(2.1, 4.3, position),
    lightning: smoothstep(4.75, 6, position),
  };
}

export function createLivingWorld({ reducedMotion = false } = {}) {
  const world = document.querySelector("#world");
  const photo = document.querySelector("#mine-photo");
  const cloudFar = document.querySelector(".cloud-far");
  const cloudNear = document.querySelector(".cloud-near");
  const dark = document.querySelector(".storm-tone");
  const rainBack = document.querySelector(".rain-back");
  const rainFront = document.querySelector(".rain-front");
  const flash = document.querySelector(".storm-flash");
  const pylons = [...document.querySelectorAll(".mine-lightpoint")];
  const machines = [...document.querySelectorAll(".mine-excavator")];

  const trucks = [...document.querySelectorAll(".haul-vehicle")].flatMap(element => {
    const path = document.getElementById(element.dataset.route);
    if (!path || typeof path.getTotalLength !== "function") return [];
    const length = path.getTotalLength();
    if (length <= 0) return [];
    return [{
      element,
      path,
      length,
      speed: Number(element.dataset.speed) || 0.01,
      offset: Number(element.dataset.offset) || 0,
      scale: Number(element.dataset.scale) || 1,
    }];
  });
  const available = Boolean(world && photo && cloudFar && cloudNear && dark && rainBack && rainFront && flash);
  let lastFrame = -Infinity;

  // Visual development aid: show the 4 approximate haul paths for calibration.
  if (available && new URLSearchParams(window.location.search).get("debugRoutes") === "1") {
    world.classList.add("debug-routes");
  }

  function render(timeSeconds, chapterPosition) {
    if (!available) return;
    if (!reducedMotion && timeSeconds - lastFrame < 1 / 30) return;
    lastFrame = timeSeconds;

    const climate = climateAt(chapterPosition);
    world.style.setProperty("--night-factor", climate.lights.toFixed(3));
    world.style.setProperty("--digital-factor", climate.digital.toFixed(3));

    // Opacity is intentionally restrained to keep the mining landscape legible.
    cloudFar.style.opacity = (climate.cloud * 0.67).toFixed(3);
    cloudNear.style.opacity = (climate.cloud * 0.54).toFixed(3);
    dark.style.opacity = (climate.darkness * 0.74).toFixed(3);
    rainBack.style.opacity = (climate.rain * 0.30).toFixed(3);
    rainFront.style.opacity = (climate.rain * 0.27).toFixed(3);

    // Mild, isolated double lightning pulse late in the story, not rapid strobe.
    const cycle = (timeSeconds + 4.1) % 19;
    const first = clamp01(1 - Math.abs(cycle - 9.1) / 0.22);
    const second = clamp01(1 - Math.abs(cycle - 9.56) / 0.18);
    const lightningOpacity = reducedMotion ? 0 : climate.lightning * (first * .16 + second * .08);
    flash.style.opacity = lightningOpacity.toFixed(3);

    pylons.forEach((pylon, index) => {
      const delay = Number(pylon.dataset.delay) || 0;
      const on = smoothstep(2.55 + delay, 4.9 + delay, chapterPosition);
      pylon.style.setProperty("--lamp", on.toFixed(3));
    });

    // Moving trucks are synchronized to the SVG haul-road space and inherit
    // the same transform as the mine image. They fade out at route endpoints.
    for (const truck of trucks) {
      const phase = ((timeSeconds * truck.speed + truck.offset) % 1 + 1) % 1;
      const at = phase * truck.length;
      const point = truck.path.getPointAtLength(at);
      const before = truck.path.getPointAtLength(Math.max(0, at - 2.5));
      const after = truck.path.getPointAtLength(Math.min(truck.length, at + 2.5));
      const heading = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
      const alpha = smoothstep(0, .10, phase) * (1 - smoothstep(.90, 1, phase));
      truck.element.setAttribute("transform",
        "translate(" + point.x.toFixed(2) + " " + point.y.toFixed(2) + ") rotate(" +
        heading.toFixed(2) + ") scale(" + truck.scale + ")");
      truck.element.style.opacity = alpha.toFixed(3);
    }

    // Small excavator boom movement is a hint of activity, not a large cartoon.
    machines.forEach((machine, index) => {
      const boom = machine.querySelector(".machine-boom");
      if (!boom) return;
      const angle = reducedMotion ? -3 : -3 + Math.sin(timeSeconds * (.30 + index * .04) + index * 1.7) * 8;
      boom.setAttribute("transform", "rotate(" + angle.toFixed(2) + " 3 -5)");
    });
  }

  return { render, trucksCount: trucks.length, lightsCount: pylons.length };
}
