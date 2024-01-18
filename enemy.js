class Enemy {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");

        this.x = 100;
        this.y = 100;
        this.speed = 1;

         }

         update() {
        const protagonist = this.game.entities.find(entity => entity instanceof TheProtagonist);

        if (protagonist) {
            // Calculate the direction vector from enemy to protagonist
            const deltaX = protagonist.x - this.x;
            const deltaY = protagonist.y - this.y;

            // Normalize the vector
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedDeltaX = (deltaX / length) * this.speed;
            const normalizedDeltaY = (deltaY / length) * this.speed;

            // Update enemy position
            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;
         }
         }

         draw(ctx) {
             ctx.drawImage(this.spritesheet, this.x, this.y)
             //this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
         }
}