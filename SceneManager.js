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
        
        this.lava =[];
        this.enemis = [];
        this.end = new EndScreen(this.game);
        this.background = new Map(this.game, 0, 0, 2500, 2500);
        this.theProtagonist = new TheProtagonist(this.game, this.background, this.end);
        this.upgradeScreen = new UpgradeScreen(this.game);

        this.loadLevelOne();
    };

    loadLevelOne() {
        this.game.addEntity(this.theProtagonist);
        this.game.addEntity(new Dagger(this.game, this.theProtagonist));
        this.game.addEntity(new Fireball(this.game, this.theProtagonist));
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
            entity instanceof Bats || entity instanceof Zombie || entity instanceof Golem).length === 0) {
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
            entity instanceof Zombie || entity instanceof Golem).length;
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
        return occupiedCells;
    }


    spawnLavaClusters() {
        const clusters = 5;
        const minBlocks = 5;
        const maxBlocks = 25;
        const lavaSize = 75;
        const bufferZone = 200;
        const maxAttempts = 5000;

        for (let i = 0; i < clusters; i++) {
            const numBlocks = Math.floor(Math.random() * (maxBlocks - minBlocks + 1)) + minBlocks;
            let cluster = [];
            let attempts = 0;

            let center = {
                x: Math.random() * (this.maxX - bufferZone * 2) + bufferZone,
                y: Math.random() * (this.maxY - bufferZone * 2) + bufferZone
            };

            while (this.isNearTree(center.x, center.y, bufferZone) && attempts < maxAttempts) {
                center.x = Math.random() * (this.maxX - bufferZone * 2) + bufferZone;
                center.y = Math.random() * (this.maxY - bufferZone * 2) + bufferZone;
                attempts++;
            }

            if (attempts < maxAttempts) {
                cluster.push(center);
                this.lava.push(new Lava(this.game, center.x, center.y));
            }

            for (let j = 1; j < numBlocks; j++) {
                if (attempts >= maxAttempts) break;

                let lastBlock = cluster[cluster.length - 1];
                let newBlock = this.getAdjacentPosition(lastBlock.x, lastBlock.y, lavaSize);

                attempts = 0;
                while ((this.isNearTree(newBlock.x, newBlock.y, bufferZone) || this.isOccupied(newBlock.x, newBlock.y, cluster)) && attempts < maxAttempts) {
                    newBlock = this.getAdjacentPosition(lastBlock.x, lastBlock.y, lavaSize);
                    attempts++;
                }
                if (attempts < maxAttempts) {
                    cluster.push(newBlock);
                    this.game.addEntity(new Lava(this.game, newBlock.x, newBlock.y));
                }
            }
        }
    }

    isNearTree(x, y, bufferZone) {
        for (let i = 0; i < this.game.entities.length; i++) {
            let entity = this.game.entities[i];
            if (entity instanceof Tree) {
                let dx = x - entity.x;
                let dy = y - entity.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < bufferZone) {
                    return true;
                }
            }
        }
        return false;
    }

    getAdjacentPosition(x, y, size) {
        const directions = [[-size, 0], [size, 0], [0, -size], [0, size]];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];

        return { x: x + randomDirection[0], y: y + randomDirection[1] };
    }

    isOccupied(x, y, cluster) {
        return cluster.some(block => block.x === x && block.y === y);
    }
};