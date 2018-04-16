/**
 * Board
 */
function Board(game)
{
	this._game = game;

	this._inlets = [];
	this._outlets = [];
	this._boardSprite = null;
	this._tiles = [];
	this._completedPathsCounter = 0;

	//http://www.javascriptkit.com/javatutors/weighrandom2.shtml
	this._weightedTiles = [];
	for (var i = 0; i < GameConstants.TILE_CONFIG.length; i++)
	{
		var weighting = GameConstants.TILE_CONFIG[i].weighting;
		for (var j = 0; j < weighting; j++)
		{
			this._weightedTiles[this._weightedTiles.length] = i;
		}
	}

	// create the view
	this._createView();

	this._populateBoard();
	this.evaluateTiles();
}

Board.prototype._createView = function ()
{
	// create inlets
	this._inlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'inlet1', 208, 43, -1));
	this._inlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'inlet2', 193, 102, -1));
	this._inlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'inlet3', 300, 150, -1));
	this._inlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'inlet3', 347, 150, 1));
	this._inlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'inlet2', 453, 102, 1));
	this._inlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'inlet1', 435, 43, 1));

	// create fuel vessel
	this._fuelVessel = new FuelVessel(this._game, this._game.getScalingContainer(), GameConstants.NUM_PATHS_REQUIRED);

	this._points = new Points(this._game, this._game.getScalingContainer());

	this._timer = new Timer(this._game, this._game.getScalingContainer(), this);

	// create board background
	this._boardSprite = new PIXI.Sprite(this._game.getPreloaderResources().board.texture);
	//this._boardSprite.cacheAsBitmap = true; // breaks it for some reason
	this._boardSprite.x = 19;
	this._boardSprite.y = 242;
	this._game.getScalingContainer().addChild(this._boardSprite);

	var boardMaskFill = new PIXI.Graphics();
	boardMaskFill.beginFill(0xFFFF00);
	boardMaskFill.drawRect(0, 0, 608, 609);
	boardMaskFill.endFill();
	this._boardSprite.addChild(boardMaskFill);
	this._boardSprite.mask = boardMaskFill;

	this._monster = new Monster(this._game, this._game.getScalingContainer());

	// create outlets (as they overlap the last 3 are created and then pushed on the array)
	this._outlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'outlet1', 209, 843, -1)); // outlet 1
	this._outlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'outlet1', 307, 843, -1)); // outlet 2
	this._outlets.push(new InletOutlet(this._game, this._game.getScalingContainer(), 'outlet2', 288, 850, -1)); // outlet 3
	var outlet6 = new InletOutlet(this._game, this._game.getScalingContainer(), 'outlet1', 433, 843, 1);
	var outlet5 = new InletOutlet(this._game, this._game.getScalingContainer(), 'outlet1', 338, 843, 1);
	var outlet4 = new InletOutlet(this._game, this._game.getScalingContainer(), 'outlet2', 356, 850, 1);
	this._outlets.push(outlet4);
	this._outlets.push(outlet5);
	this._outlets.push(outlet6);

	this._mainOutlet = new InletOutlet(this._game, this._game.getScalingContainer(), 'outletMain', 310, 850, 1);

	// create Restart button
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
	
	this._restartButtonSprite = new PIXI.Sprite(this._game.getPreloaderResources().dialogButton.texture);
	this._restartButtonSprite.x = 435;
	this._restartButtonSprite.y = 10;
	this._restartButtonSprite.width = 190;
	this._restartButtonSprite.interactive = true;
	this._restartButtonSprite.buttonMode = true;
	this._restartButtonSprite.on('mouseup', this.forceRestart.bind(this));
	this._restartButtonSprite.on('touchend', this.forceRestart.bind(this));
	this._game.getScalingContainer().addChild(this._restartButtonSprite);

	var restartText = new PIXI.Text('', textOptions);
	restartText.x = 100;
	restartText.y = 44;
	restartText.anchor.x = 0.5;
	restartText.anchor.y = 0.5;
	restartText.text = 'Restart';
	this._restartButtonSprite.addChild(restartText);
	
	this._endGameDialog = new EndGameDialog(this._game, this._game.getScalingContainer(), this);
};

Board.prototype._populateBoard = function ()
{
	// populate the board
	this._tiles = [];
	for (var r = 0; r < GameConstants.BOARD_ROWS; r++)
	{
		this._tiles[r] = [];
		for (var c = 0; c < GameConstants.BOARD_COLUMNS; c++)
		{
			this._tiles[r][c] = this._createTile(r, c, false, 0);
		}
	}
};

Board.prototype.startGame =function()
{
	this._timer.startTimer(GameConstants.TIME_ALLOWED);
};

Board.prototype.restartGame =function()
{
	this._fuelVessel.reset();
	this._points.reset();
	this._endGameDialog.reset();
	this._completedPathsCounter = 0;

	this._populateBoard();
	this.evaluateTiles();

	this._timer.startTimer(GameConstants.TIME_ALLOWED);
};

Board.prototype._createTile = function (row, col, animate, delay)
{
	// create random tile
	var randomNumber = Math.floor(Math.random() * 100);
	var tileIndex = this._weightedTiles[randomNumber];

	if (DevConstants.USE_FIXED_RESULT) tileIndex = DevConstants.FIXED_RESULT_3[row][col];

	return new Tile(this._game, this._boardSprite, this, row, col, tileIndex, animate, delay);
};

