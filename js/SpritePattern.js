'use strict'

class SpritePattern {
    constructor(id, image, frames, dir, x, y, height, width, once, speed) {
        this.id = id
        this.img = image
        this.frames = frames
        this.dir = dir
        this.spriteMapCoord = new Vector2d(x, y)
        this.width = width
        this.height = height
        this.once = once
        this.speed = speed
    }
}