'use strict'

/**
 * @class
 */
class NPC extends GameObject {
    /**
     *
     * @param {Vector2d} [coords = new Vector2d(0,0)]
     * @param {Vector2d} [centre = new Vector2d(0,0)]
     * @param {DrawableObject} drawable
     * @param hitbox
     * @param id
     * @param manager
     */
    constructor(coords = new Vector2d(0, 0), centre = new Vector2d(0, 0), drawable, hitbox, id = Game.getUniqId(), manager = undefined) {
        super(id)
        this.actor = new MovableActor(coords, centre)
        this.drawable = drawable
        this.manager = manager
        this.statsAffector = new StatsAffector()
        this.statsManager = new StatsManager()
        this.hitbox = hitbox//new Hitbox(HITBOX_CIRCLE, new Vector2d(centre), 26);
        this.direction = new Vector2d(0, 0)
        this.walking = false
        this.collisonSolveStrategy = "stay"
        this.abilities = [AbilityFactory.createFireBallAbility(this), AbilityFactory.createLigthningAbility(this)]
    }

    isDead() {
        return this.statsManager.stats.hp === 0
    }

    drawHPBar() {
      let hpB = this.drawable.canvasCoord.add(~~(this.drawable.drowable.width / 2 - Game.HealthBarBackgroudTexture.width / 2), -4, new Vector2d())
      let hp = Object.create(Game.HealthBarOverlayTexture)
      Game.HealthBarBackgroudTexture.render(hpB)
      let frac = this.statsManager.stats.hp / this.statsManager.hpLimit
      ctx.drawImage(hp.img, hpB.x + 1, hpB.y + 1, ~~(hp.img.width * frac) ,hp.img.height)
    }

    render() {
        this.drawable.render()
        this.drawHPBar()
    }

    Update() {
        if (this.isDead()) {
            Game.currentWorld.currentRoom.delete(this)
        }
        this.actor.update()
        if (this.manager !== undefined) {
            this.manager.update()

        }
        if (this.walking === false) {
            this.drawable.drowable.switch("idle", this.direction)
            this.collisonSolveStrategy = 'stay'
        } else {
            this.drawable.drowable.switch("go", this.direction)
            this.collisonSolveStrategy = 'move'
        }
        this.hitbox.update(this.actor.centre)
        for (let ability of this.abilities) {
            if (ability !== undefined) {
                ability.update(Game.step)
            }
        }
        this.statsManager.stats.mana += 0.5
        this.statsManager.correctStats()
    }

    /**
     *
     * @param {Collision} collision
     */

    onCollide(collision) {
    }

    toJSON() {
        return {
            id: this.id,
            actor: this.actor,
            drawable: this.drawable,
            hitbox: this.hitbox,
            manager: this.manager !== undefined,
            direction: this.direction,
            collisonSolveStrategy: this.collisonSolveStrategy,
            walking: this.walking
        }
    }


    /**
     *
     * @param {NPC} object
     */
    static fromJSON(object) {
        let npc
        if (object.manager === true) {
            npc = TilesFactory.CreatePlayer()
            npc.id = object.id
            npc.actor = MovableActor.fromJSON(object.actor)
            npc.hitbox = ("type" in object.hitbox) ? Hitbox.fromJSON(object.hitbox) : ("radius" in object.hitbox)
                ? CircleHitbox.fromJSON(object.hitbox) : AABB.fromJSON(object.hitbox)
            npc.direction = Vector2d.fromJSON(object.direction)
            npc.collisonSolveStrategy = object.collisonSolveStrategy
            npc.walking = object.walking
            Game.camera.focusOn(npc.actor)
        } else {
            npc = TilesFactory.CreateStaticNPC(0, 0)
            npc.id = object.id
            npc.actor = MovableActor.fromJSON(object.actor)
            npc.hitbox = Hitbox.fromJSON(object.hitbox)
            npc.direction = Vector2d.fromJSON(object.direction)
            npc.collisonSolveStrategy = object.collisonSolveStrategy
            npc.walking = object.walking
        }

        return npc
    }
}
