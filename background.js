// Constants
const LAVA = 'lava';
const GRASS = 'grass';
const TREE = 'tree';

let globalLavaClusters = [];
let globalTrees = [];
let isLast = false;

class Map {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.blockSize = 75;
        this.map = [];
        this.assets = {
            grass: ASSET_MANAGER.getAsset("./sprites/grass.jpg"),
            lava: ASSET_MANAGER.getAsset("./sprites/lava.png"),
            tree: ASSET_MANAGER.getAsset("./sprites/trees.png")
        };
        this.initializeMap();
    }

    initializeMap() {
        const rows = Math.ceil(this.height / this.blockSize);
        const cols = Math.ceil(this.width / this.blockSize);
        this.map = new Array(rows).fill(null).map(() => new Array(cols).fill('grass'));
    }

    generateLavaClusters() {
        const numberOfClusters = 15;
        for (let i = 0; i < numberOfClusters; i++) {
            const clusterSize = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
            let placedBlocks = 0;
            let startingPoint = {
                x: Math.floor(Math.random() * (this.width / this.blockSize)),
                y: Math.floor(Math.random() * (this.height / this.blockSize))
            };
            this.map[startingPoint.y][startingPoint.x] = LAVA;
            placedBlocks++;

            let minX = startingPoint.x, maxX = startingPoint.x, minY = startingPoint.y, maxY = startingPoint.y;

            let potentialPositions = this.getAdjacentPositions(startingPoint.x, startingPoint.y);

            while (placedBlocks < clusterSize && potentialPositions.length > 0) {
                let bestPosition = potentialPositions.shift(); // Take the first potential position

                // Check if placing a block here would keep the cluster within the desired dimensions
                let withinHorizontalLimits = (Math.max(maxX, bestPosition.x) - Math.min(minX, bestPosition.x)) < 5;
                let withinVerticalLimits = (Math.max(maxY, bestPosition.y) - Math.min(minY, bestPosition.y)) < 5;

                if (withinHorizontalLimits && withinVerticalLimits && this.map[bestPosition.y][bestPosition.x] === GRASS) {
                    this.map[bestPosition.y][bestPosition.x] = LAVA;
                    placedBlocks++;
                    minX = Math.min(minX, bestPosition.x);
                    maxX = Math.max(maxX, bestPosition.x);
                    minY = Math.min(minY, bestPosition.y);
                    maxY = Math.max(maxY, bestPosition.y);

                    potentialPositions = potentialPositions.concat(this.getAdjacentPositions(bestPosition.x, bestPosition.y)
                        .filter(pos => this.map[pos.y][pos.x] === GRASS && !potentialPositions.includes(pos)));
                }
            }
        }
    }

    getAdjacentPositions(x, y) {
        const positions = [
            {x: x - 1, y: y}, {x: x + 1, y: y},
            {x: x, y: y - 1}, {x: x, y: y + 1}
        ];
        return positions.filter(pos => pos.x >= 0 && pos.x < this.width / this.blockSize && pos.y >= 0 && pos.y < this.height / this.blockSize);
    }

    getRandomPoint() {
        return {
            x: Math.floor(Math.random() * (this.width / this.blockSize)),
            y: Math.floor(Math.random() * (this.height / this.blockSize))
        };
    }

    generateTrees(numberOfTrees) {
        let placedTrees = 0;
        while (placedTrees < numberOfTrees) {
            let point = this.getRandomPoint();
            if (this.map[point.y][point.x] === 'grass') {
                this.map[point.y][point.x] = 'tree';
                placedTrees++;
            }
        }
    }


    draw(ctx) {
        const rows = Math.ceil(this.height / this.blockSize);
        const cols = Math.ceil(this.width / this.blockSize);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (this.map[y][x] === undefined) {
                    console.error(`Map data at ${x}, ${y} is undefined.`);
                    continue; // Skip drawing undefined cells
                }
                let asset, sx, sy, sWidth, sHeight;
                switch(this.map[y][x]) {
                    case LAVA:
                        asset = this.assets.lava;
                        sx = 0;
                        sy = 0;
                        sWidth = 1184; // The width of the lava image
                        sHeight = 1184; // The height of the lava image
                        ctx.drawImage(asset, sx, sy, sWidth, sHeight, x * this.blockSize, y * this.blockSize, 75, 75);

                        if (params.DEBUG) {
                            ctx.strokeStyle = 'Red';
                            ctx.strokeRect(x * this.blockSize, y * this.blockSize, 75, 75);
                        }

                        let lava = new Lava(this.game, x * this.blockSize, y * this.blockSize);
                        // Check if the position is already occupied
                        if (!this.game.camera.positionOccupiedByLava(lava.x, lava.y) && !this.game.camera.positionOccupiedByTree(lava.x, lava.y)) {
                            this.game.camera.addLava(lava);
                        }
                        break;
                    case TREE:
                        asset = this.assets.tree;
                        ctx.drawImage(asset, 116, 5, 40, 60, x * this.blockSize, y * this.blockSize, 75, 75);

                        if (params.DEBUG) {
                            ctx.strokeStyle = 'Red';
                            ctx.strokeRect(x * this.blockSize, y * this.blockSize, 75, 75);
                        }

                        let tree = new Tree(this.game, x * this.blockSize,  y * this.blockSize, this); // Use appropriate x and y values
                        if (!this.game.camera.positionOccupiedByTree(tree.x, tree.y) && !this.game.camera.positionOccupiedByLava(tree.x, tree.y)) {
                            this.game.camera.addTree(tree);
                        }
                        break
                    case GRASS:
                    default:
                        asset = this.assets.grass;
                        sx = 0;
                        sy = 0;
                        sWidth = 320;
                        sHeight = 320;
                        ctx.drawImage(asset, sx, sy, sWidth, sHeight, x * this.blockSize, y * this.blockSize, 300, 300);
                        break;
                }
                // Draw the asset on the canvas scaled to blockSize
            }
        }
    }
    setToGrass(x, y) {
        if (x >= 0 && x < this.width / this.blockSize && y >= 0 && y < this.height / this.blockSize) {
            this.map[y][x] = GRASS;
        }
    }
    update() {

    }
    
    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}

class Tree {
    constructor(game, x, y, map) {
        Object.assign(this, {game, x, y, map});
        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees.png");
        this.width = 75;
        this.height = 75;
        this.startX = 116;
        this.startY = 5;

        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {
        this.updateBB();
    };

    draw(ctx) {
        //ctx.drawImage(this.spritesheet, this.startX, this.startY, 40, 60, this.x, this.y, this.width, this.height);

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };

    convertToGrass() {
        let mapX = Math.floor(this.x / this.map.blockSize);
        let mapY = Math.floor(this.y / this.map.blockSize);
        this.map.setToGrass(mapX, mapY);
    }
};

class Lava {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/lava.png");
        this.width = 75;
        this.height = 75;
        this.startX = 0;
        this.startY = 0;
        this.updateBB();
    }
    
    update() {
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    draw(ctx) {
        //ctx.drawImage(this.spritesheet, this.startX, this.startY, 1184, 1184, this.x, this.y, this.width, this.height);

        if (params.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }
}