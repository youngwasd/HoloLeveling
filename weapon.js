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

        this.xOffset = this.direction === 0 ? 25 : -105;
        this.x = this.player.x + (this.playerWidth / 2) + this.xOffset;
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

        this.direction = this.player.facing === 0 ? 0 : 1;

        if (this.timer >= 0.5 && this.timer < 1.196) {
            this.isVisible = true;
        } else {
            this.isVisible = false;
        }

        if (this.timer >= 1.5) {
            this.isVisible = false;
            this.timer = 0;
        }

        this.xOffset = this.direction === 0 ? 25 : -105;
        this.x = this.player.x + (this.playerWidth / 2) + this.xOffset;
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

class Fireball {
    constructor(game, player) {
        Object.assign(this, {game, player});

        this.right = ASSET_MANAGER.getAsset("./sprites/fireball_right.png");
        this.left = ASSET_MANAGER.getAsset("./sprites/fireball_left.png");

        this.animator = [];
        this.width = 502 / 4;
        this.height = 44;
        this.scale = 1;
        this.speed = 600;

        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.playerHeight = this.player.height * this.player.scale;
        this.playerWidth = this.player.width * this.player.scale;

        this.animator[0] = new Animator(this.right, 0, 0, this.width, this.height, 4, 0.2, this.scale);
        this.animator[1] = new Animator(this.left, 0, 0, this.width, this.height, 4, 0.2, this.scale);
        this.animator[1].reverse();

        this.direction = this.player.facing;

        this.xOffset = this.player.facing === 0 ? 35 : -170;
        this.x = this.player.x + (this.playerWidth / 2) + this.xOffset;
        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);

        this.balls = [];
        this.damage = 100;

        setInterval(() => { // fireball every 2.5 seconds
            this.fire();
        }, 2500);

        this.updateBB();
    };

    fire() {
        if (this.player.weapons.fireball) {
            const ball = {
                x: this.x,
                y: this.y,
                width: this.scaledWidth,
                height: this.scaledHeight,
                hit: false,
                direction: this.direction
            }
    
            this.balls.push(ball);
        }
    };

    updateBB() {
        this.balls.forEach(function(ball) {
            ball.BB = new BoundingBox(ball.x, ball.y, ball.width, ball.height);
        });
    };

    update() {
        this.xOffset = this.player.facing === 0 ? 35 : -170;
        this.x = this.player.x + (this.playerWidth / 2) + this.xOffset;
        this.y = this.player.y + (this.playerHeight / 2) - (this.scaledHeight / 2);

        this.direction = this.player.facing;

        const that = this;
        this.balls.forEach(function (ball) {
            if (!ball.hit) {
                that.game.entities.forEach(function (entity) {
                    if (entity.BB && ball.BB && ball.BB.collide(entity.BB)) {
                        if (entity instanceof Goblin || entity instanceof Issac ||
                            entity instanceof Zombie || entity instanceof Golem ||
                            entity instanceof Bats) {
                                ball.hit = true;
                                entity.hitpoints -= that.damage;
                        } else if (entity instanceof Tree) {
                            ball.hit = true;
                        }
                    }
                });
            }
        });
        this.updateBB();
    };

    draw(ctx) {
        this.balls.forEach(function (ball) {
            if (!ball.hit) {
                const speed = this.speed * this.game.clockTick;
                ball.x += ball.direction === 0 ? speed : -speed;
                this.animator[ball.direction].drawFrame(this.game.clockTick, ctx, ball.x, ball.y);

                if (params.DEBUG) {
                    if (this.game.camera.upgradeScreen.getVisible()) {
                        return;
                    } else {
                        ctx.strokeStyle = 'Red';
                        ctx.strokeRect(ball.BB.x, ball.BB.y, ball.BB.width, ball.BB.height);
                    }
                }
            }
        }, this);
        this.updateBB();
    };
};