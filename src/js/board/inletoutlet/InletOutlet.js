/**
 * InletOutlet
 * @constructor
 */
function InletOutlet(game, container, imageName, x, y, scale)
{
	this._game = game;
	this._fill = null;

	this._createView(container, imageName, x, y, scale);
}

InletOutlet.prototype._createView = function (container, imageName, x, y, scale)
{
	var resources = this._game.getPreloaderResources();

	var inletOutletContainer = new PIXI.Sprite();
	inletOutletContainer.x = x;
	inletOutletContainer.y = y;
	inletOutletContainer.scale.x = scale;
	container.addChild(inletOutletContainer);

	this._fill = new PIXI.Graphics();
	this._fill.beginFill(GameConstants.TILE_INLET_CONNECTED_FILL_COLOUR);
	this._fill.drawRect(0, 0, 146, 1);  // height needs to be 1 to start with or doesnt work
	this._fill.endFill();
	inletOutletContainer.addChild(this._fill);

	var maskSprite = new PIXI.Sprite(resources[imageName + "Mask"].texture);
	inletOutletContainer.addChild(maskSprite);
	this._fill.mask = maskSprite;
	this._fill.height = 0;

	var inletOutletSprite = new PIXI.Sprite(resources[imageName].texture);
	inletOutletContainer.addChild(inletOutletSprite);
};

InletOutlet.prototype.animate = function ()
{
	TweenLite.to(this._fill, GameConstants.INLET_FILL_DURATION / 1000, {height: 202});
};

InletOutlet.prototype.reset = function ()
{
	this._fill.height = 0;
};

