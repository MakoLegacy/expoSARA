/**
 * S.A.R.A. — environmental story layer.
 * Light clouds and rain respond to chapter position 0..5. The background photo
 * is cinematic illustration, not live operational weather or mine telemetry.
 * No synthetic vehicles or machinery are drawn.
 */
export const clamp01 = value => Math.min(1, Math.max(0, value));

export function smoothstep(start, end, value) {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function climateAt(position) {
  return {
    cloud: smoothstep(.6, 3.1, position),
    darkness: smoothstep(1.3, 4.7, position),
    rain: smoothstep(3.0, 4.9, position),
    digital: smoothstep(1.8, 3.6, position),
    lightning: smoothstep(3.8, 5, position),
  };
}

export function createLivingWorld({ reducedMotion = false } = {}) {
  const clouds = [document.querySelector(".cloud-far"), document.querySelector(".cloud-near")];
  const dark = document.querySelector(".storm-tone");
  const rain = [document.querySelector(".rain-back"), document.querySelector(".rain-front")];
  const flash = document.querySelector(".storm-flash");
  const available = Boolean(dark && flash && clouds.every(Boolean) && rain.every(Boolean));
  let lastFrame = -Infinity;

  function render(timeSeconds, chapterPosition) {
    if (!available) return;
    if (!reducedMotion && timeSeconds - lastFrame < 1/30) return;
    lastFrame = timeSeconds;

    const climate = climateAt(chapterPosition);
    clouds[0].style.opacity = (climate.cloud * .53).toFixed(3);
    clouds[1].style.opacity = (climate.cloud * .39).toFixed(3);
    dark.style.opacity = (climate.darkness * .66).toFixed(3);
    rain[0].style.opacity = (climate.rain * .21).toFixed(3);
    rain[1].style.opacity = (climate.rain * .18).toFixed(3);

    // Gentle distant atmospheric flashes late in the story. No bright strobe.
    const cycle = (timeSeconds + 4.2) % 23;
    const first = clamp01(1 - Math.abs(cycle - 10.1) / .28);
    const second = clamp01(1 - Math.abs(cycle - 10.67) / .19);
    flash.style.opacity = reducedMotion
      ? "0"
      : (climate.lightning * (first * .1 + second * .035)).toFixed(3);
  }

  return { render };
}
