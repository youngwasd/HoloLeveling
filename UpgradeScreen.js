class UpgradeScreen {
    constructor(game) {
        Object.assign(this, {game});
        this.upgrade1 = this.upgrade1.bind(this);
        this.upgrade2 = this.upgrade2.bind(this);
        this.upgrade3 = this.upgrade3.bind(this);
        this.upgrades = [
            { name: 'Upgrade 1', x: 250, y: 500, width: 200, height: 50, action: this.upgrade1 },
            { name: 'Upgrade 2', x: 550, y: 500, width: 200, height: 50, action: this.upgrade2 },
            { name: 'Upgrade 3', x: 850, y: 500, width: 200, height: 50, action: this.upgrade3 },
            // Add more upgrades as needed
        ];
        this.visible = false;
    }

    update() {
        if (!this.visible) return;

        this.upgrades.forEach(button => {
            if (this.isClicked(button)) {
                button.action();
                this.hide();
            }
        });
    }

    draw(ctx) {
        if (!this.visible) return;

        // Draw the background overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, 2500, 2500);

        // Draw buttons
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.upgrades.forEach(button => {
            ctx.fillStyle = 'grey';
            ctx.fillRect(button.x, button.y, button.width, button.height);

            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(button.name, button.x + 10, button.y + 30);
        });
        ctx.restore();
    }

    handleClick(click) {
        if (!this.visible) return;

        // Check each upgrade button
        this.upgrades.forEach(button => {
            if (click.x >= button.x && click.x <= button.x + button.width &&
                click.y >= button.y && click.y <= button.y + button.height) {
                button.action();
                this.hide();
            }
        });
    }

    isClicked(button) {
        return (
            this.game.mouseX >= button.x &&
            this.game.mouseX <= button.x + button.width &&
            this.game.mouseY >= button.y &&
            this.game.mouseY <= button.y + button.height &&
            this.game.click
        );
    }

    show() {
        this.visible = true;
        this.game.paused = true;
    }

    hide() {
        this.visible = false;
        this.game.paused = false; // Unpause the game
    }

    // Define upgrade actions
    upgrade1() {
        const player = this.game.entities.find(entity => entity instanceof TheProtagonist);
        if (player) {
            player.maxhitpoints += 50;
            console.log(player.maxhitpoints);
        }
        // Upgrade 1 logic
    }

    upgrade2() {
        const dagger = this.game.entities.find(entity => entity instanceof Dagger);
        if (dagger) {
            dagger.damage += 2;
            console.log(dagger.damage);
        }
        // Upgrade 2 logic
    }

    upgrade3() {
        const player = this.game.entities.find(entity => entity instanceof TheProtagonist);
        if (player) {
            player.hitpoints = player.maxhitpoints;
            console.log(player.hitpoints);
        }
        // Upgrade 2 logic
    }
}
