class Map{
    constructor(gameEngine){
        this.background = ASSET_MANAGER.getAsset("./sprites/forest.png");

    }
    update(){

    }
    draw(ctx){
        ctx.drawImage(this.background, -500, -500, 2500, 2500);
    }
}
