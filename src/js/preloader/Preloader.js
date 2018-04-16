/**
 * Preloader
 * @constructor
 */
function Preloader(completeCallback)
{
	this._completeCallback = completeCallback;

	this._assetsLoaded = false;
	this._fontsLoaded = false;

	this._loader = new PIXI.loaders.Loader("assets", 5);

	this._addAssets();

	this._loader.on('progress', function (loader, resources) {
		this._onProgress(loader, resources);
	}.bind(this));

	this._loader.on('complete', function (loader, resources) {
		this._onComplete(loader, resources);
	}.bind(this));

	this._loadingPercentageEl = document.getElementById("loadingPercentage");

	this._loader.load();

	// load any fonts as well
	WebFont.load({
		 google: {families: ['Lobster']},
		 active: function() {
			 this._onFontsComplete();
		 }.bind(this)
	 });
}

Preloader.prototype._addAssets = function ()
{
	this._loader.add('playScreen', "/playscreen/playScreen.png");
	this._loader.add('playScreenLogo', "/playscreen/playScreenLogo.png");
	this._loader.add('playButton', "/playscreen/playButton.png");

	this._loader.add('background', "/background.png");

	// board and tiles
	this._loader.add('board', "/board.png");
	this._loader.add('tile0', "/tiles/tile0.png");
	this._loader.add('tile0_empty', "/tiles/tile0_empty.png");
	this._loader.add('tile0_inlet_connected', "/tiles/tile0_inlet_connected.png");
	this._loader.add('tile0_outlet_connected', "/tiles/tile0_outlet_connected.png");
	this._loader.add('tile1', "/tiles/tile1.png");
	this._loader.add('tile1_empty', "/tiles/tile1_empty.png");
	this._loader.add('tile1_inlet_connected', "/tiles/tile1_inlet_connected.png");
	this._loader.add('tile1_outlet_connected', "/tiles/tile1_outlet_connected.png");
	this._loader.add('tile2', "/tiles/tile2.png");
	this._loader.add('tile2_empty', "/tiles/tile2_empty.png");
	this._loader.add('tile2_inlet_connected', "/tiles/tile2_inlet_connected.png");
	this._loader.add('tile2_outlet_connected', "/tiles/tile2_outlet_connected.png");
	this._loader.add('tile3', "/tiles/tile3.png");
	this._loader.add('tile3_empty', "/tiles/tile3_empty.png");
	this._loader.add('tile3_inlet_connected', "/tiles/tile3_inlet_connected.png");
	this._loader.add('tile3_outlet_connected', "/tiles/tile3_outlet_connected.png");
	this._loader.add('tile4', "/tiles/tile4.png");
	this._loader.add('tile4_empty', "/tiles/tile4_empty.png");
	this._loader.add('tile4_inlet_connected', "/tiles/tile4_inlet_connected.png");
	this._loader.add('tile4_outlet_connected', "/tiles/tile4_outlet_connected.png");

	// points
	this._loader.add('pointsBoard', "/pointsBoard.png");

	// timer
	this._loader.add('timerBackground', "/timer/timerBackground.png");
	this._loader.add('timerFill', "/timer/timerFill.png");
	this._loader.add('timerDivider', "/timer/divider.png");
	this._loader.add('timerStar', "/timer/star.png");

	// fuel
	this._loader.add('fuel', '/fuelvessel/fuel.json');
	this._loader.add('fuelVesselEmpty', "/fuelvessel/fuelVesselEmpty.png");
	this._loader.add('fuelMeter', "/fuelvessel/fuelMeter.png");
	this._loader.add('fuelPointer', "/fuelvessel/fuelPointer.png");

	// inlets/outlets
	this._loader.add('inlet1', "/inlets/inlet1.png");
	this._loader.add('inlet1Mask', "/inlets/inlet1Mask.png");
	this._loader.add('inlet2', "/inlets/inlet2.png");
	this._loader.add('inlet2Mask', "/inlets/inlet2Mask.png");
	this._loader.add('inlet3', "/inlets/inlet3.png");
	this._loader.add('inlet3Mask', "/inlets/inlet3Mask.png");
	this._loader.add('outlet1', "/outlets/outlet1.png");
	this._loader.add('outlet1Mask', "/outlets/outlet1Mask.png");
	this._loader.add('outlet2', "/outlets/outlet2.png");
	this._loader.add('outlet2Mask', "/outlets/outlet2Mask.png");
	this._loader.add('outletMain', "/outlets/outletMain.png");
	this._loader.add('outletMainMask', "/outlets/outletMainMask.png");

	// explosion
	this._loader.add('explosion', '/explosion/explosion.json');

	// monster
	this._loader.add('monster', '/monster/monster.json');
	this._loader.add('monster_eating', '/monster/monster_eating.json');
	this._loader.add('soda_drop', '/monster/soda_drop.json');

	// end game dialog
	this._loader.add('dialogBackground', "/dialog/dialogBackground.png");
	this._loader.add('dialogStar', "/dialog/dialogStar.png");
	this._loader.add('dialogScore', "/dialog/dialogScore.png");
	this._loader.add('dialogButton', "/dialog/dialogButton.png");
};

Preloader.prototype._onProgress = function (loader, resources)
{
	var percent = Math.floor(loader.progress);
	if (percent > 100) percent = 100;
	
	this._loadingPercentageEl.textContent = percent + '%';
};

Preloader.prototype._onComplete = function (loader, resources)
{
	this._assetsLoaded = true;

	this._resources = resources;

	this._preloaderComplete();
};

Preloader.prototype._onFontsComplete = function ()
{
	this._fontsLoaded = true;

	this._preloaderComplete();
};

Preloader.prototype._preloaderComplete = function ()
{
	if (this._assetsLoaded && this._fontsLoaded)
	{
		this._loadingPercentageEl.textContent = '100%';
		
		this._completeCallback();
	}
};

Preloader.prototype.getResources = function ()
{
	return this._resources;
};




