'use strict'

class BarControler {
    /**
     *
     * @param {NPC} player
     */
    constructor(player) {
        this.hpBar = document.getElementById("hpBar")
        this.manaBar = document.getElementById("manaBar")
        this.player = player
        this.hp = player.statsManager.hpLimit
        this.mana = player.statsManager.manaLimit
        this.hpBar.setAttribute("data-total", String(this.player.statsManager.hpLimit))
        this.manaBar.setAttribute("data-total", String(this.player.statsManager.manaLimit))
        this.hpBar.innerHTML = "<a class='hpCount'><b>" + ~~(this.hp) + "/" + this.player.statsManager.hpLimit + "</b></a>"
        this.manaBar.innerHTML = "<a class='manaCount'><b>" + ~~(this.mana) + "/" + this.player.statsManager.manaLimit + "</b></a>"
    }

    /**
     * @return {Number}
     */
    getHp() {
        return Number(this.hpBar.getAttribute("data-value"))
    }

    /**
     * @return {Number}
     */
    getMana() {
        return Number(this.manaBar.getAttribute("data-value"))
    }

    /**
     *
     * @param {Number} hp
     */
    setHp(hp) {
        this.hpBar.setAttribute("data-value", String(hp))
        this.hpBar.style["width"] = String(~~(hp / this.hpBar.getAttribute("data-total") * 100)) + "%"
    }

    /**
     *
     * @param {Number} mana
     */
    setMana(mana) {
        this.manaBar.setAttribute("data-value", String(mana))
        this.manaBar.style["width"] = String(~~(mana / this.manaBar.getAttribute("data-total") * 100)) + "%"
    }

    update() {
        if (this.hp !== this.player.statsManager.stats.hp) {
            this.hp = this.player.statsManager.stats.hp
            this.setHp(this.player.statsManager.stats.hp)
            this.hpBar.innerHTML = "<a class='hpCount'><b>" + ~~(this.hp) + "/" + this.player.statsManager.hpLimit + "</b></a>"
        }
        if (this.mana !== this.player.statsManager.stats.mana) {
            this.mana = this.player.statsManager.stats.mana
            this.setMana(this.player.statsManager.stats.mana)
            this.manaBar.innerHTML = "<a class='manaCount'><b>" + ~~(this.mana) + "/" + this.player.statsManager.manaLimit + "</b></a>"
        }
    }
}

