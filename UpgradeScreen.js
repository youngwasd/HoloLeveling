class UpgradeScreen {
    constructor(game) {
        this.game = game;
        this.upgrades = [
            { name: 'Upgrade 1', x: 300, y: 500, width: 200, height: 50, action: this.upgrade1 },
            { name: 'Upgrade 2', x: 600, y: 500, width: 200, height: 50, action: this.upgrade2 },
            { name: 'Upgrade 3', x: 900, y: 500, width: 200, height: 50, action: this.upgrade3 },
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
        this.visible = false;
        // Upgrade 1 logic
    }

    upgrade2() {
        this.visible = false;
        // Upgrade 2 logic
    }

    upgrade3() {
        this.visible = false;
        // Upgrade 2 logic
    }
}
