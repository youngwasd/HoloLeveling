class Enemy {
    constructor(game, x, y, speed) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");
        

        this.animator = new Animator(this.spritesheet, 0, 0, 150, 125, 1, 0.8);

        // Initial position and speed
        this.x = x;
        this.y = y;
        this.speed = speed;

        this.hitpoints = 100;
        this.maxhitpoints = 100;
        this.radius = 20;

        this.healthbar = new HealthBar(this, false);
    };

    update() {
        const protagonist = this.game.entities.find(entity => entity instanceof TheProtagonist);

        const elapsed = this.game.clockTick;

        if (protagonist) {
            // Calculate the direction vector from enemy to protagonist
            const deltaX = protagonist.x - this.x;
            const deltaY = protagonist.y - this.y;

            // Normalize the vector
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedDeltaX = (deltaX / length) * this.speed * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.speed * elapsed;

            // Update enemy position
            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;
        }
    }
    
    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y)
        this.healthbar.draw(ctx);
    };
}
