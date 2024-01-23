class Garlic{
    constructor(game,player){
        this.game = game;
        this.player = player;
        this.x = this.player.x;
        this.y = this.player.y;
        this.width = this.player.width + 70
        this.height = this.player.height + 50;

        this.playerCenterX = this.player.x + this.player.width / 2;
        this.playerCenterY = this.player.y + this.player.height / 2;

    }
    update() {
        this.playerCenterX = this.player.x + this.player.width / 2;
        this.playerCenterY = this.player.y + this.player.height / 2;
        this.x = this.player.x - 35;
        this.y = this.player.y - 25;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.playerCenterX, this.playerCenterY, this.player.width, 0, 2 * Math.PI);
        ctx.stroke();        
    }
}