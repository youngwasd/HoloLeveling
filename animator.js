class Animator{
    constructor(spriteSheet, xStart, yStart, width, height, frames, duration, scale) {
        Object.assign(this, { spriteSheet, xStart, yStart, width, height, frames, duration, scale });

        this.elapsedTime = 0;
       
        this.totalTime = duration * frames;
    }

    drawFrame(tick, ctx, x, y) {
        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;

        const frame = this.currentFrame();
        ctx.drawImage(this.spriteSheet, this.xStart + this.width * frame, this.yStart, this.width, this.height, x, y, this.width * this.scale, this.height * this.scale) ;
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.duration);
    }

    isDone() {}
}
