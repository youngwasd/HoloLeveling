class Garlic {
    constructor(game,player) {
        this.game = game;
        this.player = player;
        this.x = this.player.x;
        this.y = this.player.y;
        this.width = this.player.width + 70
        this.height = this.player.height + 50;

        this.playerCenterX = this.player.x + this.player.width / 2;
        this.playerCenterY = this.player.y + this.player.height / 2;
    }

    updateBC() {
        // need bounding circle for garlic
    }

    update() {
        this.playerCenterX = this.player.x + this.player.width / 2;
        this.playerCenterY = this.player.y + this.player.height / 2;
        this.x = this.player.x - 35;
        this.y = this.player.y - 25;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.playerCenterX, this.playerCenterY, this.player.width, 0, 2 * Math.PI);
        ctx.stroke();        
    }
}

class Dagger {
    constructor(game, player) {
        Object.assign(this, {game, player});

        this.scale = 1;
        this.x = this.player.x + 30;
        this.y = this.player.y;
        this.width = 0;
        this.height = 0;

        this.updateBB();
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width * this.scale, this.height * this.scale);
    };

    update() {
    }

    draw(ctx) {
        

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }
}