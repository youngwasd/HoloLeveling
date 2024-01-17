class Enemy {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");
        

        this.animator = new Animator(this.spritesheet, 0, 0, 200, 100, 3, 0.8);

        // Initial position and speed
        this.x = x;
        this.y = y;
        this.speed = 50;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y)
    }
}