class Map {
    constructor(gameEngine, x, y, width, height) {
        Object.assign(this, {gameEngine, x, y});
        this.background = ASSET_MANAGER.getAsset("./sprites/grass.jpg");

        this.dead = false;
        this.width = 320;
        this.height = 320;
    }

    update() {

    }

    draw(ctx) {
        const numRows = Math.ceil(2500 / this.height); 
        const numCols = Math.ceil(2500 / this.width); 

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                
                let x = this.x + col * this.width;
                let y = this.y + row * this.height;

                
                ctx.drawImage(this.background, x, y, this.width, this.height);
            }
        }
    }


    getWidth() {
        return 2500;
    }

    getHeight() {
        return 2500;
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

        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {
        this.updateBB();
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.startX, this.startY, 40, 60, this.x, this.y, this.width, this.height);

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};
