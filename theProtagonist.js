class TheProtagonist {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/test.png");

        this.animator = new Animator(this.spritesheet, 0, 0, 45, 80, 3, 0.8);

        this.x = 0;
        this.y = 0;
        this.speed = 50;
    }

    update() {
        const elapsed = this.game.clockTick;

        // Reset movement values
        let deltaX = 0;
        let deltaY = 0;
        
        // Check individual directions
        if (this.game.left) {
            deltaX -= this.speed * elapsed;
        }

        if (this.game.right) {
            deltaX += this.speed * elapsed;
        }

        if (this.game.up) {
            deltaY -= this.speed * elapsed;
        }

        if (this.game.down) {
            deltaY += this.speed * elapsed;
        }

        // Normalize the movement vector
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (length !== 0) {
            const normalizedDeltaX = (deltaX / length) * this.speed * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.speed * elapsed;

            // Update position
            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;
        }
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);     
        
    }
}
