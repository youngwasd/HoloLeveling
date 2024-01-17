class Map {
    constructor(gameEngine, x, y, width, height, scale) {
        Object.assign(this, {gameEngine, x, y, width, height, scale});
        this.background = ASSET_MANAGER.getAsset("./sprites/forest.png");
    }

    update() {

    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    draw(ctx) {
        ctx.drawImage(this.background, this.x, this.y, this.width, this.height);
    }
}
