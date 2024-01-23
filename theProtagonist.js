class TheProtagonist {
    constructor(game, map) {
        this.game = game;
        this.map = map;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/protagonist.png");

        this.x = 1000;
        this.y = 1000;
        this.width = 69;
        this.height = 100;
        this.cameraX = this.x - this.game.ctx.canvas.width / 2;;
        this.cameraY = this.y - this.game.ctx.canvas.height / 2;

        this.speed = 500;
        this.animator = new Animator(this.spritesheet, 2, 0, this.width, this.height, 5, 0.2);
        this.mapWidth = this.map.getWidth();
        this.mapHeight = this.map.getHeight();

        this.hitpoints = 100;
        this.maxhitpoints = 100;
        this.hitCooldown = 0;
        this.hitCooldownInterval = 1;

        this.garlic = true;

        this.dead = false;

        this.updateBB();
        this.healthbar = new HealthBar(this, true);
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {
        // Reset movement values
        let deltaX = 0;
        let deltaY = 0;

        let elapsed = this.game.clockTick;

        // Check individual directions
        if (this.game.left && this.x > 0) {
            deltaX -= this.speed * elapsed;
        }

        if (this.game.right && this.x < this.mapWidth - this.animator.width) {
            deltaX += this.speed * elapsed;
        }

        if (this.game.up && this.y > 0) {
            deltaY -= this.speed * elapsed;
        }

        if (this.game.down && this.y < this.mapHeight - this.animator.height) {
            deltaY += this.speed * elapsed;
        }
        
        // Normalize the movement vector
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (length !== 0) {
            const normalizedDeltaX = (deltaX / length) * this.speed * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.speed * elapsed;

            // Update position
            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;

            this.cameraX = this.x - this.game.ctx.canvas.width / 2;
            this.cameraY = this.y - this.game.ctx.canvas.height / 2;

            // Ensure camera stays within the bounds
            this.cameraX = Math.max(0, Math.min(this.cameraX, this.mapWidth - this.game.ctx.canvas.width));
            this.cameraY = Math.max(0, Math.min(this.cameraY, this.mapHeight - this.game.ctx.canvas.height));
        }
        this.updateBB();
        

        // collision
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Tree) {
                    if (that.lastBB.right <= entity.BB.left) { // hit the left of tree
                        that.x = entity.BB.left - that.BB.width;
                        if (deltaX > 0) deltaX = 0;
                    } else if (that.lastBB.left >= entity.BB.right) { // hit the right of tree
                        that.x = entity.BB.right;
                        if (deltaX < 0) deltaX = 0;
                    } else if (that.lastBB.bottom <= entity.BB.top) { // hit the top of tree
                        that.y = entity.BB.top - that.BB.height;
                        if (deltaY > 0) deltaY = 0;
                    } else if (that.lastBB.top >= entity.BB.bottom) { // hit the bottom of tree
                        that.y = entity.BB.bottom;
                        if (deltaY < 0) deltaY = 0;
                    }
                } else if (entity instanceof Enemy) {
                    if (that.BB.collide(entity.BB)) {
                        if (that.hitCooldown <= 0) { // logic for player getting hit might need to be changed
                            that.hitpoints--;
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
            //this.dead = true;
        }
    };

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        // Calculate the center position of the character
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
    
        // Set the transformation to center the camera on the character's center
        ctx.setTransform(1, 0, 0, 1, -centerX + ctx.canvas.width / 2, -centerY + ctx.canvas.height / 2);

        this.healthbar.draw(ctx);
    };
};
