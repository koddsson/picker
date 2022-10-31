const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

canvas.width = window.innerWidth
canvas.height = window.innerHeight

function createCircle(x: number, y: number, radius = 70) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = 'green'
  ctx.fill()
  ctx.lineWidth = 5
  ctx.strokeStyle = '#003300'
  ctx.stroke()
}

function draw(event: TouchEvent) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const touch of event.touches) {
    createCircle(touch.clientX, touch.clientY)
  }
}

canvas?.addEventListener('touchstart', draw, {passive: true})
canvas?.addEventListener('touchmove', draw, {passive: true})
canvas?.addEventListener('touchend', draw)
canvas?.addEventListener('touchcancel', draw)
