class TheProtagonist {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/test.png");
        this.bgd = ASSET_MANAGER.getAsset("./sprites/forest.png");

        this.animator = new Animator(this.spritesheet, 0, 0, 45, 80, 3, 0.8);

        this.x = 0;
        this.y = 0;

        this.cameraX = 0;
        this.cameraY = 0;
        this.speed = 0.5;
    }

    update() {
        //const elapsed = this.game.clockTick;

        // Reset movement values
        let deltaX = 0;
        let deltaY = 0;
        
        // Check individual directions
        if (this.game.left) {
            deltaX -= this.speed;
        }

        if (this.game.right) {
            deltaX += this.speed;
        }

        if (this.game.up) {
            deltaY -= this.speed;
        }

        if (this.game.down) {
            deltaY += this.speed;
        }

        // Normalize the movement vector
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (length !== 0) {
            const normalizedDeltaX = (deltaX / length) * this.speed;
            const normalizedDeltaY = (deltaY / length) * this.speed;

            // Update position
            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;
        }
     }

    draw(ctx) {
        ctx.drawImage(this.bgd, 0, 0);
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        ctx.setTransform(1, 0, 0, 1, -this.cameraX, -this.cameraY);
        this.cameraX = this.x - ctx.canvas.width / 2;
        this.cameraY = this.y - ctx.canvas.height / 2;
    }
}
