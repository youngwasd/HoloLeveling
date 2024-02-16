class EndScreen {
    constructor(game) {
        this.game = game;
        this.isDead = false;

        this.restartButton = {
            x: 550,
            y: 400,
            width: 200,
            height: 50
        };
    }

    update() {
        if (
            this.isDead &&
            this.game.mouseX >= this.restartButton.x &&
            this.game.mouseX <= this.restartButton.x + this.restartButton.width &&
            this.game.mouseY >= this.restartButton.y &&
            this.game.mouseY <= this.restartButton.y + this.restartButton.height &&
            this.game.click
        ) {
            this.game.restart();
        }
        
    }

    draw(ctx) {
        if (this.isDead) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, 2500, 2500);
            ctx.font = "100px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Game Over", 400, 300);

            // Draw restart button
            ctx.fillStyle = "grey";
            ctx.fillRect(
                this.restartButton.x,
                this.restartButton.y,
                this.restartButton.width,
                this.restartButton.height
            );
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Restart", this.restartButton.x + 50, this.restartButton.y + 35);
            let waveInstance = this.game.camera.currWave
            
            ctx.font = "40px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Waves Survived: " + waveInstance, 475, 375);
        }
    }

    handleClick(click) {
        if (this.isDead &&
            click.x >= this.restartButton.x &&
            click.x <= this.restartButton.x + this.restartButton.width &&
            click.y >= this.restartButton.y &&
            click.y <= this.restartButton.y + this.restartButton.height) {
            this.game.restart();
        }
    }
}
