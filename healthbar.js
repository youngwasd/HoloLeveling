class HealthBar {
    constructor(agent, player) {
        Object.assign(this, { agent, player });
    };

    update() {
       
    };

    draw(ctx) {
        const ratio = this.agent.hitpoints / this.agent.maxhitpoints;
        if (this.player) {
            const barX = 10;
            const barY = 10;

            const healthbar_length = 200;
            const healthbar_width = 8;

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            ctx.strokeStyle = "Black";
            ctx.fillStyle = "SkyBlue";
            ctx.fillRect(barX, barY, healthbar_length * ratio, healthbar_width);
            ctx.strokeRect(barX, barY, healthbar_length, healthbar_width);

            ctx.restore(); // Restore the saved canvas state
        } else if ((this.agent.hitpoints < this.agent.maxhitpoints) && !this.player) {
            ctx.strokeStyle = "Black";
            ctx.fillStyle = "Red";
            ctx.fillRect(this.agent.x - this.agent.radius, this.agent.y + this.agent.radius + 5, this.agent.radius * 2 * ratio, 4);
            ctx.strokeRect(this.agent.x - this.agent.radius, this.agent.y + this.agent.radius + 5, this.agent.radius * 2, 4);
        }
    };
};

// class Score {
//     constructor(game, x, y, score) {
//         Object.assign(this, {game, x, y, score});

//         this.velocity = -32;
//         this.elapsed = 0;
//     };

//     update() {
//         this.elapsed += this.game.clockTick;
//         if (this.elapsed > 1) this.removeFromWorld = true;

//         this.y += this.game.clockTick * this.velocity;
//     };

//     draw(ctx) {
//         ctx.fillStyle = "White";
//         ctx.fillText(this.score, this.x, this.y);
//     };
// };