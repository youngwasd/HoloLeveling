class SceneManager{
    
    
    constructor(gameEngine){
        this.gameEngine = gameEngine;
        this.gameEngine.entities = [];
        
        this.loadLevelOne();
    }
    loadLevelOne(){
        let background = new Map(this.gameEngine, 0, 0, 2500, 2500, 1);

        let player = new TheProtagonist(this.gameEngine, background);
        let garlic = new Garlic(this.gameEngine, player);
        
        this.enemy = new Enemy2(1000, 900, player,garlic);
        
        this.tree = new Tree(900, 1000, player);
        
        
        
        this.gameEngine.addEntity(player);
        this.gameEngine.addEntity(garlic);
        this.gameEngine.addEntity(this.enemy);
        this.gameEngine.addEntity(this.tree);
        this.gameEngine.addEntity(background);
    }
}
