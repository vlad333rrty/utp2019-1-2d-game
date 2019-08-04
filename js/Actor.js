class Actor {
    /**
     * 
     * @param {Vector2d} [coords = new Vector2d(0,0)] 
     * @param {Vector2d} [centre = new Vector2d(0,0)]
     */
    constructor(coords = new Vector2d(0, 0), centre = new Vector2d(0, 0)) {
        this.position = coords
        this.centre = centre
    }
}