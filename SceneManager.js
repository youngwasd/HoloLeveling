class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.entities = [];
        this.game.camera = this;

        this.currWave = 0;
        this.numEnemies = 0;
        this.enemiesAlive = 0;
        this.minX = 0;
        this.minY = 0;
        this.maxX = 5000;
        this.maxY = 5000;

        this.globalTrees = [];
        this.globalLavaClusters = [];
        this.enemis = [];
        this.end = new EndScreen(this.game);
        this.background = new Map(this.game, 5000, 5000);
        this.background.generateLavaClusters()
        this.background.generateTrees(500)
        
        this.background.draw(this.game.ctx);
        this.theProtagonist = new TheProtagonist(this.game, this.background, this.end);
        this.upgradeScreen = new UpgradeScreen(this.game);

        this.game.addEntity(this.theProtagonist);
        
        this.game.addEntity(new Dagger(this.game, this.theProtagonist));
        this.game.addEntity(new Fireball(this.game, this.theProtagonist));
        this.game.addEntity(this.end);
        this.game.addEntity(this.upgradeScreen);
        this.startWave();
        //this.spawnTrees()

        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset("./music/minecraft.mp3");
    };

    startWave() {
        this.cleanupPreviousWave();
        this.numEnemies = Math.floor(this.currWave * 1.5);
        this.spawnEnemies();
    };

    cleanupPreviousWave() {
        this.game.entities = this.game.entities.filter(entity => !(entity instanceof Tree || entity instanceof Lava));

        this.globalTrees = [];
        this.globalLavaClusters = [];
    }

    spawnEnemies() {
        for (let i = 0; i < this.numEnemies; i++) {
            let x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
            let y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
            const speed = Math.floor(Math.random() * (this.theProtagonist.speed - 125 + 1)) + 125; // random number between 125 and 500
            const health = 100 + this.currWave * 10;
            const rand = Math.floor(Math.random() * 6) + 1;

            if (rand === 1) {
                this.game.addEntity(new Issac(this.game, x, y, this.theProtagonist, speed, health));
                this.enemiesAlive++;
            } else if (rand === 2) {
                this.game.addEntity(new Goblin(this.game, x, y, this.theProtagonist, speed, health));
                this.enemiesAlive++;
            } else if (rand === 3) {
                for (let j = 0; j < this.currWave; j++) {
                    x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
                    y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
                    this.game.addEntity(new Bats(this.game, x, y, this.theProtagonist, speed, health - 50));
                    this.enemiesAlive++;
                }
            } else if (rand === 4) {
                this.game.addEntity(new Zombie(this.game, x, y, this.theProtagonist, speed, health));
                this.enemiesAlive++;
            } else if (rand === 5) {
                this.game.addEntity(new Bats(this.game, x, y, this.theProtagonist, speed, health));
                this.enemiesAlive++;
            } else {
                this.game.addEntity(new Golem(this.game, x, y, this.theProtagonist, speed * 0.5, health * 5));
                this.enemiesAlive++;
            }
        }
        if (this.currWave % 10 === 0 && this.currWave !== 0) {
            const x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
            const y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
            const speed = this.theProtagonist.speed / 2;
            const health = 200 * (this.currWave * 0.6);

            this.game.addEntity(new Chimera(this.game, x, y, this.theProtagonist, speed, health));
            this.enemiesAlive++;
        }
        let map = new Map(this.game, 5000, 5000);
        map.generateLavaClusters();
        map.generateTrees(500)
        
        this.game.addEntity(map);
    };

    updateAudio() {
        const mute = document.getElementById("mute").checked;
        const volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    };

    update() {
        this.updateAudio();

        if (this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin ||
            entity instanceof Bats || entity instanceof Zombie || entity instanceof Golem || entity instanceof Chimera).length === 0) {
            if (this.currWave % 2 === 0 && this.currWave !== 0) {
                this.upgradeScreen.show();
            }
            if (this.game.entities.filter(map => map instanceof Map).length !== 0) {
                this.game.entities.filter(map => map instanceof Map).forEach(map => {
                    map.dead = true;
                });
            }
            this.currWave++;
            this.startWave();
        }
        this.enemiesAlive = this.game.entities.filter(entity => entity instanceof Issac ||
            entity instanceof Goblin || entity instanceof Bats ||
            entity instanceof Zombie || entity instanceof Golem ||
            entity instanceof Chimera).length;
    };
    
    draw(ctx) {};

    addTree(tree) {
        this.globalTrees.push(tree);
        this.game.addEntity(tree);
    }

    addLava(lava) {
        this.globalLavaClusters.push(lava);
        this.game.addEntity(lava);
    }

    positionOccupiedByTree(x, y) {
        return this.globalTrees.some(tree => tree.x === x && tree.y === y);
    }

    positionOccupiedByLava(x, y) {
        return this.globalLavaClusters.some(lava => lava.x === x && lava.y === y);
    }

    removeTree(tree) {
        this.globalTrees = this.globalTrees.filter(t => t !== tree);
        this.game.entities = this.game.entities.filter(entity => entity !== tree);
    }
};