Board.prototype.evaluateTiles = function ()
{
	BoardHelper.markTiles(this._tiles);

	var i, tile;

	// see if we have any complete paths for removal
	var completePaths = false;
	var lastRow = this._tiles[this._tiles.length - 1];
	for (i = 0; i < lastRow.length; i++)
	{
		tile = lastRow[i];
		if (tile.isCompletePath())
		{
			completePaths = true;
		}
	}

	if (completePaths)
	{
		// animate water from any inlets that are part of complete paths
		var firstRow = this._tiles[0];
		for (i = 0; i < GameConstants.INLET_SOURCES.length; i++)
		{
			if (GameConstants.INLET_SOURCES[i])
			{
				tile = firstRow[i];
				if (tile.isCompletePath())
				{
					this._inlets[i].animate();
					this._completedPathsCounter++; // TODO is a path counted based on inlets?
				}
			}
		}

		this._fuelVessel.animate(this._completedPathsCounter);

		setTimeout(function ()
				   {
					   // animate water flowing out of outlets into the monster
					   var lastRow = this._tiles[this._tiles.length - 1];
					   for (i = 0; i < GameConstants.OUTLET_SOURCES.length; i++)
					   {
						   if (GameConstants.OUTLET_SOURCES[i])
						   {
							   tile = lastRow[i];
							   if (tile.isCompletePath())
							   {
								   this._outlets[i].animate();
							   }

							   this._mainOutlet.animate();
							   this._monster.playDrinkingMonster();
						   }
					   }

					   // remove all tiles that form a complete path
					   this._removeCompleteTiles();

					   if (this._isGameCompleted())
					   {
						   setTimeout(function ()
							  {
								  this.showEndGameDialog();
							  }.bind(this), GameConstants.REPOPULATE_DELAY);
					   }
					   else
					   {
						   setTimeout(function ()
									  {
										  this._resetInletsOutlets();

										  // make tiles fall down, and new ones fall in
										  this._repopulate();
									  }.bind(this), GameConstants.REPOPULATE_DELAY);

						   setTimeout(function ()
									  {
										  this.evaluateTiles();
									  }.bind(this), GameConstants.REEVALUATE_DELAY);
					   }
				   }.bind(this), GameConstants.INLET_FILL_DURATION);
	}
};

Board.prototype._removeCompleteTiles = function ()
{
	for (var x = 0; x < this._tiles.length; x++)
	{
		for (var y = 0; y < this._tiles[x].length; y++)
		{
			if (this._tiles[x][y].isCompletePath())
			{
				this._tiles[x][y].explode();
				this._tiles[x][y] = null;
			}
		}
	}
};

Board.prototype._resetInletsOutlets = function ()
{
	var i;

	// reset inlets
	for (i = 0; i < this._inlets.length; i++)
	{
		this._inlets[i].reset();
	}

	// reset outlets
	for (i = 0; i < this._outlets.length; i++)
	{
		this._outlets[i].reset();
	}

	this._mainOutlet.reset();
};

Board.prototype._repopulate = function ()
{
	var i, x, y, thisTile;

	// make tiles fall down, start from the second bottom row and work upwards
	for (x = this._tiles.length - 2; x >= 0; x--)
	{
		for (y = 0; y < this._tiles[x].length; y++)
		{
			thisTile = this._tiles[x][y];
			if (thisTile) // work out where this tile can fall too
			{
				var belowRow = x;
				var spaceRow = null;
				while (belowRow < this._tiles.length - 1)
				{
					belowRow += 1;
					var tileBelow = this._tiles[belowRow][y];
					if (!tileBelow)
					{
						spaceRow = belowRow;
					}
				}

				if (spaceRow)
				{
					this._tiles[x][y].move(spaceRow, y);
					this._tiles[spaceRow][y] = this._tiles[x][y];
					this._tiles[x][y] = null;
				}
			}
		}
	}

	// new tiles fall in
	for (y = 0; y < this._tiles[0].length; y++)
	{
		for (x = this._tiles.length - 1; x >= 0; x--)
		{
			thisTile = this._tiles[x][y];
			if (!thisTile) // fall in a new tile
			{
				this._tiles[x][y] = this._createTile(x, y, true, 0);
			}
		}
	}
};

Board.prototype.incrementPoints = function (inc)
{
	this._points.incrementPoints(inc);
};

Board.prototype._isGameCompleted = function ()
{
	return this._completedPathsCounter >= GameConstants.NUM_PATHS_REQUIRED;
};

Board.prototype._clearBoard = function ()
{
	for (var x = 0; x < this._tiles.length; x++)
	{
		for (var y = 0; y < this._tiles[x].length; y++)
		{
			if (this._tiles[x] && this._tiles[x][y])
			{
				this._tiles[x][y].destroy();
			}
		}
	}
};

Board.prototype.showEndGameDialog = function ()
{
	this._clearBoard();
	this._resetInletsOutlets();
	this._timer.stopTimer();

	this._endGameDialog.showDialog(this._isGameCompleted(), this._points.getPoints());
};

Board.prototype.forceRestart = function ()
{
	this._clearBoard();
	this._resetInletsOutlets();
	this._timer.stopTimer();
	
	this.restartGame();
};

