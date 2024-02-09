class UpgradeScreen {
    constructor(game) {
        Object.assign(this, {game});
        this.upgrade1 = this.upgrade1.bind(this);
        this.upgrade2 = this.upgrade2.bind(this);
        this.upgrade3 = this.upgrade3.bind(this);
        this.upgrades = [
            { name: 'Increase Max HP', x: 225, y: 500, width: 250, height: 50, action: this.upgrade1 },
            { name: 'Increase Dagger Damage', x: 525, y: 500, width: 250, height: 50, action: this.upgrade2 },
            { name: 'Heal', x: 825, y: 500, width: 250, height: 50, action: this.upgrade3 },
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

            const textX = button.x + (button.width - ctx.measureText(button.name).width) / 2;
            const textY = button.y + button.height / 2 + 7;

            ctx.fillText(button.name,  textX, textY);
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
            player.maxhitpoints += 20;
            console.log(player.maxhitpoints);
        }
    }

    upgrade2() {
        const dagger = this.game.entities.find(entity => entity instanceof Dagger);
        if (dagger) {
            dagger.damage += 3;
            console.log(dagger.damage);
        }
    }

    upgrade3() {
        const player = this.game.entities.find(entity => entity instanceof TheProtagonist);
        if (player) {
            player.hitpoints = player.maxhitpoints;
            console.log(player.hitpoints);
        }
    }
}
