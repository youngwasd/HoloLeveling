class Issac {
    constructor(game, x, y, speed, player) {
        Object.assign(this, {game, x, y, speed, player});

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");

        // Initial position
        this.width = 57; // for issac
        this.height = 67; // for issac
        this.scale = 1;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.8, this.scale);

        this.dead = false;
        this.hitpoints = 100;
        this.maxhitpoints = 100;

        this.updateBB();
        this.healthbar = new HealthBar(this, false);
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    }

    update() {
        const protagonist = this.game.entities.find(entity => entity instanceof TheProtagonist);
        const elapsed = this.game.clockTick;

        let deltaX = 0;
        let deltaY = 0;

        if (protagonist) {
            deltaX = protagonist.x - this.x;
            deltaY = protagonist.y - this.y;

            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedDeltaX = (deltaX / length) * this.speed * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.speed * elapsed;

            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;
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
                } else if (entity instanceof Dagger) {
                    if (that.player.dagger) {
                        that.hitpoints -= 5;
                    }
                }
            }
        });

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    }
    
    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y); // this way of drawing issac makes it not scaleable

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    };
}

class Goblin {
    constructor(game, x, y, speed, player) {
        Object.assign(this, {game, x, y, speed, player});

        this.GoblinRight = ASSET_MANAGER.getAsset("./sprites/goblin_right.png");
        this.GoblinLeft = ASSET_MANAGER.getAsset("./sprites/goblin_left.png");
        
        this.width = 170; // need to fix
        this.height = 170;
        this.scale = 0.5;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.animator = [];

        this.animator[0] = new Animator(this.GoblinRight, 0, 0, this.width, this.height, 7, 0.2, this.scale);
        this.animator[1] = new Animator(this.GoblinLeft, 0, 0, this.width, this.height, 7, 0.2, this.scale);
        this.animator[1].reverse();

        if (this.player.x > this.x) {
            this.direction = 0;
        } else {
            this.direction = 1;
        }
        
        this.dead = false;
        this.hitpoints = 100;
        this.maxhitpoints = 100;

        this.healthbar = new HealthBar(this, false);
        this.updateBB();
    }
    
    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    }

    update() {
        const protagonist = this.game.entities.find(entity => entity instanceof TheProtagonist);
        const elapsed = this.game.clockTick;

        let deltaX = 0;
        let deltaY = 0;

        if (protagonist) {
            deltaX = protagonist.x - this.x;
            deltaY = protagonist.y - this.y;

            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedDeltaX = (deltaX / length) * this.speed * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.speed * elapsed;

            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;

            if (protagonist.x >= this.x) {
                this.direction = 0;
            } else {
                this.direction = 1;
            }
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
                } else if (entity instanceof Dagger) {
                    if (that.player.dagger) {
                        that.hitpoints -= 5;
                    }
                }
            }
        });

        this.updateBB();
        
        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    }

    draw(ctx) {
        if (this.direction === 0) {
            this.animator[0].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.direction === 1) {
            this.animator[1].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
        
        this.updateBB();

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    }
}