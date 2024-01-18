class SceneManager{
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gameEngine.entities = [];
        
        this.loadLevelOne();
    }

    loadLevelOne() {
        const background = new Map(this.gameEngine, 0, 0, 2500, 2500, 1);

        this.theProtagonist = new TheProtagonist(this.gameEngine, background);
        this.theProtagonist.x = 500;
        this.theProtagonist.y = 500;

        this.tree = new Tree(500, 500);


        this.gameEngine.addEntity(this.theProtagonist, background);

        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * background.getWidth());
            const y = Math.floor(Math.random() * background.getHeight());
            
            let speed = Math.floor(Math.random() * (this.theProtagonist.speed * 0.8) + 150);
            speed = speed >= this.theProtagonist.speed ? speed - 100 : speed;

            this.enemy = new Enemy(this.gameEngine, x, y, speed);
            this.gameEngine.addEntity(this.enemy);
        }

        this.gameEngine.addEntity(this.tree);
        this.gameEngine.addEntity(background);
    }
}
