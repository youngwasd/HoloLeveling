// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        this.keyboardActive = false;

        // Use arrow functions to ensure 'this' refers to the instance of GameEngine
        this.ctx.canvas.addEventListener("keydown", event => this.keydownListener(event));
        this.ctx.canvas.addEventListener("keyup", event => this.keyUpListener(event));
    }

    keydownListener = (e) => {
        this.keyboardActive = true;
        switch (e.code) {
            case "ArrowLeft":
            case "KeyA":
                this.left = true;
                break;
            case "ArrowRight":
            case "KeyD":
                this.right = true;
                break;
            case "ArrowUp":
            case "KeyW":
                this.up = true;
                break;
            case "ArrowDown":
            case "KeyS":
                this.down = true;
                break;
        }
    }

    keyUpListener = (e) => {
        this.keyboardActive = false;
        switch (e.code) {
            case "ArrowLeft":
            case "KeyA":
                this.left = false;
                break;
            case "ArrowRight":
            case "KeyD":
                this.right = false;
                break;
            case "ArrowUp":
            case "KeyW":
                this.up = false;
                break;
            case "ArrowDown":
            case "KeyS":
                this.down = false;
                break;
        }
    }

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
        this.ctx.save();
    
        // Ensure there is at least one entity in the entities array
        if (this.entities.length > 0) {
            this.ctx.translate(-this.entities[0].cameraX, -this.entities[0].cameraY);
    
            // Draw latest things first
            for (let i = this.entities.length - 1; i >= 0; i--) {
                this.entities[i].draw(this.ctx, this);
            }
        }
    
        this.ctx.restore();
    };
    

    update() {
        let entitiesCount = this.entities.length;
        this.gamepadUpdate()

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    gamepadUpdate() {
        this.gamepad = navigator.getGamepads()[0];
        let gamepad = this.gamepad;
        if (gamepad != null && !this.keyboardActive) {
            this.left = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.3;
            this.right = gamepad.buttons[15].pressed || gamepad.axes[0] > 0.3;
            this.up = gamepad.buttons[12].pressed || gamepad.axes[1] < -0.3;
            this.down = gamepad.buttons[13].pressed || gamepad.axes[1] > 0.3;
        }
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
};
