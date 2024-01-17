class SceneManager{
    
    
    constructor(gameEngine){
        this.gameEngine = gameEngine;
        this.gameEngine.entities = [];
        
        this.loadLevelOne();
    }
    loadLevelOne(){
        let background = new Map(this.gameEngine, 0, 0, 2500, 2500, 1);

        this.theProtagonist = new TheProtagonist(this.gameEngine, background);
        this.theProtagonist.x = 500;
        this.theProtagonist.y = 500;

        this.enemy = new Enemy(this.gameEngine, 550, 550);
        
        this.tree = new Tree(500, 500);

        this.gameEngine.addEntity(this.theProtagonist, background);
        this.gameEngine.addEntity(this.enemy);
        this.gameEngine.addEntity(this.tree);
        this.gameEngine.addEntity(background);
    }
}
