class Dagger {
    constructor(game, player) {
        Object.assign(this, {game, player});

        this.rightSlash = ASSET_MANAGER.getAsset("./sprites/newsprite3.png");
        this.leftSlash = ASSET_MANAGER.getAsset("./sprites/newsprite4.png");

        this.animator = [];
        this.scale = 3;
        this.width = 58;
        this.height = 44;

        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.xOffset = this.player.facing == 0 ? 60 : -1.5;

        this.playerHeight = this.player.height * this.player.scale;
        this.playerWidth = this.player.width * this.player.scale;

        this.x = this.player.facing == 0 ? this.player.x + (this.playerWidth / 2) - (this.scaledWidth / 2) + this.xOffset :
                    this.player.x - (this.playerWidth / 2) - (this.scaledWidth / 2) - this.xOffset;
        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);

        this.animator[0] = new Animator(this.rightSlash, 2, 0, this.width, this.height, 3, .31, this.scale);
        this.animator[1] = new Animator(this.leftSlash, 2, 0, this.width, this.height, 3, .31, this.scale);
        this.animator[1].reverse();

        this.damage = 75;

        this.updateBB();

        this.isVisible = false;  // Flag to track visibility
        this.timer = 0;         // Timer to count seconds
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    }

    update() {
        if (this.player.dead == true) return;

        this.xOffset = this.player.facing == 0 ? 60 : -1.5;

        this.x = this.player.facing == 0 ? this.player.x + (this.playerWidth / 2) - (this.scaledWidth / 2) + this.xOffset :
                    this.player.x - (this.playerWidth / 2) - (this.scaledWidth / 2) - this.xOffset;
        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);

        // Update timer
        this.timer += this.game.clockTick;

        if (this.timer >= 0.92) {
            this.timer = 0;  // Reset timer
            this.isVisible = !this.isVisible;  // Toggle visibility
        }

        this.updateBB();
    }

    draw(ctx) {
        if (this.isVisible) {
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
        }
    }
}