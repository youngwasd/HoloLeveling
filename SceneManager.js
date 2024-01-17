class SceneManager{
    constructor(gameEngine){
        this.gameEngine = gameEngine;
        this.gameEngine.entities = [];
        
       
        
        this.loadLevelOne();
    }
    loadLevelOne(){
        this.theProtaginist = new TheProtagonist(this.gameEngine);
        this.theProtaginist.x = 50;
        this.theProtaginist.y = 50;
        this.gameEngine.addEntity(this.theProtaginist);
        
        this.enemy = new Enemy(this.gameEngine);
        
        //let tree = new Tree(this.gameEngine, 500, 500);
        this.gameEngine.addEntity(this.enemy);
        
        let background = new Map(this.gameEngine);
        this.gameEngine.addEntity(background);

       
        console.log(this.gameEngine.entities);

    }
}