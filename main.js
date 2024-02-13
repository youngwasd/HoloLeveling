const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// sprites
ASSET_MANAGER.queueDownload("./sprites/protag_right.png");
ASSET_MANAGER.queueDownload("./sprites/protag_left.png");
ASSET_MANAGER.queueDownload("./sprites/forest.png");
ASSET_MANAGER.queueDownload("./sprites/forest2.jpg");
ASSET_MANAGER.queueDownload("./sprites/issac.png");
ASSET_MANAGER.queueDownload("./sprites/trees.png");
ASSET_MANAGER.queueDownload("./sprites/goblin_right.png");
ASSET_MANAGER.queueDownload("./sprites/goblin_left.png");
ASSET_MANAGER.queueDownload("./sprites/dagger_right.png");
ASSET_MANAGER.queueDownload("./sprites/rightSlash.png");
ASSET_MANAGER.queueDownload("./sprites/leftSlash.png");
ASSET_MANAGER.queueDownload("./sprites/dagger_left.png");
ASSET_MANAGER.queueDownload("./sprites/Bat_Right.png");
ASSET_MANAGER.queueDownload("./sprites/Bat_Left.png");
ASSET_MANAGER.queueDownload("./sprites/Golem_Right.png");
ASSET_MANAGER.queueDownload("./sprites/Golem_Left.png");
ASSET_MANAGER.queueDownload("./sprites/zombie_left.png");
ASSET_MANAGER.queueDownload("./sprites/zombie_right.png");
ASSET_MANAGER.queueDownload("./sprites/grass.jpg");
ASSET_MANAGER.queueDownload("./sprites/slash2.png");
ASSET_MANAGER.queueDownload("./sprites/newsprite3.png");
ASSET_MANAGER.queueDownload("./sprites/newsprite4.png");




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