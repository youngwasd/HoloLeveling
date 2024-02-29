class UpgradeScreen {
    constructor(game) {
        Object.assign(this, {game});
        this.upgrade1 = this.upgrade1.bind(this);
        this.upgrade2 = this.upgrade2.bind(this);
        this.upgrade3 = this.upgrade3.bind(this);
        this.upgrade4 = this.upgrade4.bind(this);
        this.fireballShown = false;
        this.upgrades = [
            { name: 'Increase Max HP', action: this.upgrade1 },
            { name: 'Increase Weapons Damage', action: this.upgrade2 },
            { name: 'Heal', action: this.upgrade3 },
            { name: 'Fire Ball', action: this.upgrade4}
        ];
        this.visible = false;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
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

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, 2500, 2500);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.currentUpgrades.forEach(button => {
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

        // Conditionally filter the upgrades array to exclude Fire Ball if it has been shown
        let availableUpgrades = this.fireballShown ? this.upgrades.filter(upgrade => !upgrade.fireball) : this.upgrades;

        // Shuffle the available upgrades array
        this.shuffleArray(availableUpgrades);

        // Select the first 3 upgrades after shuffling
        this.currentUpgrades = availableUpgrades.slice(0, 3);

        // Assign positions dynamically based on selection order
        const positions = [225, 525, 825]; // x positions for the 3 upgrades
        this.currentUpgrades.forEach((upgrade, index) => {
            upgrade.x = positions[index];
            upgrade.y = 500; // Keeping y constant for simplicity
            upgrade.width = 250;
            upgrade.height = 50;
        });
    }


    hide() {
        this.visible = false;
        this.game.paused = false; 
    }
    
    upgrade1() {
        const player = this.game.entities.find(entity => entity instanceof TheProtagonist);
        if (player) {
            player.maxhitpoints += 20;
            console.log("Increased max HP: " + player.maxhitpoints);
        }
    }

    upgrade2() {
        const dagger = this.game.entities.find(entity => entity instanceof Dagger);
        const fireball = this.game.entities.find(entity => entity instanceof Fireball);
        const player = this.game.entities.find(entity => entity instanceof TheProtagonist);

        if (fireball && player.weapons.fireball) {
            fireball.damage += 35;
            console.log("Increased fireball damage: " + fireball.damage);
        }

        if (dagger) {
            dagger.damage += 35;
            console.log("Increased dagger damage: " + dagger.damage);
        }
    }

    upgrade3() {
        const player = this.game.entities.find(entity => entity instanceof TheProtagonist);
        if (player) {
            player.hitpoints = player.maxhitpoints;
            console.log("Fully healed: " + player.hitpoints);
        }
    }
    
    upgrade4() {
        const player = this.game.entities.find(entity => entity instanceof TheProtagonist);
        if (player) {
            player.weapons.fireball = true;
            console.log("Fireball unlocked");
        }
    }
}