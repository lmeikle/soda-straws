/**
 * Timer
 * @constructor
 */
function Timer(game, container, board)
{
	this._game = game;
	this._container = container;
	this._board = board;

	this._createView();
}

Timer.prototype.startTimer = function (duration)
{
	this._endDuration = duration;
	this._currentDuraton = 0;

	this._mask.x = 0;

	clearInterval(this._timerID);
	this._timerID = setInterval(function() {
		this._updateTime()
	}.bind(this), 1000);
};

Timer.prototype._updateTime = function ()
{
	this._currentDuraton += 1000;

	this._mask.x = -(190 * (this._currentDuraton / this._endDuration));

	if (this._currentDuraton >= this._endDuration)
	{
		clearInterval(this._timerID);

		this._board.showEndGameDialog();
	}
};

Timer.prototype.stopTimer = function ()
{
	clearInterval(this._timerID);
};

Timer.prototype._createView = function ()
{
	var resources = this._game.getPreloaderResources();

	// TODO background needs exporting properly, no gaps
	// TODO full fill needs exporting, not just part of it
	// TODO what do stars do
	// TODO any animations

	var container = new PIXI.Sprite();
	container.x = -20;
	container.y = 150;
	this._container.addChild(container);

	var backgroundSprite = new PIXI.Sprite(resources.timerBackground.texture);
	backgroundSprite.cacheAsBitmap = true;
	container.addChild(backgroundSprite);

	this._mask = new PIXI.Graphics();
	this._mask.beginFill(0xffffff);
	this._mask.drawRect(48, 15, 190, 49);
	this._mask.endFill();
	container.addChild(this._mask);

	var timerFillSprite = new PIXI.Sprite(resources.timerFill.texture);
	timerFillSprite.x = 48;
	timerFillSprite.y = 15;
	timerFillSprite.width = 190;
	timerFillSprite.height = 49;
	container.addChild(timerFillSprite);
	timerFillSprite.mask = this._mask;

	var dividerSprite = new PIXI.Sprite(resources.timerDivider.texture);
	dividerSprite.x = 110;
	dividerSprite.y = 18;
	container.addChild(dividerSprite);

	var dividerSprite2 = new PIXI.Sprite(resources.timerDivider.texture);
	dividerSprite2.x = 175;
	dividerSprite2.y = 18;
	container.addChild(dividerSprite2);

	var starSprite = new PIXI.Sprite(resources.timerStar.texture);
	starSprite.x = 93;
	starSprite.y = 50;
	container.addChild(starSprite);

	var starSprite2 = new PIXI.Sprite(resources.timerStar.texture);
	starSprite2.x = 158;
	starSprite2.y = 50;
	container.addChild(starSprite2);

	var starSprite3 = new PIXI.Sprite(resources.timerStar.texture);
	starSprite3.x = 220;
	starSprite3.y = 50;
	container.addChild(starSprite3);
};
