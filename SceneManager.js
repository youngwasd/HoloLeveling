class SceneManager{
    
    
    constructor(gameEngine){
        this.gameEngine = gameEngine;
        this.gameEngine.entities = [];
        
        this.loadLevelOne();
    }
    loadLevelOne(){
        let background = new Map(this.gameEngine, 0, 0, 2500, 2500, 1);

        this.theProtagonist = new TheProtagonist(this.gameEngine, background);
        this.theProtagonist.x = 1000;
        this.theProtagonist.y = 1000;
        let garlic = new Garlic(this.gameEngine, this.theProtagonist);
        this.tree = new Tree(900, 1000, this.theProtagonist);
        
        this.gameEngine.addEntity(this.theProtagonist);
        this.gameEngine.addEntity(garlic);
        this.enemy = new Enemy2(800, 1000,this.theProtagonist,garlic);
        this.gameEngine.addEntity(this.enemy);

        this.gameEngine.addEntity(this.tree);
        this.gameEngine.addEntity(background);
    }
}
