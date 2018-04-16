/**
 * PlayScreen
 * @constructor
 */
function PlayScreen(game, container)
{
	this._game = game;
	this._container = container;
	this._resources = this._game.getPreloaderResources();

	this._createView();
	this._pulsePlayButton();
	
	this._resize();
	
	// Listen for and adapt to changes to the screen size, e.g.,
	// user changing the window or rotating their device
	window.addEventListener("resize", this._resize.bind(this));
}

PlayScreen.prototype.destroy = function ()
{
	clearInterval(this._pulsePlayButtonTimerID);

	this._container.removeChild(this._stretchingContainer);
	this._container.removeChild(this._scalingContainer);
};

PlayScreen.prototype._createView = function ()
{
	// make a container to hold elements that will be stretched to fill the whole canvas
	this._stretchingContainer = new PIXI.Container();
	this._container.addChild(this._stretchingContainer);

	// make a container that will be scaled proportionally to fit the canvas based on the GAME_DIMENSIONS the game has been designed too
	this._scalingContainer = new PIXI.Container();
	this._container.addChild(this._scalingContainer);

	// create play splash screen
	this._playScreenBackgroundSprite = new PIXI.Sprite(this._resources.playScreen.texture);
	this._stretchingContainer.addChild(this._playScreenBackgroundSprite);

	this._playScreenElementsContainer = new PIXI.Container();
	this._playScreenElementsContainer.x = 125;
	this._playScreenElementsContainer.y = 136;
	this._scalingContainer.addChild(this._playScreenElementsContainer);

	var playScreenLogoSprite = new PIXI.Sprite(this._resources.playScreenLogo.texture);
	this._playScreenElementsContainer.addChild(playScreenLogoSprite);

	this._playButtonSprite = new PIXI.Sprite(this._resources.playButton.texture);
	this._playScreenElementsContainer.addChild(this._playButtonSprite);
	this._playButtonSprite.x = 205;
	this._playButtonSprite.y = 590;
	this._playButtonSprite.anchor.x = 0.5;
	this._playButtonSprite.anchor.y = 0.5;
	this._playButtonSprite.interactive = true;
	this._playButtonSprite.buttonMode = true;
	this._playButtonSprite.on('mouseup', this._game.playClicked.bind(this._game));
	this._playButtonSprite.on('touchend', this._game.playClicked.bind(this._game));
};

PlayScreen.prototype._pulsePlayButton = function ()
{
	var playButtonSprite = this._playButtonSprite;
	this._pulsePlayButtonTimerID = setInterval(function() {
			TweenLite.to(playButtonSprite.scale, 500 / 1000, {x: 1.1, y: 1.1, onComplete: function() {
			TweenLite.to(playButtonSprite.scale, 500 / 1000, {x: 1, y: 1});
		}});
	}, 1000);
};

PlayScreen.prototype._resize = function ()
{
	if (!this._game.hasFrameWrapper())
	{
		var gameContainerWidth = document.getElementById("game").offsetWidth;
		var gameContainerHeight = document.getElementById("game").offsetHeight;

		// scale the _stretchingContainer to 'cover' the game container
		// The maximum amount of space to fill
		// Work out the scale amounts to fit horizontally and vertically
		var scaleWidth = gameContainerWidth / GameConstants.GAME_WIDTH;
		var scaleHeight = gameContainerHeight / GameConstants.GAME_HEIGHT;

		// Get largest
		var newScale = Math.max(scaleWidth, scaleHeight);

		// Set new scale
		this._stretchingContainer.scale.x = this._stretchingContainer.scale.y = newScale;

		// position it
		this._stretchingContainer.x = (gameContainerWidth - (GameConstants.GAME_WIDTH * newScale)) * 0.5;
		this._stretchingContainer.y = (gameContainerHeight - (GameConstants.GAME_HEIGHT * newScale)) * 0.5;

		// scale the _scalingContainer proportionally
		var ratio = gameContainerHeight / 1136; // 1136 is the height of the playScreenLogo plus its y position
		this._scalingContainer.scale.x = this._scalingContainer.scale.y = ratio;

		// position the _scalingContainer
		this._scalingContainer.x = (gameContainerWidth - (GameConstants.GAME_WIDTH * ratio)) * 0.5;
		this._scalingContainer.y = 0;
	}
};
