class Map {
    constructor(gameEngine, x, y, width, height, scale) {
        Object.assign(this, {gameEngine, x, y, width, height, scale});
        this.background = ASSET_MANAGER.getAsset("./sprites/forest2.jpg");
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
    constructor(x, y, player) {
        this.player = player;
        this.x = x;
        this.y = y;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees.png");
        this.width = 50;
        this.height = 60;
        this.startX = 110;
        this.startY = 0;
        this.scale = 1.5;
    }

    update() {
        if (this.collidesWith(this.player)) {
            // Determine collision direction
            const playerCenterX = this.player.x + this.player.width / 2;
            const playerCenterY = this.player.y + this.player.height / 2;

            const treeCenterX = this.x + this.width / 2;
            const treeCenterY = this.y + this.height / 2;

            const deltaX = playerCenterX - treeCenterX;
            const deltaY = playerCenterY - treeCenterY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal collision
                if (deltaX > 0) {
                    this.player.x = this.x + this.width ;
                } else {
                    this.player.x = this.x - this.player.width;
                }
            } else {
                // Vertical collision
                if (deltaY > 0) {
                    this.player.y = this.y + this.height;
                } else {
                    this.player.y = this.y - this.player.height;
                }
            }

            // Update player's direction properties
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.player.north = false;
                this.player.south = false;
            } else {
                this.player.west = false;
                this.player.east = false;
            }
        }
    }

    collidesWith(player) {
        if (this.x + this.width>= this.player.x && this.x <= this.player.x + this.player.width ) {
            if (this.y + this.height>= this.player.y && this.y <= this.player.y + this.player.height) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}