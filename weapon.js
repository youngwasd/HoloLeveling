class Dagger {
    constructor(game, player) {
        Object.assign(this, {game, player});

        this.rightDag = ASSET_MANAGER.getAsset("./sprites/dagger_right.png");
        this.leftDag = ASSET_MANAGER.getAsset("./sprites/dagger_left.png");
        
        this.animator = [];
        this.scale = 1;
        this.width = 50;
        this.height = 25;

        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.xOffset = this.player.facing == 0 ? 70 : -27;

        this.playerHeight = this.player.scaledHeight;
        this.playerWidth = this.player.scaledWidth;

        this.x = this.player.facing == 0 ? this.player.x + (this.playerWidth / 2) - (this.scaledWidth / 2) + this.xOffset : 
                    this.player.x - (this.playerWidth / 2) - (this.scaledWidth / 2) - this.xOffset;

        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);
        
        this.animator[0] = new Animator(this.rightDag, 2, 0, this.width, this.height, 5, 0.15);
        this.animator[1] = new Animator(this.leftDag, 2, 0, this.width, this.height, 5, 0.15);
        this.animator[1].reverse();

        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    };

    update() {
        this.xOffset = this.player.facing == 0 ? 70 : -27;
        
        this.x = this.player.facing == 0 ? this.player.x + (this.playerWidth / 2) - (this.scaledWidth / 2) + this.xOffset : 
                    this.player.x - (this.playerWidth / 2) - (this.scaledWidth / 2) - this.xOffset;
        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);
        
        this.updateBB();
    };

    draw(ctx) {
        if (this.player.facing == 0) {
            this.animator[0].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.player.facing == 1) {
            this.animator[1].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
        
        this.updateBB();

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};
