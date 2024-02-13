class Issac {
    constructor(game, x, y, player,speed , hitpoints) {
        Object.assign(this, {game, x, y, player, speed});
        
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");

        // Initial position
        this.width = 58; // for issac
        this.height = 68; // for issac
        this.scale = 1;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;
        
        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 0.8, this.scale);

        this.dead = false;
        this.hitpoints = hitpoints;
        this.maxhitpoints = hitpoints;

        this.updateBB();
        this.healthbar = new HealthBar(this, false);
    };

    updateBB() {
        this.lastBB = this.BB;
        //this.BB = new BoundingBox(this.x + 10, this.y + 7, this.scaledWidth - 20, this.scaledHeight - 15);
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
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac || entity instanceof Bats || entity instanceof Golem || entity instanceof Zombie) {
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
                        if (entity.isVisible) {
                            that.hitpoints -= entity.damage;
                        }
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
    constructor(game, x, y, player,speed , hitpoints) {
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
        this.hitpoints = hitpoints;
        this.maxhitpoints = hitpoints;

        this.healthbar = new HealthBar(this, false);
        this.updateBB();
    }
    
    updateBB() {
        this.lastBB = this.BB;
        //this.BB = new BoundingBox(this.x + 15, this.y + 8, this.scaledWidth - 35, this.scaledHeight - 20);
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
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac || entity instanceof Bats
                    || entity instanceof Zombie || entity instanceof Golem) {
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
                        if (entity.isVisible) {
                            that.hitpoints -= entity.damage;
                        }
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

class Bats {
    constructor(game, x, y, player,speed , hitpoints) {
        Object.assign(this, {game, x, y, player, speed});

        this.BatRight = ASSET_MANAGER.getAsset("./sprites/Bat_Right.png");
        this.BatLeft = ASSET_MANAGER.getAsset("./sprites/Bat_Left.png");

        this.width = 16;
        this.height = 15;
        this.scale = 2.5;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

        this.animator = [];

        this.animator[0] = new Animator(this.BatRight, 0, 0, this.width, this.height, 5, 0.2, this.scale);
        this.animator[1] = new Animator(this.BatLeft, 0, 0, this.width, this.height, 5, 0.2, this.scale);
        this.animator[1].reverse();

        if (this.player.x > this.x) {
            this.direction = 0;
        } else {
            this.direction = 1;
        }

        this.dead = false;
        this.hitpoints = hitpoints;
        this.maxhitpoints = hitpoints;

        this.healthbar = new HealthBar(this, false);
        this.updateBB();
    }

    updateBB() {
        this.lastBB = this.BB;
        //this.BB = new BoundingBox(this.x + 8, this.y + 5, this.scaledWidth - 15, this.scaledHeight - 13);
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
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac || entity instanceof Bats || entity instanceof Golem
                    || entity instanceof Zombie) {
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
                        if (entity.isVisible) {
                            that.hitpoints -= entity.damage;
                        }
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

class Zombie {
    constructor(game, x, y, player, speed, hitpoints) {
        Object.assign(this, {game, x, y, player, speed});

        this.zomLeft = ASSET_MANAGER.getAsset("./sprites/zombie_left.png");
        this.zomRight = ASSET_MANAGER.getAsset("./sprites/zombie_right.png");

        this.width = 100;
        this.height = 102;
        this.scale = 1;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

        this.animator = [];
        this.animator[0] = new Animator(this.zomRight, 0, 0, this.width, this.height, 4, 0.15, this.scale);
        this.animator[1] = new Animator(this.zomLeft, 0, 0, this.width, this.height, 4, 0.15, this.scale);
        this.animator[1].reverse();

        if (this.player.x > this.x) {
            this.direction = 0;
        } else {
            this.direction = 1;
        }

        this.dead = false;
        this.hitpoints = hitpoints;
        this.maxhitpoints = hitpoints;

        this.healthbar = new HealthBar(this, false);
    };

    updateBB() {
        this.lastBB = this.BB;
        //this.BB = new BoundingBox(this.x + 25, this.y + 10, this.scaledWidth - 50, this.scaledHeight - 20);
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    };

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
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac || entity instanceof Bats
                    || entity instanceof Zombie || entity instanceof Golem) {
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
                        if (entity.isVisible) {
                            that.hitpoints -= entity.damage;
                        }
                    }
                }
            }
        });

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    };

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

class Golem {
    constructor(game, x, y, player, speed, hitpoints) {
        Object.assign(this, {game, x, y, player, speed});

        this.BatRight = ASSET_MANAGER.getAsset("./sprites/Golem_Right.png");
        this.BatLeft = ASSET_MANAGER.getAsset("./sprites/Golem_Left.png");

        this.width = 90;
        this.height = 64;
        this.scale = 2.5;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

        this.animator = [];

        this.animator[0] = new Animator(this.BatRight, 0, 0, this.width, this.height, 9, 0.2, this.scale);
        this.animator[1] = new Animator(this.BatLeft, 0, 0, this.width, this.height, 9, 0.2, this.scale);
        this.animator[1].reverse();

        if (this.player.x > this.x) {
            this.direction = 0;
        } else {
            this.direction = 1;
        }

        this.dead = false;
        this.hitpoints = hitpoints;
        this.maxhitpoints = hitpoints;

        this.healthbar = new HealthBar(this, false);
        this.updateBB();
    }

    updateBB() {
        this.lastBB = this.BB;
        //this.BB = new BoundingBox(this.x + 80, this.y + 70, this.scaledWidth - 155, this.scaledHeight - 70);
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
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac || entity instanceof Bats || entity instanceof Golem|| entity instanceof Zombie) {
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
                        that.hitpoints -= entity.damage;
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
