/**
 * TileExplosion
 *
 * Plays a tile explosion
 * After a certain time removes the tile, and explosion
 */
function TileExplosion(sprite, game)
{
	this._sprite = sprite;
	this._game = game;

	// createExplosion
	this._createExplosion();

	// after x amount of time, remove the tile
	this._removeTileTimerID = setTimeout(function ()
										 {
											 this._sprite.parent.removeChild(this._sprite);
										 }.bind(this), GameConstants.EXPLOSION_REMOVE_TILE_DELAY);
}

TileExplosion.prototype.destroy = function ()
{
	this._explosion.stop();

	clearTimeout(this._removeTileTimerID);
};

TileExplosion.prototype._createExplosion = function ()
{
	// create an array of textures from an image path
	var frames = [];
	for (var i = 1; i < 9; i++)
	{
		var val = i < 10 ? '0' + i : i;

		// magically works since the spritesheet was loaded with the pixi loader
		frames.push(PIXI.Texture.fromFrame('explosion00' + val + '.png'));
	}

	// create a MovieClip (brings back memories from the days of Flash, right ?)
	this._explosion = new PIXI.extras.MovieClip(frames);

	/*
	 * A MovieClip inherits all the properties of a PIXI sprite
	 * so you can change its position, its anchor, mask it, etc
	 */
	this._explosion.x = 45;
	this._explosion.y = 45;
	this._explosion.anchor.x = 0.5;
	this._explosion.anchor.y = 0.5;
	this._explosion.scale.x = 4;
	this._explosion.scale.y = 4;
	this._explosion.animationSpeed = 0.2;
	this._explosion.loop = false;
	this._explosion.play();
	this._sprite.addChild(this._explosion);
};
