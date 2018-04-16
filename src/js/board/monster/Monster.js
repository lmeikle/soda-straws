/**
 * Monster
 * @constructor
 */
function Monster(game, container)
{
	this._game = game;
	this._container = container;

	this._createView();
}

Monster.prototype._createView = function (e)
{
	this._createIdleMonster();
	this._createEatingMonster();
	this._createSodaDrop();
};

Monster.prototype._createIdleMonster = function ()
{
	var resources = this._game.getPreloaderResources();

	// create an array of textures from an image path
	var frames = [];
	for (var i = 1; i < 14; i++)
	{
		var val = i < 10 ? '0' + i : i;

		// magically works since the spritesheet was loaded with the pixi loader
		frames.push(PIXI.Texture.fromFrame('monster_idle00' + val + '.png'));
	}

	// create a MovieClip (brings back memories from the days of Flash, right ?)
	this._idleMonster = new PIXI.extras.MovieClip(frames);

	/*
	 * A MovieClip inherits all the properties of a PIXI sprite
	 * so you can change its position, its anchor, mask it, etc
	 */
	this._idleMonster.x = 205;
	this._idleMonster.y = 865;

	this._idleMonster.scale.x = 0.9;
	this._idleMonster.scale.y = 0.9;

	this._idleMonster.animationSpeed = 0.3;

	this._idleMonster.play();

	this._container.addChild(this._idleMonster);
};

Monster.prototype._createEatingMonster = function ()
{
	// create an array of textures from an image path
	var frames = [];
	for (var i = 1; i < 37; i++)
	{
		var val = i < 10 ? '0' + i : i;

		frames.push(PIXI.Texture.fromFrame('monster_eating00' + val + '.png'));
	}

	this._eatingMonster = new PIXI.extras.MovieClip(frames);

	this._eatingMonster.x = 205;
	this._eatingMonster.y = 865;

	this._eatingMonster.scale.x = 0.9;
	this._eatingMonster.scale.y = 0.9;

	this._eatingMonster.animationSpeed = 0.6;
	this._eatingMonster.visible = false;
	this._eatingMonster.loop = false;
	this._eatingMonster.onComplete = function() { this.playIdleMonster(); }.bind(this);

	this._container.addChild(this._eatingMonster);
};

Monster.prototype._createSodaDrop = function ()
{
	// create an array of textures from an image path
	var frames = [];
	for (var i = 0; i <= 7; i++)
	{
		frames.push(PIXI.Texture.fromFrame('soda_drop' + i + '.png'));
	}

	this._sodaDrop = new PIXI.extras.MovieClip(frames);

	this._sodaDrop.x = 100;
	this._sodaDrop.y = -50;

	this._sodaDrop.scale.x = this._sodaDrop.scale.y = 2.5;

	this._sodaDrop.animationSpeed = 0.3;
	this._sodaDrop.visible = false;
	this._sodaDrop.loop = false;

	this._eatingMonster.addChild(this._sodaDrop);
};

Monster.prototype.playDrinkingMonster = function ()
{
	this._idleMonster.visible = false;

	this._eatingMonster.visible = true;
	this._eatingMonster.gotoAndPlay(1);

	setTimeout(function () {
		this._sodaDrop.visible = true;
		this._sodaDrop.gotoAndPlay(1);
	}.bind(this), 200)

};

Monster.prototype.playIdleMonster = function ()
{
	this._idleMonster.visible = true;

	this._eatingMonster.visible = false;
	this._eatingMonster.gotoAndStop(1);

	this._sodaDrop.visible = false;
	this._sodaDrop.gotoAndStop(1);
};

