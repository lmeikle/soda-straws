/**
 * EndGameDialog
 * @constructor
 */
function EndGameDialog(game, container, board)
{
	this._game = game;
	this._container = container;
	this._board = board;

	this._resources = this._game.getPreloaderResources();

	this._createView();
	
	this._resize();
	
	// Listen for and adapt to changes to the screen size, e.g.,
	// user changing the window or rotating their device
	window.addEventListener("resize", this._resize.bind(this));
}

EndGameDialog.prototype.reset = function ()
{
	this._game.getStage().removeChild(this._stretchingContainer);
	this._game.getStage().removeChild(this._scalingContainer);
};

EndGameDialog.prototype._createView = function ()
{
	this._createDialogBackground();
	this._createTitle();
	this._createStars();
	this._createScore();
	this._createMonster();
	this._createButtons();
};

EndGameDialog.prototype._createDialogBackground = function ()
{
	// make a container to hold elements that will be stretched to fill the whole canvas
	// ie the blackout  
	this._stretchingContainer = new PIXI.Container();
	//this._game.getStage().addChild(this._stretchingContainer);
	
	// make a container that will be scaled proportionally to fit the canvas based on the GAME_DIMENSIONS the game has been designed too
	this._scalingContainer = new PIXI.Container();
	//this._game.getStage().addChild(this._scalingContainer);
	
	this._dialogSprite = new PIXI.Sprite();
	this._scalingContainer.addChild(this._dialogSprite);
	
	this._dialogBlackout = new PIXI.Graphics();
	this._dialogBlackout.beginFill(0x000000, 0.5);
	this._dialogBlackout.drawRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
	this._dialogBlackout.endFill();
	this._stretchingContainer.addChild(this._dialogBlackout);

	this._dialogBackgroundSprite = new PIXI.Sprite(this._resources.dialogBackground.texture);
	this._dialogBackgroundSprite.x = 10;
	this._dialogBackgroundSprite.y = 220;
	this._dialogBackgroundSprite.width = 620;
	this._dialogBackgroundSprite.height = 650;
	this._dialogSprite.addChild(this._dialogBackgroundSprite);
};

EndGameDialog.prototype._createTitle = function ()
{
	var textOptions = {
		font: 'normal 80px Lobster', // Set style, size and font
		fill: '#ffffff', // Set fill color to blue
		align: 'center', // Center align the text, since it's multiline
		stroke: '#5A44B3', // Set stroke color to a dark blue-gray color
		strokeThickness: 20, // Set stroke thickness to 20
		lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
		//dropShadow: true,
		//dropShadowColor: '#5A44B3',
		//dropShadowAngle: Math.PI/4,
		//dropShadowDistance: 7
	};

	this._titleText = new PIXI.Text('', textOptions);
	this._titleText.x = 310;
	this._titleText.y = 0;
	this._titleText.anchor.x = 0.5;
	this._titleText.anchor.y = 0.5;
	this._dialogBackgroundSprite.addChild(this._titleText);
};

EndGameDialog.prototype._createStars = function ()
{
	this._dialogStarSprite1 = new PIXI.Sprite(this._resources.dialogStar.texture);
	this._dialogStarSprite1.x = 75;
	this._dialogStarSprite1.y = 75;
	this._dialogBackgroundSprite.addChild(this._dialogStarSprite1);

	this._dialogStarSprite2 = new PIXI.Sprite(this._resources.dialogStar.texture);
	this._dialogStarSprite2.x = 250;
	this._dialogStarSprite2.y = 75;
	this._dialogBackgroundSprite.addChild(this._dialogStarSprite2);

	this._dialogStarSprite3 = new PIXI.Sprite(this._resources.dialogStar.texture);
	this._dialogStarSprite3.x = 425;
	this._dialogStarSprite3.y = 75;
	this._dialogBackgroundSprite.addChild(this._dialogStarSprite3);
};

EndGameDialog.prototype._createScore = function ()
{
	var scoreLabelTextOptions = {
		font: 'normal 50px Lobster', // Set style, size and font
		fill: '#ffffff', // Set fill color to blue
		align: 'center', // Center align the text, since it's multiline
		stroke: '#5A44B3', // Set stroke color to a dark blue-gray color
		strokeThickness: 5, // Set stroke thickness to 20
		lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
		//dropShadow: true,
		//dropShadowColor: '#5A44B3',
		//dropShadowAngle: Math.PI/4,
		//dropShadowDistance: 7
	};

	var scoreLabel = new PIXI.Text('', scoreLabelTextOptions);
	scoreLabel.x = 310;
	scoreLabel.y = 260;
	scoreLabel.anchor.x = 0.5;
	scoreLabel.anchor.y = 0.5;
	scoreLabel.text = 'Score:';
	this._dialogBackgroundSprite.addChild(scoreLabel);

	var dialogScoreSprite = new PIXI.Sprite(this._resources.dialogScore.texture);
	dialogScoreSprite.x = 160;
	dialogScoreSprite.y = 310;
	dialogScoreSprite.width = 300;
	dialogScoreSprite.height = 90;
	this._dialogBackgroundSprite.addChild(dialogScoreSprite);

	var scoreValueOptions = {
			font: 'normal 50px Lobster', // Set style, size and font
			fill: '#ffffff', // Set fill color to blue
			align: 'center', // Center align the text, since it's multiline
			stroke: '#5A44B3', // Set stroke color to a dark blue-gray color
			strokeThickness: 5, // Set stroke thickness to 20
			lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
			//dropShadow: true,
			//dropShadowColor: '#5A44B3',
			//dropShadowAngle: Math.PI/4,
			//dropShadowDistance: 7
	};

	this._scoreValue = new PIXI.Text('', scoreValueOptions);
	this._scoreValue.x = 180;
	this._scoreValue.y = 45;
	this._scoreValue.anchor.x = 0.5;
	this._scoreValue.anchor.y = 0.5;
	dialogScoreSprite.addChild(this._scoreValue);
};

