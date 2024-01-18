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
            const random = Math.floor(Math.random() * background.getWidth());
            const random2 = Math.floor(Math.random() * background.getHeight());

            this.enemy = new Enemy(this.gameEngine, random, random2);
            this.gameEngine.addEntity(this.enemy);
        }

        this.gameEngine.addEntity(this.tree);
        this.gameEngine.addEntity(background);
    }
}
