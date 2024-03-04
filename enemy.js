class Issac {
    constructor(game, x, y, player, speed, hitpoints) {
        Object.assign(this, {game, x, y, player, speed,hitpoints });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");

        // Initial position
        this.width = 28; // for issac
        this.height = 34; // for issac
        this.scale = 2;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height, 3, 0.2, this.scale);

        this.dead = false;
        this.maxhitpoints = this.hitpoints;

        this.hit = false;
        this.knockback = false;
        this.knockbackSpeed = 200;
        this.knockbackDuration = .6;
        this.knockbackTimer = 0;

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

            if (!this.knockback) {
                this.x += normalizedDeltaX;
                this.y += normalizedDeltaY;
            }
        }

        if (this.knockback) {
            const knockbackX = deltaX > 0 ? -this.knockbackSpeed : this.knockbackSpeed;
            const knockbackY = deltaY > 0 ? -this.knockbackSpeed : this.knockbackSpeed;

            this.x += knockbackX * elapsed;
            this.y += knockbackY * elapsed;

            this.knockbackTimer += elapsed;

            if (this.knockbackTimer >= this.knockbackDuration) {
                this.knockback = false;
                this.knockbackTimer = 0;
            }
        }

        this.updateBB();

        // collision
        let daggerVis = false;
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac || entity instanceof Zombie || entity instanceof Golem) {
                    if (that.lastBB.right <= entity.BB.left) { // hit the left of tree
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
                } else if (entity instanceof Dagger) {
                    if (that.player.weapons.dagger && entity.isVisible) {
                        if (!that.hit) {
                            that.hitpoints -= entity.damage;
                            that.hit = true;
                            that.knockback = true;
                        }
                        daggerVis = true;
                    }
                }
            }
        });

        if (!daggerVis) this.hit = false;

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    }

    draw(ctx) {
        
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    };
};

class Goblin {
    constructor(game, x, y, player, speed, hitpoints) {
        Object.assign(this, {game, x, y, player, speed, hitpoints});

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
        this.maxhitpoints = this.hitpoints;

        this.hit = false;

        // knockback variables
        this.knockback = false;
        this.knockbackSpeed = 200;
        this.knockbackDuration = .6;
        this.knockbackTimer = 0;

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

            if (!this.knockback) {
                this.x += normalizedDeltaX;
                this.y += normalizedDeltaY;
            }

            if (protagonist.x >= this.x) {
                this.direction = 0;
            } else {
                this.direction = 1;
            }
        }

        if (this.knockback) {
            const knockbackX = deltaX > 0 ? -this.knockbackSpeed : this.knockbackSpeed;
            const knockbackY = deltaY > 0 ? -this.knockbackSpeed : this.knockbackSpeed;

            this.x += knockbackX * elapsed;
            this.y += knockbackY * elapsed;

            this.knockbackTimer += elapsed;

            if (this.knockbackTimer >= this.knockbackDuration) {
                this.knockback = false;
                this.knockbackTimer = 0;
            }
        }

        this.updateBB();

        // collision
        let daggerVis = false;
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac
                    || entity instanceof Zombie || entity instanceof Golem) {
                    if (that.lastBB.right <= entity.BB.left) { // hit the left of tree
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
                } else if (entity instanceof Dagger) {
                    if (that.player.weapons.dagger && entity.isVisible) {
                        if (!that.hit) {
                            that.hitpoints -= entity.damage;
                            that.hit = true;
                            that.knockback = true;
                        }
                        daggerVis = true;
                    }
                }
            }
        });

        if (!daggerVis) this.hit = false;

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }

       
        
    }

    draw(ctx) {
        this.animator[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y);

        this.updateBB();

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    }
}

