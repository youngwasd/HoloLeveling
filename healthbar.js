class HealthBar {
    constructor(agent, player) {
        Object.assign(this, { agent, player });
    };

    update() {};

    draw(ctx) {
        const ratio = Math.min(this.agent.hitpoints / this.agent.maxhitpoints, 1);
        if (this.player) {
            const barX = 10;
            const barY = 10;

            const healthbar_length = 200;
            const healthbar_width = 8;

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            ctx.strokeStyle = "Black";
            ctx.fillStyle = "SkyBlue";

            const hp_length = Math.max(healthbar_length * ratio, 0);

            ctx.fillRect(barX, barY, hp_length, healthbar_width);
            ctx.strokeRect(barX, barY, healthbar_length, healthbar_width);

            ctx.restore(); // Restore the saved canvas state
        } else if ((this.agent.hitpoints < this.agent.maxhitpoints) && !this.player) {
            ctx.strokeStyle = "Black";
            ctx.fillStyle = "Red";
            ctx.fillRect(this.agent.x, this.agent.y + this.agent.height + 4, this.agent.width * ratio, 4);
            ctx.strokeRect(this.agent.x, this.agent.y + this.agent.height + 4, this.agent.width, 4);
        }
    };
};
