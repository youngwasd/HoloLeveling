const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

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

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});