EndGameDialog.prototype._createMonster = function ()
{
	var monsterSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('monster_idle0001.png'));
	monsterSprite.x = 210;
	monsterSprite.y = 420;
	monsterSprite.scale.x = 0.8;
	monsterSprite.scale.y = 0.8;
	this._dialogBackgroundSprite.addChild(monsterSprite);
};

EndGameDialog.prototype._createButtons = function ()
{
	this._tryAgainButtonSprite = new PIXI.Sprite(this._resources.dialogButton.texture);
	this._tryAgainButtonSprite.x = 410;
	this._tryAgainButtonSprite.y = 580;
	this._tryAgainButtonSprite.interactive = true;
	this._tryAgainButtonSprite.buttonMode = true;
	this._tryAgainButtonSprite.on('mouseup', this._tryAgainClicked.bind(this));
	this._tryAgainButtonSprite.on('touchend', this._tryAgainClicked.bind(this));
	this._dialogBackgroundSprite.addChild(this._tryAgainButtonSprite);

	var textOptions = {
			font: 'normal 40px Lobster', // Set style, size and font
			fill: '#ffffff', // Set fill color to blue
			align: 'center', // Center align the text, since it's multiline
			stroke: '#5A44B3', // Set stroke color to a dark blue-gray color
			strokeThickness: 5, // Set stroke thickness to 20
			lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
			//dropShadow: true,
			//dropShadowColor: '#5A44B3',
			//dropShadowAngle: Math.PI/4,
			//dropShadowDistance: 7
	};

	var tryAgainText = new PIXI.Text('', textOptions);
	tryAgainText.x = 100;
	tryAgainText.y = 44;
	tryAgainText.anchor.x = 0.5;
	tryAgainText.anchor.y = 0.5;
	tryAgainText.text = 'Try Again';
	this._tryAgainButtonSprite.addChild(tryAgainText);

	this._nextButtonSprite = new PIXI.Sprite(this._resources.dialogButton.texture);
	this._nextButtonSprite.x = 410;
	this._nextButtonSprite.y = 580;
	this._nextButtonSprite.interactive = true;
	this._nextButtonSprite.buttonMode = true;
	this._nextButtonSprite.on('mouseup', this._nextClicked.bind(this));
	this._nextButtonSprite.on('touchend', this._nextClicked.bind(this));
	this._dialogBackgroundSprite.addChild(this._nextButtonSprite);

	var nextText = new PIXI.Text('', textOptions);
	nextText.x = 100;
	nextText.y = 44;
	nextText.anchor.x = 0.5;
	nextText.anchor.y = 0.5;
	nextText.text = 'Play Again';
	this._nextButtonSprite.addChild(nextText);
};

EndGameDialog.prototype._tryAgainClicked = function ()
{
	this._board.restartGame();
};

EndGameDialog.prototype._nextClicked = function ()
{
	this._board.restartGame();
};

EndGameDialog.prototype.showDialog = function (wonGame, score)
{
	if (wonGame)
	{
		this._titleText.text = 'Level 1 - Completed';
		this._nextButtonSprite.visible = true;
		this._tryAgainButtonSprite.visible = false;
		this._dialogStarSprite1.alpha = 1;
		this._dialogStarSprite2.alpha = 1;
		this._dialogStarSprite3.alpha = 1;
	}
	else
	{
		this._titleText.text = 'Level 1 - Failed';
		this._nextButtonSprite.visible = false;
		this._tryAgainButtonSprite.visible = true;
		this._dialogStarSprite1.alpha = 0.3;
		this._dialogStarSprite2.alpha = 0.3;
		this._dialogStarSprite3.alpha = 0.3;
	}

	this._scoreValue.text = score;

	this._game.getStage().addChild(this._stretchingContainer);
	this._game.getStage().addChild(this._scalingContainer);
};

EndGameDialog.prototype._resize = function ()
{
	if (!this._game.hasFrameWrapper())
	{
		var gameContainerWidth = document.getElementById("game").offsetWidth;
		var gameContainerHeight= document.getElementById("game").offsetHeight;
					     
		// scale the _stretchingContainer to fill the game container
		this._stretchingContainer.scale.x = gameContainerWidth / GameConstants.GAME_WIDTH;
		this._stretchingContainer.scale.y = gameContainerHeight / GameConstants.GAME_HEIGHT;
		
		// scale the _scalingContainer proportionally
		// Determine which screen dimension is most constrained
		var ratio = Math.min(gameContainerWidth / GameConstants.GAME_WIDTH,
						     gameContainerHeight / GameConstants.GAME_HEIGHT);
		this._scalingContainer.scale.x = this._scalingContainer.scale.y = ratio;
		
		// position the _scalingContainer
		this._scalingContainer.x = (gameContainerWidth - (GameConstants.GAME_WIDTH * ratio)) * 0.5;
		this._scalingContainer.y = 0; // always position a the top of the screen
	}
};
