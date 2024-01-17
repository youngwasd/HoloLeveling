const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/test.png");
ASSET_MANAGER.queueDownload("./sprites/forest.png");
ASSET_MANAGER.queueDownload("./sprites/forest2.jpg");
ASSET_MANAGER.queueDownload("./sprites/issac.png");
ASSET_MANAGER.queueDownload("./sprites/trees.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);
	new SceneManager(gameEngine);
	gameEngine.start();
});
