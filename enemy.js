class Enemy {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");
        

        this.animator = new Animator(this.spritesheet, 0, 0, 200, 100, 3, 0.8);

        // Initial position and speed
        this.x = 0;
        this.y = 0;
        this.speed = 50;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y)
        //this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}