class Bats {
    constructor(game, x, y, player, speed, hitpoints) {
        Object.assign(this, {game, x, y, player, speed, hitpoints});

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
        this.maxhitpoints = this.hitpoints;

        this.hit = false;

        // knockback variables
        this.knockback = false;
        this.knockbackSpeed = 200;
        this.knockbackDuration = .6;
        this.knockbackTimer = 0;

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

            if (!this.knockback) {
                this.x += normalizedDeltaX;
                this.y += normalizedDeltaY;
            }

            if (protagonist.x >= this.x) {
                this.direction = 0;
            } else {
                this.direction = 1;
            }
        }

        if (this.knockback) {
            const knockbackX = deltaX > 0 ? -this.knockbackSpeed : this.knockbackSpeed;
            const knockbackY = deltaY > 0 ? -this.knockbackSpeed : this.knockbackSpeed;

            this.x += knockbackX * elapsed;
            this.y += knockbackY * elapsed;

            this.knockbackTimer += elapsed;

            if (this.knockbackTimer >= this.knockbackDuration) {
                this.knockback = false;
                this.knockbackTimer = 0;
            }
        }

        this.updateBB();

        // collision
        let daggerVis = false;
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Bats) {
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
                } else if (entity instanceof Dagger) {
                    if (that.player.weapons.dagger && entity.isVisible) {
                        if (!that.hit) {
                            that.hitpoints -= entity.damage;
                            that.hit = true;
                            that.knockback = true;
                        }
                        daggerVis = true;
                    }
                }
            }
        });

        if (!daggerVis) this.hit = false;

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    }

    draw(ctx) {
        
        this.animator[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y);

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
        Object.assign(this, {game, x, y, player, speed, hitpoints});

        this.zomLeft = ASSET_MANAGER.getAsset("./sprites/zombie_left.png");
        this.zomRight = ASSET_MANAGER.getAsset("./sprites/zombie_right.png");

        this.width = 100;
        this.height = 102;
        this.scale = 1;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.zomSpeed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

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
        this.maxhitpoints = this.hitpoints;

        this.hit = false;

        // fast ms for short time
        this.seconds = 0;
        this.speedTimes = 1;

        // knockback variables
        this.knockback = false;
        this.knockbackSpeed = 200;
        this.knockbackDuration = .6;
        this.knockbackTimer = 0;

        this.healthbar = new HealthBar(this, false);
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.scaledWidth, this.scaledHeight);
    };

    update() {
        const protagonist = this.game.entities.find(entity => entity instanceof TheProtagonist);
        const elapsed = this.game.clockTick;

        this.seconds += this.game.clockTick;

        if (this.seconds >= 5) {
            if (this.seconds <= 8) {
                this.speedTimes = 2;
            } else {
                this.speedTimes = 1;
                this.seconds = 0;
            }
        }

        let deltaX = 0;
        let deltaY = 0;

        if (protagonist) {
            deltaX = protagonist.x - this.x;
            deltaY = protagonist.y - this.y;

            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedDeltaX = (deltaX / length) * this.zomSpeed * this.speedTimes * elapsed;
            const normalizedDeltaY = (deltaY / length) * this.zomSpeed * this.speedTimes * elapsed;

            if (!this.knockback) {
                this.x += normalizedDeltaX;
                this.y += normalizedDeltaY;
            }

            if (protagonist.x >= this.x) {
                this.direction = 0;
            } else {
                this.direction = 1;
            }
        }

        if (this.knockback) {
            const knockbackX = deltaX > 0 ? -this.knockbackSpeed : this.knockbackSpeed;
            const knockbackY = deltaY > 0 ? -this.knockbackSpeed : this.knockbackSpeed;

            this.x += knockbackX * elapsed;
            this.y += knockbackY * elapsed;

            this.knockbackTimer += elapsed;

            if (this.knockbackTimer >= this.knockbackDuration) {
                this.knockback = false;
                this.knockbackTimer = 0;
            }
        }

        this.updateBB();

        // collision
        let daggerVis = false;
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Tree || entity instanceof Goblin || entity instanceof Issac
                    || entity instanceof Zombie || entity instanceof Golem) {
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
                } else if (entity instanceof Dagger) {
                    if (that.player.weapons.dagger && entity.isVisible) {
                        if (!that.hit) {
                            that.hitpoints -= entity.damage;
                            that.hit = true;
                            that.knockback = true;
                        }
                        daggerVis = true;
                    }
                }
            }
        });

        if (!daggerVis) this.hit = false;

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    };

    draw(ctx) {
        
        this.animator[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y);

        this.updateBB();

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    };
};

