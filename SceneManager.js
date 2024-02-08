class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.entities = [];

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
        
        this.game.addEntity(this.theProtagonist);
        this.game.addEntity(new Dagger(this.game, this.theProtagonist));
        this.game.addEntity(this.end);
        this.startWave();
        this.game.addEntity(new Tree(this.game, 900, 1000));
        
    };

    startWave() {
        this.numEnemies = this.currWave * 2;
        this.spawnEnemies();
    }

    spawnEnemies() {
        for (let i = 0; i < this.numEnemies; i++) {
            const x = Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX;
            const y = Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY;
            this.speed = this.theProtagonist.speed * 0.6 + this.numEnemies * 10;
            if (Math.random() < 0.5) {
                this.game.addEntity(new Issac(this.game, x, y, this.theProtagonist, this.speed));
            } else {
                this.game.addEntity(new Goblin(this.game, x, y, this.theProtagonist, this.speed));
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
            this.startWave();
        }

        this.enemiesAlive = this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin).length;
    };
    draw(ctx) {
        
    };
    
};