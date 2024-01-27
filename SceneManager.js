class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.entities = [];

        this.loadLevelOne();
    }

    loadLevelOne() {
        let background = new Map(this.game, 0, 0, 2500, 2500);

        this.theProtagonist = new TheProtagonist(this.game, background);
        this.theProtagonist.x = 1000;
        this.theProtagonist.y = 1000;
        
        this.tree = new Tree(this.game, 900, 1000);
        const garlic = new Garlic(this.game, this.theProtagonist);

        this.game.addEntity(this.theProtagonist);

        this.game.addEntity(garlic);

        // for (let i = 0; i < 10; i++) {
        //     const x = Math.floor(Math.random() * background.getWidth());
        //     const y = Math.floor(Math.random() * background.getHeight());
        //
        //     let speed = Math.floor(Math.random() * (this.theProtagonist.speed * 0.6) + 150);
        //     speed = speed >= this.theProtagonist.speed ? speed - 200 : speed;
        //
        //     this.issac = new Issac(this.game, x, y, speed, this.theProtagonist, garlic);
        //     this.game.addEntity(this.issac);
        //
        //     const x2 = Math.floor(Math.random() * background.getWidth());
        //     const y2 = Math.floor(Math.random() * background.getHeight());
        //
        //     let speed2 = Math.floor(Math.random() * (this.theProtagonist.speed * 0.6) + 150);
        //     speed2 = speed2 >= this.theProtagonist.speed ? speed2 - 200 : speed2;
        //
        //     this.goblin = new Goblin(this.game, x2, y2, speed2, this.theProtagonist, garlic);
        //     this.game.addEntity(this.goblin);
        // }
        this.e1 = new Goblin(this.game, 900, 900, 0, this.theProtagonist, garlic);
        this.game.addEntity(this.e1);


        this.game.addEntity(this.tree);
        this.game.addEntity(background);
    }
}