class Golem {
    constructor(game, x, y, player, speed, hitpoints, map) {
        Object.assign(this, {game, x, y, player, speed, hitpoints,map});

        this.goRight = ASSET_MANAGER.getAsset("./sprites/golem_right.png");
        this.goLeft = ASSET_MANAGER.getAsset("./sprites/golem_left.png");

        this.width = 780 / 4;
        this.height = 162;
        this.scale = 1.2;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

        this.animator = [];

        this.animator[0] = new Animator(this.goRight, 0, 0, this.width, this.height, 4, 0.35, this.scale);
        this.animator[1] = new Animator(this.goLeft, 0, 0, this.width, this.height, 4, 0.35, this.scale);
        this.animator[1].reverse();

        if (this.player.x > this.x) {
            this.direction = 0;
        } else {
            this.direction = 1;
        }

        this.dead = false;
        this.maxhitpoints = this.hitpoints;

        this.hit = false;

        this.healthbar = new HealthBar(this, false);
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
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
        let daggerVis = false;
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Goblin || entity instanceof Issac || entity instanceof Golem || entity instanceof Zombie) {
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
                }  else if (entity instanceof Dagger) {
                    if (that.player.weapons.dagger && entity.isVisible) {
                        if (!that.hit) {
                            that.hitpoints -= entity.damage;
                            that.hit = true;
                        }
                        daggerVis = true;
                    }
                } else if(entity instanceof Tree) {
                    entity.dead = true;
                    entity.convertToGrass()
                }
            }
        });

        if (!daggerVis) this.hit = false;

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    };

    draw(ctx) {
        this.animator[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y);

        this.updateBB();

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    };
};

class Chimera {
    constructor(game, x, y, player, speed, hitpoints) {
        Object.assign(this, {game, x, y, player, speed, hitpoints});

        this.goLeft = ASSET_MANAGER.getAsset("./sprites/chimera_left.png");
        this.goRight = ASSET_MANAGER.getAsset("./sprites/chimera_right.png");

        this.width = 127.77;
        this.height = 119;
        this.scale = 3;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;

        this.speed = this.speed >= this.player.speed ? this.speed - 200 : this.speed;

        this.animator = [];
        this.animator[0] = new Animator(this.goRight, 0, 0, this.width, this.height, 9, 0.18, this.scale);
        this.animator[1] = new Animator(this.goLeft, 0, 0, this.width, this.height, 9, 0.18, this.scale);
        this.animator[1].reverse();

        if (this.player.x > this.x) {
            this.direction = 0;
        } else {
            this.direction = 1;
        }

        this.dead = false;
        this.maxhitpoints = this.hitpoints;

        this.hit = false;

        this.healthbar = new HealthBar(this, false);
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
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

        let daggerVis = false;
        let that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Dagger) {
                    if (that.player.weapons.dagger && entity.isVisible) {
                        if (!that.hit) {
                            that.hitpoints -= entity.damage;
                            that.hit = true;
                        }
                        daggerVis = true;
                    }
                } else if(entity instanceof Tree) {
                    entity.dead = true;
                }
            }
        });

        if (!daggerVis) this.hit = false;

        this.updateBB();

        if (this.hitpoints <= 0) {
            this.dead = true;
        }
    };

    draw(ctx) {
        this.animator[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y);

        this.updateBB();

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }

        this.healthbar.draw(ctx);
    };
};