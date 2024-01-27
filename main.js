const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/protagonist.png");
ASSET_MANAGER.queueDownload("./sprites/forest.png");
ASSET_MANAGER.queueDownload("./sprites/forest2.jpg");
ASSET_MANAGER.queueDownload("./sprites/issac.png");
ASSET_MANAGER.queueDownload("./sprites/trees.png");
ASSET_MANAGER.queueDownload("./sprites/goblin_right.png");
ASSET_MANAGER.queueDownload("./sprites/goblin_left.png");
ASSET_MANAGER.queueDownload("./sprites/dagger_right.png");
ASSET_MANAGER.queueDownload("./sprites/dagger_left.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
