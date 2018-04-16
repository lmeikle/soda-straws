/**
 * FuelVessel
 * @constructor
 */
function FuelVessel(game, container, numPathsRequired)
{
	this._game = game;
	this._container = container;
	this._numPathsRequired = numPathsRequired;

	this._createView();
}

FuelVessel.prototype.reset = function ()
{
	this._fuel.visible = true;
	this._fuel.gotoAndStop(1);
	this._fuelPointerSprite.rotation = PIXI.DEG_TO_RAD * 20;
};

FuelVessel.prototype._createView = function ()
{
	var resources = this._game.getPreloaderResources();

	var fuelVesselSprite = new PIXI.Sprite(resources.fuelVesselEmpty.texture);
	fuelVesselSprite.x = 170;
	fuelVesselSprite.y = -100; // TODO should be 0
	this._container.addChild(fuelVesselSprite);

	// create an array of textures from an image path
	var frames = [];
	for (var i = 1; i < 31; i++)
	{
		var val = i < 10 ? '0' + i : i;

		frames.push(PIXI.Texture.fromFrame('fuel00' + val + '.png'));
	}
	this._fuel = new PIXI.extras.MovieClip(frames);
	this._fuel.x = 16;
	this._fuel.y = 115;
	this._fuel.scale.x = 0.89;
	this._fuel.scale.y = 0.9;
	this._fuel.animationSpeed = 1;
	this._fuel.gotoAndStop(1);
	fuelVesselSprite.addChild(this._fuel);

	var fuelMeterSprite = new PIXI.Sprite(resources.fuelMeter.texture);
	fuelMeterSprite.x = 235;
	fuelMeterSprite.y = 25;
	this._container.addChild(fuelMeterSprite);

	this._fuelPointerSprite = new PIXI.Sprite(resources.fuelPointer.texture);
	this._fuelPointerSprite.x = 86;
	this._fuelPointerSprite.y = 110;
	// set the fuel pointer pivot point
	this._fuelPointerSprite.pivot.x = 8;
	this._fuelPointerSprite.pivot.y = 30;
	this._fuelPointerSprite.rotation = PIXI.DEG_TO_RAD * 20;
	fuelMeterSprite.addChild(this._fuelPointerSprite);
	// full = angle 20, empty = angle -110
};

FuelVessel.prototype.animate = function (numCompletedPaths)
{
	if (numCompletedPaths > this._numPathsRequired) numCompletedPaths = this._numPathsRequired;
	
	// move fuel pointer
	var range = 20 + 110;
	var angle = 20 - ((range / this._numPathsRequired) * numCompletedPaths);
	TweenLite.to(this._fuelPointerSprite, GameConstants.FUEL_POINTER_MOVE_DURATION / 1000, {rotation: PIXI.DEG_TO_RAD * angle});

	// make fuel go down
	// fuel movie has 30 frames
	var frame = ((29 / this._numPathsRequired) * numCompletedPaths);
	this._fuel.gotoAndStop(Math.ceil(frame));

	if (frame === 29)
	{
		this._fuel.visible = false;
	}
};
