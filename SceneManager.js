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
        
        let background = new Map(this.gameEngine);
        this.gameEngine.addEntity(background);

       
        console.log(this.gameEngine.entities);

    }
}