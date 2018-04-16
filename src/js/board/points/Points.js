/**
 * Points
 * @constructor
 */
function Points(game, container)
{
	this._game = game;
	this._container = container;
	this._totalPoints = 0;

	this._createView();
}

Points.prototype.reset = function ()
{
	this._totalPoints = 0;

	this._pointsValue.text = this._totalPoints;
};

Points.prototype.incrementPoints = function (inc)
{
	this._totalPoints += inc;

	this._pointsValue.text = this._totalPoints;
};

Points.prototype.getPoints = function ()
{
	return this._totalPoints;
};

Points.prototype._createView = function ()
{
	var resources = this._game.getPreloaderResources();

	var container = new PIXI.Sprite();
	container.x = -45;
	container.y = -10;
	this._container.addChild(container);

	var backgroundSprite = new PIXI.Sprite(resources.pointsBoard.texture);
	backgroundSprite.cacheAsBitmap = true;
	container.addChild(backgroundSprite);

	var textOptions = {
	    font: 'normal 40px Lobster', // Set style, size and font
	    fill: '#ffffff', // Set fill color to blue
	    align: 'center', // Center align the text, since it's multiline
	    //stroke: '#ffffff', // Set stroke color to a dark blue-gray color
	    //strokeThickness: 20, // Set stroke thickness to 20
	    //lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
		dropShadow: true,
		dropShadowColor: '#cccccc',
		dropShadowAngle: Math.PI/4,
		dropShadowDistance: 3
	};

	this._pointsLabel = new PIXI.Text('', textOptions);
	this._pointsLabel.x = 165;
	this._pointsLabel.y = 21;
	this._pointsLabel.anchor.x = 0.5;
	this._pointsLabel.text = 'Score:';
	container.addChild(this._pointsLabel);

	this._pointsValue = new PIXI.Text('', textOptions);
	this._pointsValue.x = 165;
	this._pointsValue.y = 57;
	this._pointsValue.anchor.x = 0.5;
	this._pointsValue.text = '0';
	container.addChild(this._pointsValue);
};
