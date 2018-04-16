/**
 * TileParticleExplosion
 * A pixi particles explosion
 *
 * Plays a tile explosion
 * After a certain time removes the tile, and explosion
 */
function TileParticleExplosion(sprite, game)
{
	this._sprite = sprite;
	this._game = game;

	this._emitter = null;
	this._elapsed = null;
	this._requestAnimationFrameID = null;

	// createExplosion
	this._createExplosion();

	// after x amount of time, remove the tile
	this._removeTileTimerID = setTimeout(function ()
										 {
											 this._sprite.parent.removeChild(this._sprite);
										 }.bind(this), GameConstants.EXPLOSION_REMOVE_TILE_DELAY);

	// after x amount of time, stop the explosion
	this._destroyTimerID = setTimeout(function ()
									  {
										  this.destroy();
									  }.bind(this), GameConstants.EXPLOSION_DURATION);
}

TileParticleExplosion.prototype.destroy = function ()
{
	clearTimeout(this._removeTileTimerID);
	clearTimeout(this._destroyTimerID);
	cancelAnimationFrame(this._requestAnimationFrameID);

	if (this._emitter)
	{
		this._emitter.destroy();
		this._emitter = null;

		var stage = this._game.getStage();
		var renderer = this._game.getRenderer();

		//reset SpriteRenderer's batching to fully release particles for GC
		if (renderer.plugins && renderer.plugins.sprite && renderer.plugins.sprite.sprites)
			renderer.plugins.sprite.sprites.length = 0;

		renderer.render(stage);
	}
};

TileParticleExplosion.prototype._createExplosion = function ()
{
	var config = {
		"alpha": {
			"start": 0.2,
			"end": 0.1
		},
		"scale": {
			"start": 1,
			"end": 0.3
		},
		"color": {
			"start": "DC004F",
			"end": "DC004F"
		},
		"speed": {
			"start": 200,
			"end": 100
		},
		"startRotation": {
			"min": 0,
			"max": 360
		},
		"rotationSpeed": {
			"min": 0,
			"max": 0
		},
		"lifetime": {
			"min": 0.5,
			"max": 0.5
		},
		"frequency": 0.008,
		"emitterLifetime": 0.31,
		"maxParticles": 1000,
		"pos": {
			"x": 0,
			"y": 0
		},
		"addAtBack": false,
		"spawnType": "circle",
		"spawnCircle": {
			"x": 0,
			"y": 0,
			"r": 10
		}
	};

	var emitterContainer = new PIXI.Container();
	emitterContainer.x = 45;
	emitterContainer.y = 45;
	this._sprite.addChild(emitterContainer);

	this._emitter = new PIXI.particles.Emitter(
			emitterContainer,
			PIXI.Texture.fromImage("assets/particle.png"), // TODO use preloader if this explosion is used
			config
	);

	this._emitter.emit = true;

	this._elapsed = Date.now();
	this._requestAnimationFrameID = requestAnimationFrame(animate.bind(this));
	function animate()
	{
		this._requestAnimationFrameID = requestAnimationFrame(animate.bind(this));

		var now = Date.now();

		this._emitter.update((now - this._elapsed) * 0.001);
		this._elapsed = now;
	}
};
