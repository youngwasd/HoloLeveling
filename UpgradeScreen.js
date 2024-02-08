class UpgradeScreen {
    constructor(game) {
        this.game = game;
        this.container = document.createElement('div');
        this.container.id = 'upgrade-screen';
        this.container.style.display = 'none';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.container.style.zIndex = '999';

        this.createUpgradeOptions();

        document.body.appendChild(this.container);
    }

    createUpgradeOptions() {

        const upgradeOption1 = this.createUpgradeButton('Upgrade 1', () => {
            console.log('Upgraded Option 1');
            this.hideUpgradeScreen();
        });

        const upgradeOption2 = this.createUpgradeButton('Upgrade 2', () => {
            console.log('Upgraded Option 2');
            this.hideUpgradeScreen();
        });

        const upgradeOption3 = this.createUpgradeButton('Upgrade 3', () => {
            console.log('Upgraded Option 3');
            this.hideUpgradeScreen();
        });

        this.container.appendChild(upgradeOption1);
        this.container.appendChild(upgradeOption2);
        this.container.appendChild(upgradeOption3);
    }

    createUpgradeButton(text, onClickHandler) {
        const upgradeButton = document.createElement('button');
        upgradeButton.textContent = text;
        upgradeButton.style.fontSize = '30px';
        upgradeButton.style.width = '200px';
        upgradeButton.style.height = '60px';
        upgradeButton.style.margin = '20px';
        upgradeButton.style.backgroundColor = 'gray';
        upgradeButton.style.color = 'white';
        upgradeButton.style.border = 'none';
        upgradeButton.style.cursor = 'pointer';

        upgradeButton.addEventListener('click', onClickHandler);

        return upgradeButton;
    }

    showUpgradeScreen() {
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
    }

    hideUpgradeScreen() {
        this.container.style.display = 'none';
    }
}