class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.entities = [];
        this.game.camera = this;

        // Wave properties
        this.currWave = 0;
        this.numEnemies = 0;
        this.enemiesAlive = 0;
        this.minX = 0;
        this.minY = 0;
        this.maxX = 2500;
        this.maxY = 2500;

        this.loadLevelOne();
    };

    loadLevelOne() {
        this.end = new EndScreen(this.game);
        this.background = new Map(this.game, 0, 0, 2500, 2500);
        this.theProtagonist = new TheProtagonist(this.game, this.background, this.end);
        this.upgradeScreen = new UpgradeScreen(this.game);

        this.game.addEntity(this.theProtagonist);
        this.game.addEntity(new Dagger(this.game, this.theProtagonist));
        this.game.addEntity(this.end);
        this.game.addEntity(this.upgradeScreen);
        this.startWave();
        this.game.addEntity(new Tree(this.game, 900, 1000));

        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset("./music/minecraft.mp3");
    };

    startWave() {
        this.numEnemies = Math.floor(this.currWave * 1.5);
        this.spawnEnemies();
    };

    spawnEnemies() {
        for (let i = 0; i < this.numEnemies; i++) {
            let x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
            let y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
            this.speed = this.theProtagonist.speed * 0.6 + this.numEnemies * 10;
            this.health = 100 + this.currWave * 10
            const rand = Math.floor(Math.random() * 6) + 1;
            
            if (rand === 1) {
                this.game.addEntity(new Issac(this.game, x, y, this.theProtagonist, this.speed, this.health));
                this.enemiesAlive++;
            } else  if (rand === 2){
                this.game.addEntity(new Goblin(this.game, x, y, this.theProtagonist, this.speed, this.health));
                this.enemiesAlive++;
            } else if (rand === 3) {
                this.game.addEntity(new Bats(this.game, x, y, this.theProtagonist, this.speed, this.health -50));
                 x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
                 y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
                this.game.addEntity(new Bats(this.game, x, y, this.theProtagonist, this.speed, this.health -50));
                 x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
                 y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
                this.game.addEntity(new Bats(this.game, x, y, this.theProtagonist, this.speed,this.health -50));
                this.enemiesAlive+=3;
            } else if (rand === 4) {
                this.game.addEntity(new Zombie(this.game, x, y, this.theProtagonist, this.speed, this.health));
                this.enemiesAlive++;
            }else if (rand === 5) {
                this.game.addEntity(new Bats(this.game, x, y, this.theProtagonist, this.speed, this.health));
                this.enemiesAlive++;
            } else {
                this.game.addEntity(new Golem(this.game, x, y, this.theProtagonist, this.speed, this.health));
                this.enemiesAlive++;
            }
            
        }
        this.game.addEntity(new Map(this.game, 0, 0, 2500, 2500));
    };

    updateAudio() {
        const mute = document.getElementById("mute").checked;
        const volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    };

    update() {
        this.updateAudio();

        if (this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin || entity instanceof Bats || entity instanceof Golem || entity instanceof Zombie).length === 0) {
            if (this.currWave % 5 === 0 && this.currWave !== 0) {
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
        this.enemiesAlive = this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin || entity instanceof Bats || entity instanceof Golem|| entity instanceof Zombie).length;
    };
    
    draw(ctx) {};
};