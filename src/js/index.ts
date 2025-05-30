const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let waitId: ReturnType<typeof setTimeout> | undefined;
let touches: TouchList;

const circles: Map<number, Circle> = new Map();

interface Circle {
  gradient: CanvasGradient;
}
const gradients = [
  (function () {
    const grad = context.createLinearGradient(0, 0, 280, 0);
    grad.addColorStop(0, "lightblue");
    grad.addColorStop(1, "darkblue");
    return grad;
  })(),
  (function () {
    const grad = context.createLinearGradient(0, 0, 280, 0);
    grad.addColorStop(0, "#1f005c");
    grad.addColorStop(0.125, "#5b0060");
    grad.addColorStop(0.25, "#870160");
    grad.addColorStop(0.375, "#ac255e");
    grad.addColorStop(0.5, "#ca485c");
    grad.addColorStop(0.625, "#e16b5c");
    grad.addColorStop(0.75, "#f39060");
    grad.addColorStop(0.875, "#ffb56b");
    return grad;
  })(),
  (function () {
    const grad = context.createLinearGradient(0, 0, 280, 0);
    grad.addColorStop(0, "#00F5A0");
    grad.addColorStop(1, "#00D9F5");
    return grad;
  })(),
  (function () {
    const grad = context.createLinearGradient(0, 0, 280, 0);
    grad.addColorStop(0, "fuchsia");
    grad.addColorStop(1, "floralwhite");
    return grad;
  })(),
];

/**
 * Draw a circle.
 */
function drawCircle(
  x: number,
  y: number,
  gradient: CanvasGradient,
  radius = 70,
) {
  context.beginPath();
  context.arc(x, y - radius, radius, 0, 2 * Math.PI, false);
  context.fillStyle = gradient;
  context.fill();
}

/**
 * Pick a circle by random.
 */
function pick() {
  const randomListIndex = Math.floor(Math.random() * circles.size);
  const pickedId = [...circles][randomListIndex][0];

  console.log(`[${pickedId}]: Got picked`);

  // Delete all other circles that weren't picked
  for (const id of circles.keys()) {
    if (pickedId === id) continue;
    circles.delete(id);
  }

  // Force a redraw.
  redraw();
}

/**
 * Redraw then whole canvas
 */
function redraw() {
  // Redraw all the circles.
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const touch of touches) {
    // eslint-disable-next-line tscompat/tscompat
    const circle = circles.get(touch.identifier);
    if (!circle) continue;
    // eslint-disable-next-line tscompat/tscompat
    drawCircle(touch.clientX, touch.clientY, circle.gradient);
  }
}

/**
 * Our draw function.
 */
function draw(event: TouchEvent) {
  // eslint-disable-next-line tscompat/tscompat
  if (event.type === "touchstart") {
    // eslint-disable-next-line tscompat/tscompat
    for (const touch of event.changedTouches) {
      // Set a random color to this new user.
      // eslint-disable-next-line tscompat/tscompat
      circles.set(touch.identifier, { gradient: gradients.pop()! });
    }
    // Reset the timer!
    if (waitId) {
      globalThis.clearTimeout(waitId);
      waitId = undefined;
    }

    // Pick a user after 2 seconds.
    waitId = globalThis.setTimeout(pick, 2000);
  }
  // eslint-disable-next-line tscompat/tscompat
  if (event.type === "touchend" || event.type === "touchcancel") {
    // eslint-disable-next-line tscompat/tscompat
    for (const touch of event.changedTouches) {
      // eslint-disable-next-line tscompat/tscompat
      const circle = circles.get(touch.identifier);
      if (!circle) continue;
      // Put the color of the user that has stopped back into rotation.
      gradients.push(circle.gradient);
      // Remove the circle for the user that removed their finger.
      // eslint-disable-next-line tscompat/tscompat
      circles.delete(touch.identifier);
    }
    // If this was the last circle we should clear any timeout.
    if (waitId && circles.size === 0) {
      globalThis.clearTimeout(waitId);
    }
  }

  // eslint-disable-next-line tscompat/tscompat
  touches = event.touches;

  redraw();
}

document.addEventListener("gesturestart", function (event) {
  event.preventDefault();
  document.body.style.zoom = "0.99";
});

document.addEventListener("gesturechange", function (event) {
  event.preventDefault();

  document.body.style.zoom = "0.99";
});

document.addEventListener("gestureend", function (event) {
  event.preventDefault();
  document.body.style.zoom = "1";
});

// Set up all the event listeners.
canvas?.addEventListener("touchstart", draw, { passive: true });
canvas?.addEventListener("touchmove", draw, { passive: true });
canvas?.addEventListener("touchend", draw, { passive: true });
canvas?.addEventListener("touchcancel", draw);
