class Wave {
    constructor(game, player) {
        Object.assign(this, {game, player});

        this.currWave = 0;
        this.numEnemies = 0;
        this.enemiesAlive = 0;

        this.minY = 0;
        this.minX = 0;
        this.maxY = 2500;
        this.maxX = 2500;
    };

    getCurrentWave() {
        return this.currWave;
    }

    spawnWave() {
        this.numEnemies = this.currWave * 2;
        this.spawnEnemies();
    };

    spawnEnemies() {
        for (let i = 0; i < this.numEnemies; i++) {
            const x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
            const y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
            this.speed = this.player.speed * 0.6 + this.numEnemies * 10;
            if (Math.random() < 0.5) {
                this.game.addEntity(new Issac(this.game, x, y, this.player, this.speed));
            } else {
                this.game.addEntity(new Goblin(this.game, x, y, this.player, this.speed));
            }
            this.enemiesAlive++;
        }
        this.game.addEntity(new Map(this.game, 0, 0, 2500, 2500));
    };

    update() {
        if (this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin).length === 0) {
            if (this.game.entities.filter(map => map instanceof Map).length !== 0) {
                this.game.entities.filter(map => map instanceof Map).forEach(map => {
                    map.dead = true;
                    
                });
            }
            this.currWave++;
            this.spawnWave();
        }

        this.enemiesAlive = this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin).length;
    };

    draw(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText('Wave: ' + this.currWave, 590, 30);

        ctx.font = "20px Arial";
        ctx.fillText('Enemies Remaining: ' + this.enemiesAlive, 5, 715);

        ctx.restore();
    };
};

class Issac {
    constructor(game, x, y, player,speed) {
        Object.assign(this, {game, x, y, player, speed});
        
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");

        // Initial position
        this.width = 57; // for issac
        this.height = 67; // for issac
        this.scale = 1;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        
        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

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
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac) {
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
};

class Goblin {
    constructor(game, x, y, player, speed) {
        Object.assign(this, {game, x, y, player, speed});

        this.GoblinRight = ASSET_MANAGER.getAsset("./sprites/goblin_right.png");
        this.GoblinLeft = ASSET_MANAGER.getAsset("./sprites/goblin_left.png");
        
        this.width = 170; // need to fix
        this.height = 170;
        this.scale = 0.5;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        
        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

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
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac) {
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
};