class Dagger {
    constructor(game, player) {
        Object.assign(this, { game, player });

        this.rightSlash = ASSET_MANAGER.getAsset("./sprites/slashv3.png");
        this.leftSlash = ASSET_MANAGER.getAsset("./sprites/slashv3_left.png");

        this.animator = [];
        this.scale = 1;
        this.width = 80;
        this.height = 116;

        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.playerHeight = this.player.height * this.player.scale;
        this.playerWidth = this.player.width * this.player.scale;

        this.xOffset = this.direction === 0 ? 65 : 3;
        this.x = this.player.facing === 0 ? this.player.x + (this.playerWidth / 2) - (this.scaledWidth / 2) + this.xOffset :
            this.player.x - (this.playerWidth / 2) - (this.scaledWidth / 2) - this.xOffset;
        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);

        this.animator[0] = new Animator(this.rightSlash, 0, 0, this.width, this.height, 7, 0.1, this.scale);
        this.animator[1] = new Animator(this.leftSlash, 0, 0, this.width, this.height, 7, 0.1, this.scale);
        this.animator[1].reverse();

        this.direction = 0;
        this.damage = 75;

        this.isVisible = false;
        this.timer = 0;

        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    };

    update() {
        if (this.player.dead) return;
        
        this.timer += this.game.clockTick;
        
        // if (this.animator[this.direction].isDone()) this.direction = this.player.facing === 0 ? 0 : 1;

        this.direction = this.player.facing === 0 ? 0 : 1;
        
        if (this.timer >= 1.5) {
            this.isVisible = true;
            this.timer = 0;
        }
        
        this.xOffset = this.direction === 0 ? 65 : 3;
        this.x = this.direction === 0 ? this.player.x + (this.playerWidth / 2) - (this.scaledWidth / 2) + this.xOffset :
            this.player.x - (this.playerWidth / 2) - (this.scaledWidth / 2) - this.xOffset;
        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);

        this.updateBB();
    };

    draw(ctx) {
        if (this.isVisible) {
            this.animator[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y);
            
            if (params.DEBUG) {
                ctx.strokeStyle = 'Red';
                ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
            }
        }
    };
};
