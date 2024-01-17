class TheProtagonist {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/test.png");
        this.bgd = ASSET_MANAGER.getAsset("./sprites/forest.png");

        this.animator = new Animator(this.spritesheet, 0, 0, 45, 80, 3, 0.8, 2);

        this.x = 0;
        this.y = 0;
        this.cameraX = this.x;
        this.cameraY = this.y;
        this.speed = 0.5;
        this.mapWidth = this.map.getWidth();
        this.mapHeight = this.map.getHeight();
    }

    update() {
        // Reset movement values
        let deltaX = 0;
        let deltaY = 0;
        
        // Check individual directions
        if (this.game.left && this.x > 0) {
            deltaX -= this.speed;
        }

        if (this.game.right && this.x < this.mapWidth - this.animator.width) {
            deltaX += this.speed;
        }

        if (this.game.up && this.y > 0) {
            deltaY -= this.speed;
        }

        if (this.game.down && this.y < this.mapHeight - this.animator.height) {
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
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    
        // Calculate the center position of the character
        const centerX = this.x + this.animator.width / 2;
        const centerY = this.y + this.animator.height / 2;
    
        // Set the transformation to center the camera on the character's center
        ctx.setTransform(1, 0, 0, 1, ctx.canvas.width / 2 - centerX, ctx.canvas.height / 2 - centerY);
    }
}
