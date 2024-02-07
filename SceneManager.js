class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.entities = [];

        this.loadLevelOne();
    }

    loadLevelOne() {
        this.end = new EndScreen(this.game);
        this.background = new Map(this.game, 0, 0, 2500, 2500);
        
        this.theProtagonist = new TheProtagonist(this.game, this.background, this.end);
        
        this.game.addEntity(this.theProtagonist);
        this.game.addEntity(this.end);
        this.game.addEntity(new Dagger(this.game, this.theProtagonist));
        this.game.addEntity(new Tree(this.game, 900, 1000));
        this.game.addEntity(new Wave(this.game, this.theProtagonist));
    }
}
