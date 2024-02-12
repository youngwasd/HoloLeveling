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

        this.mouseX = 0;
        this.mouseY = 0;
        
        this.paused = false;

        // Whether the mouse is clicked
        this.click = null;

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
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        this.keyboardActive = false;
        let that = this;

        function getXandY(e) {
            let x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
            return { x: x, y: y };
        }

        function mouseListener(e) {
            const { x, y } = getXandY(e);
            that.mouseX = x;
            that.mouseY = y;
        }

        function mouseClickListener(e) {
            const { x, y } = getXandY(e);
            that.click = { x, y };
        }

        // Use arrow functions to ensure 'this' refers to the instance of GameEngine
        this.ctx.canvas.addEventListener("mousemove", event => mouseListener(event));
        this.ctx.canvas.addEventListener("click", event => {
            const { x, y } = getXandY(event);
            this.click = { x, y };
            this.processClick(); // Process the click immediately
            this.click = null; // Reset click after processing
        });
        this.ctx.canvas.addEventListener("keydown", event => this.keydownListener(event));
        this.ctx.canvas.addEventListener("keyup", event => this.keyUpListener(event));
    }

    
    // ... existing properties and methods ...

    processClick() {
        // Check for paused state and handle upgrade screen clicks
        if (this.paused) {
            let upgradeScreen = this.entities.find(entity => entity instanceof UpgradeScreen);
            if (upgradeScreen) {
                upgradeScreen.handleClick(this.click);
            }
        } else {
            // Check for end screen and handle restart button clicks
            let endScreen = this.entities.find(entity => entity instanceof EndScreen);
            if (endScreen && endScreen.isDead) {
                endScreen.handleClick(this.click);
            }
        }

        this.click = null; // Reset click after processing
    }

    // ... rest of the GameEngine class ...



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

    restart() {
        window.location.reload(); // This will refresh the page
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

        this.camera.draw(this.ctx);

        this.ctx.restore();
    };
    
    update() {
        if(this.paused) {
            return;
        }
        params.DEBUG = document.getElementById("debug").checked;
        
        let entitiesCount = this.entities.length;
        this.gamepadUpdate();

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.dead) {
                entity.update();
            }
        }

        this.camera.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].dead) {
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
    };

    loop() {
        this.clockTick = this.timer.tick();
        if (this.paused) {
            // Handle input for pause menu or upgrade screen
            this.handlePauseInput();
        } else {
            // Regular game update
            this.update();
        }
        this.draw();
    };

    handlePauseInput() {

        let upgradeScreen = this.entities.find(entity => entity instanceof UpgradeScreen);
        if (this.click && upgradeScreen) {
            upgradeScreen.handleClick(this.click);
            this.click = null; // Reset click to avoid repeated handling
        }
    
    }
};
