class SceneManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gameEngine.entities = [];
        
        this.loadLevelOne();
    }

    loadLevelOne() {
        let background = new Map(this.gameEngine, 0, 0, 2500, 2500, 1);

        this.theProtaginist = new TheProtagonist(this.gameEngine, background);
        this.theProtaginist.x = 500;
        this.theProtaginist.y = 500;
        this.gameEngine.addEntity(this.theProtaginist);
        this.gameEngine.addEntity(background);

    }
}
