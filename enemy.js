
class Enemy2 {
    constructor(x, y, player, garlic) {
        this.garlic = garlic;
        this.player = player;
        this.x = x;
        this.y = y;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/issac.png");
        
        this.width = 56;
        this.height = 66;
        this.startX = 110;
        this.startY = 0;
        this.scale = 1.5;
        this.speed = 2;
        this.healthbar = new HealthBar(this, false);
        this.hitpoints = 100;
        this.maxhitpoints = 100;
        this.radius = this.width / 2;
        this.animator = new Animator(this.spritesheet, 0, 0, this.width, this.height = 120, 1, 0.8,1);
    }

    update() {

        const directionX = this.player.x - this.x;
        const directionY = this.player.y - this.y;

        // Normalize the direction vector
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / length;
        const normalizedDirectionY = directionY / length;

        // Set the speed at which the enemy follows the player
        this.x += normalizedDirectionX * this.speed;
        this.y += normalizedDirectionY * this.speed;

        // Calculate the new position without modifying the player's position
        if(this.player.garlic === true) {
            if(this.collidesWith(this.garlic)) {
                this.hitpoints -= 1;
                
            }
        }
        if (this.collidesWith(this.player)) {
            
            this.player.hitpoints -= 1;
            
        }
        if (this.hitpoints <= 0) {
            this.removeFromWorld = true;
        }
    }

    collidesWith(player) {
        if (this.x + this.width>= player.x && this.x <= player.x + player.width ) {
            if (this.y + this.height>= player.y && this.y <= player.y + player.height) {
                return true;
            }
        }
        return false;
    }
    

    draw(ctx) {
        this.healthbar.draw(ctx);
        ctx.drawImage(this.spritesheet,this.x, this.y, this.width, this.height);
    }
}
