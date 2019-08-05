'use strict'
class RoomRenderer {
    /**
     * @param {Number} margin 
     */
    constructor(margin) {
        this.camera = Game.camera;
        this.tileWidth = Game.tileWidth;
        this.tileHeight = Game.tileHeight;
        this.ledHeight =this.camera.getLedHeight();
        this.ledWidth = this.camera.getLedWidth();
        this.margin = margin;
        this.tileCount = [Math.ceil(this.ledWidth / this.tileWidth) + 2 * margin, Math.ceil(this.ledHeight / this.tileHeight) + 2 * margin];
    }

    /**
     * @param {Room} room 
     */
    render(room) {
        let cameraVec = this.camera.getPosition();
        let leftTop = [~~(cameraVec.x / this.tileWidth) - this.margin, ~~(cameraVec.y / this.tileHeight) - this.margin];
        let rightBot = [Math.min(leftTop[0] + this.tileCount[0], room.width - 1), Math.min(leftTop[1] + this.tileCount[1], room.height - 1)];
        leftTop = [Math.max(leftTop[0], 0), Math.max(leftTop[1], 0)];
        let tile = 0
        
        for (let i = leftTop[0]; i < rightBot[0]; i++){
            for (let j = leftTop[1]; j < rightBot[1]; j++) {
                tile = room.backgroundTiles[j][i];
                this.camera.setCanvasCoord(tile);
                tile.render();
            }
        }
        // Without sprites
        let sortArray = new Array();
        for (let i = leftTop[0]; i < rightBot[0]; i++){
            for (let j = leftTop[1]; j < rightBot[1]; j++) {
                let drowableMap = room.middlegroundTiles[i][j];
                drowableMap.forEach((key) => {
                    sortArray.push(key);
                })
            }
        }
        sortArray.sort((a, b) => {
            return (a.actor.centre.y > b.actor.centre.y ? 1:-1)
        });
        sortArray.forEach((key) => {
            this.camera.setCanvasCoord(key)
            key.render();
        })
    }
}
