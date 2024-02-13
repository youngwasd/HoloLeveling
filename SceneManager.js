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
    };

    startWave() {
        this.numEnemies = Math.floor(this.currWave * 1.5);
        this.spawnEnemies();
    };

    spawnEnemies() {
        for (let i = 0; i < this.numEnemies; i++) {
            const x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
            const y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
            this.speed = this.theProtagonist.speed * 0.6 + this.numEnemies * 10;
            const rand = Math.floor(Math.random() * 4) + 1;
            if (rand === 1) {
                this.game.addEntity(new Issac(this.game, x, y, this.theProtagonist, this.speed));
            } else  if (rand === 2){
                this.game.addEntity(new Goblin(this.game, x, y, this.theProtagonist, this.speed));
            } else if (rand === 3) {
                this.game.addEntity(new Bats(this.game, x, y, this.theProtagonist, this.speed));
            } else {
                this.game.addEntity(new Zombie(this.game, x, y, this.theProtagonist, this.speed));
            }
            this.enemiesAlive++;
        }
        this.game.addEntity(new Map(this.game, 0, 0, 2500, 2500));
    };

    update() {
        if (this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin || entity instanceof Bats || entity instanceof Zombie).length === 0) {
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
        this.enemiesAlive = this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin || entity instanceof Bats || entity instanceof Zombie).length;
    };
    
    draw(ctx) {};
    
};