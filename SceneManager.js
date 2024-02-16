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

        this.spawnTrees()

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

        if (this.game.entities.filter(entity => entity instanceof Issac || entity instanceof Goblin ||
            entity instanceof Bats || entity instanceof Golem || entity instanceof Zombie).length === 0) {
            if (this.currWave % 2 === 0 && this.currWave !== 0) {
                this.upgradeScreen.show();
            }
            if (this.game.entities.filter(map => map instanceof Map).length !== 0) {
                this.game.entities.filter(map => map instanceof Map).forEach(map => {
                    map.dead = true;
                });
            }
            if (this.currWave == 5) {

            }
            this.currWave++;
            this.startWave();
        }
        this.enemiesAlive = this.game.entities.filter(entity => entity instanceof Issac ||
            entity instanceof Goblin || entity instanceof Bats || entity instanceof Golem||
            entity instanceof Zombie).length;
    };
    
    draw(ctx) {};

    spawnTrees() {
        const spacing = 150;
        const treeWidth = 100;
        const treeHeight = 100;
        const gridSize = spacing + Math.max(treeWidth, treeHeight);
        const numCols = Math.floor(2500 / gridSize);
        const numRows = Math.floor(2500 / gridSize);
        const totalCells = numCols * numRows;
        const treesToSpawn = Math.floor(totalCells * 0.6);

        let occupiedCells = new Set();

        while (occupiedCells.size < treesToSpawn) {
            let col = Math.floor(Math.random() * numCols);
            let row = Math.floor(Math.random() * numRows);
            let cellIndex = row * numCols + col;

            if (!occupiedCells.has(cellIndex)) {
                occupiedCells.add(cellIndex);

                let xOffset = Math.random() * (gridSize - treeWidth);
                let yOffset = Math.random() * (gridSize - treeHeight);

                let x = col * gridSize + xOffset;
                let y = row * gridSize + yOffset;

                this.game.addEntity(new Tree(this.game, x, y));
            }
        }
    }
};