const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

canvas.width = window.innerWidth
canvas.height = window.innerHeight

interface Circle {
  color: string
}

const circles: Record<number, Circle> = {}
const colors = ['yellow', 'blue', 'red', 'green']

function drawCircle(x: number, y: number, color: string, radius = 70) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = color
  ctx.fill()
  ctx.lineWidth = 5
  ctx.strokeStyle = '#003300'
  ctx.stroke()
}

let waitId: number | undefined

function pick() {
  const pickedId = Math.floor(Math.random() * Object.keys(circles).length)
  for (const id of Object.keys(circles)) {
    if (pickedId === Number(id)) continue
    delete circles[Number(id)]
  }
}

function draw(event: TouchEvent) {
  if (event.type === 'touchstart') {
    for (const touch of event.changedTouches) {
      circles[touch.identifier] = {
        color: colors.pop()!
      }
    }
    if (waitId) {
      window.clearTimeout(waitId)
      waitId = undefined
    }
    waitId = window.setTimeout(pick, 2000)
  }
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    for (const touch of event.changedTouches) {
      const circle = circles[touch.identifier]
      colors.push(circle.color)
      delete circles[touch.identifier]
    }
    if (waitId && Object.keys(circles).length === 0) {
      window.clearTimeout(waitId)
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const touch of event.touches) {
    drawCircle(touch.clientX, touch.clientY, circles[touch.identifier].color)
  }
}

canvas?.addEventListener('touchstart', draw, {passive: true})
canvas?.addEventListener('touchmove', draw, {passive: true})
canvas?.addEventListener('touchend', draw)
canvas?.addEventListener('touchcancel', draw)
