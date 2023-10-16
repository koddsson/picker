const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

canvas.width = window.innerWidth
canvas.height = window.innerHeight

type Color = 'yellow' | 'blue' | 'red' | 'green'

let waitId: number | undefined
let touches: TouchList

const circles: Map<number, Circle> = new Map()
const colors: Color[] = ['yellow', 'blue', 'red', 'green']

interface Circle {
  color: Color
}

/**
 * Draw a circle.
 */
function drawCircle(x: number, y: number, color: string, radius = 70) {
  ctx.beginPath()
  ctx.arc(x, y - radius, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = color
  ctx.fill()
  ctx.lineWidth = 5
  ctx.strokeStyle = '#003300'
  ctx.stroke()
}

/**
 * Pick a circle by random.
 */
function pick() {
  const randomListIndex = Math.floor(Math.random() * circles.size)
  const pickedId = Array.from(circles)[randomListIndex][0]
  // eslint-disable-next-line no-console
  console.log(`[${pickedId}]: Got picked`)

  // Delete all other circles that weren't picked
  for (const id of circles.keys()) {
    if (pickedId === id) continue
    circles.delete(id)
  }

  // Force a redraw.
  redraw()
}

/**
 * Redraw then whole canvas
 */
function redraw() {
  // Redraw all the circles.
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const touch of touches) {
    const circle = circles.get(touch.identifier)
    if (!circle) continue
    drawCircle(touch.clientX, touch.clientY, circle.color)
  }
}

/**
 * Our draw function.
 */
function draw(event: TouchEvent) {
  if (event.type === 'touchstart') {
    for (const touch of event.changedTouches) {
      // Set a random color to this new user.
      circles.set(touch.identifier, {color: colors.pop()!})
    }
    // Reset the timer!
    if (waitId) {
      window.clearTimeout(waitId)
      waitId = undefined
    }

    // Pick a user after 2 seconds.
    waitId = window.setTimeout(pick, 2000)
  }
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    for (const touch of event.changedTouches) {
      const circle = circles.get(touch.identifier)
      if (!circle) continue
      // Put the color of the user that has stopped back into rotation.
      colors.push(circle.color)
      // Remove the circle for the user that removed their finger.
      circles.delete(touch.identifier)
    }
    // If this was the last circle we should clear any timeout.
    if (waitId && circles.size === 0) {
      window.clearTimeout(waitId)
    }
  }

  touches = event.touches

  redraw()
}

document.addEventListener('gesturestart', function (e) {
  e.preventDefault()
  document.body.style.zoom = 0.99
})

document.addEventListener('gesturechange', function (e) {
  e.preventDefault()

  document.body.style.zoom = 0.99
})
document.addEventListener('gestureend', function (e) {
  e.preventDefault()
  document.body.style.zoom = 1
})

// Set up all the event listeners.
canvas?.addEventListener('touchstart', draw, {passive: true})
canvas?.addEventListener('touchmove', draw, {passive: true})
canvas?.addEventListener('touchend', draw, {passive: true})
canvas?.addEventListener('touchcancel', draw)
