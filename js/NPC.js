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
        this.hitbox = hitbox
        this.direction = new Vector2d(0, 0)
        this.casting = 0
        this.state=STATE.idle
        this.collisonSolveStrategy = "stay"
        this.abilities = [AbilityFactory.createFireBallAbility(this), AbilityFactory.createLigthningAbility(this),AbilityFactory.Hit(this)]
    }

    isDead() {
        return this.statsManager.stats.hp === 0
    }

    drawHPBar() {
      if(this.statsManager.stats.hp != this.statsManager.hpLimit){
        let hpB = this.drawable.canvasCoord.add(~~(this.drawable.drowable.width / 2 - Game.HealthBarBackgroudTexture.width / 2), -4, new Vector2d())
        let hp = Object.create(Game.HealthBarOverlayTexture)
        Game.HealthBarBackgroudTexture.render(hpB)
        let frac = this.statsManager.stats.hp / this.statsManager.hpLimit
        ctx.drawImage(hp.img, hpB.x + 1, hpB.y + 1, ~~(hp.img.width * frac) ,hp.img.height)
      }
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
        if (this.casting) {
            this.casting--
        }else switch (this.state) {
            case STATE.walk:
                this.drawable.drowable.switch("go", this.direction)
                this.collisonSolveStrategy = 'move'
                break
            case STATE.attack:
                this.drawable.drowable.switch('beat',this.direction)
                break
            default:
                this.drawable.drowable.switch("idle", this.direction)
                this.collisonSolveStrategy = 'stay'
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
        return Serializations[this.type](this)
    }

    /**
     *
     * @param {NPC} object
     */
    static fromJSON(object) {
        let npc
        if (object.type === "player") {
            npc = TilesFactory.CreatePlayer()
            npc.id = object.id
            npc.actor = MovableActor.fromJSON(object.actor)
            npc.hitbox = ("type" in object.hitbox) ? Hitbox.fromJSON(object.hitbox) : ("radius" in object.hitbox)
                ? CircleHitbox.fromJSON(object.hitbox) : AABB.fromJSON(object.hitbox)
            npc.direction = Vector2d.fromJSON(object.direction)
            npc.collisonSolveStrategy = object.collisonSolveStrategy
            npc.walking = object.walking
         //   npc.statsManager = StatsManager.fromJSON(object.statsManager)
          //  npc.statsAffector = StatsAffector.fromJSON(object.statsAffector)
            Game.camera.focusOn(npc.actor)
            Game.player = npc
        } else if (object.type === "staticNpc") {
            npc = TilesFactory.CreateStaticNPC(0, 0,object.nav)
            npc.id = object.id
            npc.actor = MovableActor.fromJSON(object.actor)
            npc.hitbox = Hitbox.fromJSON(object.hitbox)
            npc.direction = Vector2d.fromJSON(object.direction)
            npc.collisonSolveStrategy = object.collisonSolveStrategy
            npc.walking = object.walking
            //   npc.statsManager = StatsManager.fromJSON(object.statsManager)
            //   npc.statsAffector = StatsAffector.fromJSON(object.statsAffector)
        }

        return npc
    }
}

const STATE={
    idle:0,
    walk:1,
    attack:2
}