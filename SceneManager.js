
class SceneManager{
    
    
    constructor(gameEngine){
        this.gameEngine = gameEngine;
        this.gameEngine.entities = [];
        
        this.loadLevelOne();
    }
    loadLevelOne(){
        this.theProtaginist = new TheProtagonist(this.gameEngine);
        this.theProtaginist.x = 500;
        this.theProtaginist.y = 500;
        this.gameEngine.addEntity(this.theProtaginist);
        
        this.enemy = new Enemy(this.gameEngine, 550, 550);
        this.gameEngine.addEntity(this.enemy);
        
        this.tree = new Tree( 500,500);
       this.gameEngine.addEntity(this.tree);

        
        let background = new Map(this.gameEngine, 0, 0,2500 , 2500, 1);
        this.gameEngine.addEntity(background);

       
        console.log(this.gameEngine.entities);

    }
}