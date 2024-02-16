class TheProtagonist {
    constructor(game, map, end) {
        this.end = end;
        this.game = game;
        this.map = map;
        this.protag_right = ASSET_MANAGER.getAsset("./sprites/protag_right.png");
        this.protag_left = ASSET_MANAGER.getAsset("./sprites/protag_left.png");
        this.dagger = true;

        this.x = 1000;
        this.y = 1000;
        this.width = 89;
        this.height = 129;
        this.scale = 0.7;

        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;
        this.yOffset = 40;

        this.cameraX = this.x - this.game.ctx.canvas.width / 2 + (this.scaledWidth / 2);
        this.cameraY = this.y - this.game.ctx.canvas.height / 2 + (this.scaledHeight / 2) - this.yOffset;

        this.speed = 500;
        this.animator = [];
        this.animator[0] = new Animator(this.protag_right, 0, 0, this.width, this.height, 5, 0.2, this.scale);
        this.animator[1] = new Animator(this.protag_left, 0, 0, this.width, this.height, 5, 0.2, this.scale);

        this.mapWidth = this.map.getWidth();
        this.mapHeight = this.map.getHeight();

        this.facing = 0; // start facing right

        this.hitpoints = 100;
        this.maxhitpoints = 100;
        this.hitCooldown = 0;
        this.hitCooldownInterval = 1;

        this.dead = false;

        this.healthbar = new HealthBar(this, true);
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        //this.BB = new BoundingBox(this.x + 8, this.y + 8, this.scaledWidth - 15, this.scaledHeight - 10);
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    };

    update() {
        let deltaX = 0;
        let deltaY = 0;

        let elapsed = this.game.clockTick;

        if (this.game.left && this.x > 0) {
            deltaX -= this.speed * elapsed;
            this.facing = 1; 
        }

        if (this.game.right && this.x < this.mapWidth - this.scaledWidth) {
            deltaX += this.speed * elapsed;
            this.facing = 0; 
        }

        if (this.game.up && this.y > 0) {
            deltaY -= this.speed * elapsed;
        }

        if (this.game.down && this.y < this.mapHeight - this.scaledHeight) {
            deltaY += this.speed * elapsed;
        }

        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (length !== 0) {
            const normalizedDeltaX = (deltaX / length) * this.speed * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.speed * elapsed;

            // Update position
            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;

            this.cameraX = this.x - this.game.ctx.canvas.width / 2 + (this.scaledWidth / 2);
            this.cameraY = this.y - this.game.ctx.canvas.height / 2 + (this.scaledHeight / 2) - this.yOffset;

            // Ensure camera stays within the bounds
            this.cameraX = Math.max(0, Math.min(this.cameraX, this.mapWidth - this.game.ctx.canvas.width));
            this.cameraY = Math.max(0, Math.min(this.cameraY, this.mapHeight - this.game.ctx.canvas.height));
        }

        this.updateBB();

        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Tree) {
                    if (that.lastBB.right <= entity.BB.left) { 
                        that.x = entity.BB.left - that.BB.width;
                        if (deltaX > 0) deltaX = 0;
                    } else if (that.lastBB.left >= entity.BB.right) {
                        that.x = entity.BB.right;
                        if (deltaX < 0) deltaX = 0;
                    } else if (that.lastBB.bottom <= entity.BB.top) { 
                        that.y = entity.BB.top - that.BB.height;
                        if (deltaY > 0) deltaY = 0;
                    } else if (that.lastBB.top >= entity.BB.bottom) { 
                        that.y = entity.BB.bottom;
                        if (deltaY < 0) deltaY = 0;
                    }
                } else if (entity instanceof Issac || entity instanceof Bats) {
                    if (that.BB.collide(entity.BB)) {
                        if (that.hitCooldown <= 0) { 
                            that.hitpoints -= 5;
                            that.hitCooldown = that.hitCooldownInterval;
                        } else {
                            that.hitCooldown -= that.game.clockTick;
                        }
                    }
                } else if (entity instanceof Goblin || entity instanceof Zombie) {
                    if (that.BB.collide(entity.BB)) {
                        if (that.hitCooldown <= 0) {
                            that.hitpoints -= 10;
                            that.hitCooldown = that.hitCooldownInterval;
                        } else {
                            that.hitCooldown -= that.game.clockTick;
                        }
                    }
                }
            }
        });

        this.updateBB();

        if (this.hitpoints <= 0) {
            console.log("You died");
            this.end.isDead = true;
            this.dead = true;
        }
    };    
    
    draw(ctx) {
        if (this.facing == 0) {
            this.animator[0].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.facing == 1) {
            this.animator[1].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }

        this.updateBB();

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        const centerX = this.x + this.scaledWidth / 2;
        const centerY = this.y + this.scaledWidth / 2;

        ctx.setTransform(1, 0, 0, 1, -centerX + ctx.canvas.width / 2, -centerY + ctx.canvas.height / 2);
        this.healthbar.draw(ctx);
    };
}