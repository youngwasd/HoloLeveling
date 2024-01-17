class Map {
    constructor(gameEngine, x, y, width, height, scale) {
        Object.assign(this, {gameEngine, x, y, width, height, scale});
        this.background = ASSET_MANAGER.getAsset("./sprites/forest.png");
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.background, this.x, this.y, this.width, this.height);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}

// class Tree{
//     constructor(x, y){
//         this.x = x;
//         this.y = y;
//         this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees.png");
//         console.log(this.spritesheet);
//         this.width = 50;
//         this.height = 60;
//         this.startX = 110;
//         this.startY = 0;
//         this.scale = 1.5;
//     }
    
//     update(){
        
//     }
//     draw(ctx){
//         ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.height, this.x, this.y, this.width * this.scale, this.height * this.scale);
//     }
// }