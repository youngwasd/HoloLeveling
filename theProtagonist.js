class TheProtagonist {
    constructor(game, map) {
        this.game = game;
        this.map = map;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/test.png");

        this.animator = new Animator(this.spritesheet, 0, 0, 45, 80, 3, 0.8, 2);

        this.x = 0;
        this.y = 0;
        this.cameraX = this.x;
        this.cameraY = this.y;
        this.speed = 500;

        this.mapWidth = this.map.getWidth();
        this.mapHeight = this.map.getHeight();

        this.radius = 20;
        this.hitpoints = 100;
        this.maxhitpoints = 100;

        this.healthbar = new HealthBar(this, true);
    };

    update() {
        // Reset movement values
        let deltaX = 0;
        let deltaY = 0;

        let elapsed = this.game.clockTick;

        // Check individual directions
        if (this.game.left && this.x > 0) {
            deltaX -= this.speed * elapsed;
        }

        if (this.game.right && this.x < this.mapWidth - this.animator.width) {
            deltaX += this.speed * elapsed;
        }

        if (this.game.up && this.y > 0) {
            deltaY -= this.speed * elapsed;
        }

        if (this.game.down && this.y < this.mapHeight - this.animator.height) {
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

            this.cameraX = this.x - this.game.ctx.canvas.width / 2;
            this.cameraY = this.y - this.game.ctx.canvas.height / 2;

            // Ensure camera stays within the bounds
            this.cameraX = Math.max(0, Math.min(this.cameraX, this.mapWidth - this.game.ctx.canvas.width));
            this.cameraY = Math.max(0, Math.min(this.cameraY, this.mapHeight - this.game.ctx.canvas.height));
        }
    };

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    
        // Calculate the center position of the character
        const centerX = this.x + this.animator.width / 2;
        const centerY = this.y + this.animator.height / 2;
    
        // Set the transformation to center the camera on the character's center
        ctx.setTransform(1, 0, 0, 1, -centerX + ctx.canvas.width / 2, -centerY + ctx.canvas.height / 2);

        this.healthbar.draw(ctx);
    };
};
