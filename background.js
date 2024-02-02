class Map {
    constructor(gameEngine, x, y, width, height) {
        Object.assign(this, {gameEngine, x, y, width, height});
        this.background = ASSET_MANAGER.getAsset("./sprites/forest2.jpg");

        this.dead = false;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.background, this.x, this.y, this.width, this.height);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}

class Tree {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees.png");
        this.width = 100;
        this.height = 120;
        this.startX = 116;
        this.startY = 5;

        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, 40, 60, this.x, this.y, this.width, this.height);

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }
}
