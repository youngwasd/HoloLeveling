class Map{
    constructor(gameEngine){
        this.background = ASSET_MANAGER.getAsset("./sprites/forest2.jpg");

    }
    update(){

    }
    draw(ctx){
        ctx.drawImage(this.background, -500, -500);
    }
}

class Tree{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees.png");
        this.width = 50;
        this.height = 60;
        this.startX = 110;
        this.startY = 0;
        this.scale = 1;
    }
    
    update(){
        
    }
    draw(ctx){
        ctx.drawImage(this.spritesheet, this.startX, this.startY, this.width, this.height, this.x, this.y, this.width*this.scale, this.height* this.scale);
    }
}

