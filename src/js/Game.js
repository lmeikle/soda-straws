/**
 * Game
 * @constructor
 */
function Game()
{
	this._stage = null;
	this._renderer = null;
	
	// determine what kind on device we are running on
	// desktop is wrapped in an iPhone frame image
	var hasTouch = Modernizr.touchevents; //Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device
	//hasTouch = true;
	if (hasTouch) 
	{
		this._deviceType = Game.TOUCH_DEVICE;
		this._hasFrameWrapper = false;
		document.body.className = Game.TOUCH_DEVICE;
	} 
	else
	{
		this._deviceType = Game.DESKTOP_DEVICE;
		this._hasFrameWrapper = true;
		document.body.className = Game.DESKTOP_DEVICE;
	}

	// size the wrapper 
	this._resize();

	// the wrapper has been sized correctly so we can display it
	document.getElementById("wrapper").style.display = "block";
		
	// create the stage
	this._createStage();

	// pre-load all the assets before we create the game
	this._preloader = new Preloader(this._showPlayScreen.bind(this));
}

Game.TOUCH_DEVICE = "TOUCH_DEVICE";
Game.DESKTOP_DEVICE = "DESKTOP_DEVICE";

Game.prototype._createStage = function ()
{
	// The stage is essentially a display list of all game objects
	// for Pixi to render; it's used in resize(), so it must exist
	this._stage = new PIXI.Container();

	// make a container to hold elements that will be stretched to fill the whole canvas
	// ie the play screen and background
	this._stretchingContainer = new PIXI.Container();
	this._stage.addChild(this._stretchingContainer);

	// make a container that will be scaled proportionally to fit the canvas based on the GAME_DIMENSIONS the game has been designed too
	this._scalingContainer = new PIXI.Container();
	this._stage.addChild(this._scalingContainer);

	var rendererOptions = {
		antialiasing: false,
		transparent: false,
		resolution: window.devicePixelRatio,
		autoResize: true
	};

	// create a renderer instance.
	// Renderer – A renderer draws a stage and all its contents to the screen. It comes in two flavours, webGL and Canvas.
	this._renderer = new PIXI.WebGLRenderer(50, 50, rendererOptions);

	// add the renderer view element to the DOM
	document.getElementById("game").appendChild(this._renderer.view);

	// Listen for and adapt to changes to the screen size, e.g.,
	// user changing the window or rotating their device
	window.addEventListener("resize", this._resize.bind(this));

	requestAnimationFrame(animate.bind(this));

	function animate()
	{
		requestAnimationFrame(animate.bind(this));

		// render the stage
		this._renderer.render(this._stage);
	}
};

Game.prototype._showPlayScreen = function ()
{
	this._playScreen = new PlayScreen(this, this._stage);

	// size all the elements
	this._resize();
	
	// hide the loader
	document.getElementById("loader").style.display = "none";
};

Game.prototype.playClicked = function ()
{
	// remove the play screen
	this._playScreen.destroy();

	// create background that will stretch to fill the canvas
	var backgroundSprite = new PIXI.Sprite(this.getPreloaderResources().background.texture);
	backgroundSprite.cacheAsBitmap = true;
	this._stretchingContainer.addChild(backgroundSprite);

	// create the board
	this._board = new Board(this);
	this._board.startGame();
};

Game.prototype._resize = function ()
{
	if (this._hasFrameWrapper)
	{
		// running on desktop, wrapped in the iPhone frame image. use JS to size the wrapper
		var wrapperRatio = Math.min(window.innerWidth / GameConstants.WRAPPER_WIDTH,
							        window.innerHeight / GameConstants.WRAPPER_HEIGHT);
		this._wrapperWidth = Math.ceil(GameConstants.WRAPPER_WIDTH * wrapperRatio);
		this._wrapperHeight = Math.ceil(GameConstants.WRAPPER_HEIGHT * wrapperRatio);
		
		document.getElementById("wrapper").style.width = this._wrapperWidth + "px";
		document.getElementById("wrapper").style.height = this._wrapperHeight + "px";
		
		if (this._stage)
		{
			// we can just scale the stage when running in the iPhone frame image as the wrapper will be
			// the correct proportions all the time
			var gameWidth = document.getElementById("game").offsetWidth;
			var gameHeight= document.getElementById("game").offsetHeight;
			
			// Determine which screen dimension is most constrained
			var gameRatio = Math.max(gameWidth / GameConstants.GAME_WIDTH,
								     gameHeight / GameConstants.GAME_HEIGHT);
		
			// Scale the view appropriately to fill that dimension
			this._stage.scale.x = this._stage.scale.y = gameRatio;
		
			// Update the renderer dimensions
			this._renderer.resize(gameWidth, gameHeight);
		}
	}
	else
	{
		// running on mobile/tablet, game fills the screen	
		if (this._stage)
		{
			var gameContainerWidth = document.getElementById("game").offsetWidth;
			var gameContainerHeight= document.getElementById("game").offsetHeight;
						     
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
			// Determine which screen dimension is most constrained
			var ratio = Math.min(gameContainerWidth / GameConstants.GAME_WIDTH,
							     gameContainerHeight / GameConstants.GAME_HEIGHT);
			this._scalingContainer.scale.x = this._scalingContainer.scale.y = ratio;
			
			// position the _scalingContainer
			this._scalingContainer.x = (gameContainerWidth - (GameConstants.GAME_WIDTH * ratio)) * 0.5;
			this._scalingContainer.y = 0; // always position a the top of the screen
			
			// resize the render to fill the game container
			this._renderer.resize(gameContainerWidth, gameContainerHeight);
		}
	}
};

Game.prototype.getStage = function ()
{
	return this._stage;
};

Game.prototype.getScalingContainer = function ()
{
	return this._scalingContainer;
};

Game.prototype.getRenderer = function ()
{
	return this._renderer;
};

Game.prototype.hasFrameWrapper = function ()
{
	return this._hasFrameWrapper;
};

Game.prototype.getPreloaderResources = function ()
{
	return this._preloader.getResources();
};
