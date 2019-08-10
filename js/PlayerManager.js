'use strict'

/**
 * Player control
 */
class PlayerManager {
    /**
     *
     * @param {NPC} player
     */
    constructor(player) {
        this.player = player
    }

    update() {
        let speed = 10
        let xDirection = 0
        let yDirection = 0
        if (keyboard.KeyW || keyboard.ArrowUp) {
            yDirection -= speed
        }
        if (keyboard.KeyS || keyboard.ArrowDown) {
            yDirection += speed
        }
        if (keyboard.KeyA || keyboard.ArrowLeft) {
            xDirection -= speed
        }
        if (keyboard.KeyD || keyboard.ArrowRight) {
            xDirection += speed
        }
        if (xDirection !== 0 && yDirection !== 0) {
            xDirection = ~~(xDirection / Math.sqrt(2))
            yDirection = ~~(yDirection / Math.sqrt(2))
        }
        this.player.actor.changePosition(new Vector2d(xDirection, yDirection))
    }
}