class TheProtagonist {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/test.png");
        this.bgd = ASSET_MANAGER.getAsset("./sprites/forest.png");

<<<<<<< Updated upstream
        this.animator = new Animator(this.spritesheet, 0, 0, 45, 80, 3, 0.8);

        this.x = 0;
        this.y = 0;

        this.cameraX = 0;
        this.cameraY = 0;
        this.speed = 0.5;
    }

    update() {
        //const elapsed = this.game.clockTick;

=======
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
>>>>>>> Stashed changes
        // Reset movement values
        let deltaX = 0;
        let deltaY = 0;
        
        // Check individual directions
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        ctx.drawImage(this.bgd, 0, 0);
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        ctx.setTransform(1, 0, 0, 1, -this.cameraX, -this.cameraY);
        this.cameraX = this.x - ctx.canvas.width / 2;
        this.cameraY = this.y - ctx.canvas.height / 2;
=======
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    
        // Calculate the center position of the character
        const centerX = this.x + this.animator.width / 2;
        const centerY = this.y + this.animator.height / 2;
    
        // Set the transformation to center the camera on the character's center
        ctx.setTransform(1, 0, 0, 1, ctx.canvas.width / 2 - centerX, ctx.canvas.height / 2 - centerY);
>>>>>>> Stashed changes
    }
}
