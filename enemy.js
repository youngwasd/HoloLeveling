class Enemy {
    constructor(game, x, y, speed, player, garlic) {
        Object.assign(this, {game, x, y, speed, player, garlic});

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");
        
        this.animator = new Animator(this.spritesheet, 0, 0, 57, 67, 1, 0.8);

        // Initial position
        this.width = 57; // for issac
        this.height = 67; // for issac

        this.dead = false;

        this.hitpoints = 100;
        this.maxhitpoints = 100;
        
        this.updateBB();
        this.healthbar = new HealthBar(this, false);
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {
        const protagonist = this.game.entities.find(entity => entity instanceof TheProtagonist);
        const elapsed = this.game.clockTick;

        let deltaX = 0;
        let deltaY = 0;

        if (protagonist) {
            // Calculate the direction vector from enemy to protagonist
            deltaX = protagonist.x - this.x;
            deltaY = protagonist.y - this.y;

            // Normalize the vector
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedDeltaX = (deltaX / length) * this.speed * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.speed * elapsed;

            // Update enemy position
            this.x += normalizedDeltaX;
            this.y += normalizedDeltaY;
        }

        this.updateBB();

        // collision
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Garlic) { // need to add collision for garlic not protagonist here, old: (entity instanceof theProtagonist)
                    if (that.player.garlic) {
                        that.hitpoints--;
                    }
                } else if (entity instanceof Tree) {
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
                }
            }
        });

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    }
    
    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y)

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    };
}
