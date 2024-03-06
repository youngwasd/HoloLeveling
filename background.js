// Constants
const LAVA = 'lava';
const GRASS = 'grass';
const TREE = 'tree';

class Map {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.blockSize = 75;
        this.map = [];
        this.initializeMap();
        this.grass = ASSET_MANAGER.getAsset("./sprites/grass.jpg");
        this.lava = ASSET_MANAGER.getAsset("./sprites/lava.png");
        this.tree = ASSET_MANAGER.getAsset("./sprites/trees.png");       
    }

    initializeMap() {
        const rows = Math.ceil(this.height / this.blockSize);
        const cols = Math.ceil(this.width / this.blockSize);
        this.map = Array.from({length: rows}, () => Array.from({length: cols}, () => GRASS));
    }

    setToGrass(x, y) {
        if (x >= 0 && x < this.width / this.blockSize && y >= 0 && y < this.height / this.blockSize) {
            this.map[y][x] = GRASS;
        }
    }

    generateLavaClusters() {
        const numberOfSpots = 10; // Change to 10 spots
        for (let i = 0; i < numberOfSpots; i++) {
            // Each spot is just a single block, so we don't need to calculate a cluster size
            let spotPosition = {
                x: Math.floor(Math.random() * (this.width / this.blockSize)),
                y: Math.floor(Math.random() * (this.height / this.blockSize))
            };
            this.map[spotPosition.y][spotPosition.x] = LAVA; // Place lava at the generated spot
        }
    }

    // Helper method to calculate the distance between two points
    distanceFromCenter(center, point) {
        return Math.sqrt(Math.pow(center.x - point.x, 2) + Math.pow(center.y - point.y, 2));
    }

    getAdjacentPositions(x, y) {
        return [
            {x: x - 1, y: y},
            {x: x + 1, y: y},
            {x: x, y: y - 1},
            {x: x, y: y + 1}
        ].filter(pos => pos.x >= 0 && pos.x < this.width / this.blockSize && pos.y >= 0 && pos.y < this.height / this.blockSize);
    }
    
    generateTrees(numberOfTrees) {
        let placedTrees = 0;
        while (placedTrees < numberOfTrees) {
            let x = Math.floor(Math.random() * (this.width / this.blockSize));
            let y = Math.floor(Math.random() * (this.height / this.blockSize));

            // Only place a tree if the position is grass and there's no lava
            if (this.map[y][x] === GRASS) {
                this.map[y][x] = TREE;
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
                    asset = this.lava;
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
                    asset = this.tree;
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
                    asset = this.grass;
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