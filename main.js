const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

// sprites
ASSET_MANAGER.queueDownload("./sprites/protag_right.png");
ASSET_MANAGER.queueDownload("./sprites/protag_left.png");
ASSET_MANAGER.queueDownload("./sprites/issac.png");
ASSET_MANAGER.queueDownload("./sprites/trees.png");
ASSET_MANAGER.queueDownload("./sprites/goblin_right.png");
ASSET_MANAGER.queueDownload("./sprites/goblin_left.png");
ASSET_MANAGER.queueDownload("./sprites/dagger_right.png");
ASSET_MANAGER.queueDownload("./sprites/dagger_left.png");
ASSET_MANAGER.queueDownload("./sprites/Bat_Right.png");
ASSET_MANAGER.queueDownload("./sprites/Bat_Left.png");
ASSET_MANAGER.queueDownload("./sprites/zombie_left.png");
ASSET_MANAGER.queueDownload("./sprites/zombie_right.png");
ASSET_MANAGER.queueDownload("./sprites/grass.jpg");
ASSET_MANAGER.queueDownload("./sprites/slashv3.png");
ASSET_MANAGER.queueDownload("./sprites/slashv3_left.png");
ASSET_MANAGER.queueDownload("./sprites/lava.png");
ASSET_MANAGER.queueDownload("./sprites/golem_left.png");
ASSET_MANAGER.queueDownload("./sprites/golem_right.png");
ASSET_MANAGER.queueDownload("./sprites/fireball_left.png");
ASSET_MANAGER.queueDownload("./sprites/fireball_right.png");
ASSET_MANAGER.queueDownload("./sprites/chimera_left.png");
ASSET_MANAGER.queueDownload("./sprites/chimera_right.png");

// music
ASSET_MANAGER.queueDownload("./music/minecraft.mp3");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	ASSET_MANAGER.autoRepeat("./music/minecraft.mp3");

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});