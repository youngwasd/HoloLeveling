class Enemy {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");
        

        this.animator = new Animator(this.spritesheet, 0, 0, 150, 125, 1, 0.8);

        // Initial position and speed
        this.x = x;
        this.y = y;
        this.speed = 50;

        this.hitpoints = 100;
        this.maxhitpoints = 100;
        this.radius = 20;

        this.healthbar = new HealthBar(this, false);
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y)
        this.healthbar.draw(ctx);
    };
}