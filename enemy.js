class Enemy {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");
        this.bgd = ASSET_MANAGER.getAsset("./sprites/forest.png");

        this.animator = new Animator(this.spritesheet, 0, 0, 200, 100, 3, 0.8);

        // Initial position and speed
        this.x = 40;
        this.y = 40;
        this.speed = enemySpeed;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.bgd, 0, 0);
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}