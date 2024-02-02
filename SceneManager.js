class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.entities = [];

        this.loadLevelOne();
    }

    loadLevelOne() {
        let end = new EndScreen(this.game);
        let background = new Map(this.game, 0, 0, 2500, 2500);

        this.theProtagonist = new TheProtagonist(this.game, background, end);
        this.theProtagonist.x = 1000;
        this.theProtagonist.y = 1000;
        
        this.tree = new Tree(this.game, 900, 1000);

        const dagger = new Dagger(this.game, this.theProtagonist);

        this.game.addEntity(this.theProtagonist);
        this.game.addEntity(end);
        this.game.addEntity(dagger);

        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * background.getWidth());
            const y = Math.floor(Math.random() * background.getHeight());

            let speed = Math.floor(Math.random() * (this.theProtagonist.speed * 0.6) + 150);
            speed = speed >= this.theProtagonist.speed ? speed - 200 : speed;

            this.issac = new Issac(this.game, x, y, speed, this.theProtagonist);
            this.game.addEntity(this.issac);

            const x2 = Math.floor(Math.random() * background.getWidth());
            const y2 = Math.floor(Math.random() * background.getHeight());

            let speed2 = Math.floor(Math.random() * (this.theProtagonist.speed * 0.6) + 150);
            speed2 = speed2 >= this.theProtagonist.speed ? speed2 - 200 : speed2;

            this.goblin = new Goblin(this.game, x2, y2, speed2, this.theProtagonist);
            this.game.addEntity(this.goblin);
        }


        this.game.addEntity(this.tree);
        this.game.addEntity(background);
    }
}
