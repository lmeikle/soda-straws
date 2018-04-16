/**
 * Tile
 * @constructor
 */
function Tile(game, container, board, row, col, tileIndex, animate, delay)
{
	this._game = game;
	this._container = container;
	this._board = board;
	this._row = row; // row position
	this._col = col; // column position
	this._tileIndex = tileIndex;

	this._angle = 0;
	this._pipeSides = GameConstants.TILE_CONFIG[this._tileIndex].sides.concat();
	this._inletConnected = false;
	this._outletConnected = false;
	this._tileExplosion = null;

	this._inletConnectedFill = null;
	this._outletConnectedFill = null;

	// add the tile image to the stage
	this._createTileImage(animate, delay);
}

Tile.prototype.destroy = function ()
{
	this._sprite.off('mousedown', this._handleClick.bind(this));
	this._sprite.off('touchstart', this._handleClick.bind(this));

	if (this._tileExplosion)
	{
		this._tileExplosion.destroy();
		this._tileExplosion = null;
	}

	if (this._sprite && this._sprite.parent)
	{
		this._sprite.parent.removeChild(this._sprite);
		this._sprite = null;
	}
};

Tile.prototype._createTileImage = function (animate, delay)
{
	var resources = this._game.getPreloaderResources();

	// container sprite for all display objects that make up the tile
	// this is the sprite which gets moved and rotated
	this._sprite = new PIXI.Sprite();

	// straws are white, until they are connected to an inlet/outlet
	this._emptyFill = new PIXI.Sprite(resources[GameConstants.TILE_CONFIG[this._tileIndex].imageName + "_empty"].texture);
	this._sprite.addChild(this._emptyFill);
	
	// the fill that will be shown, when a till is connected to an inlet
	this._inletConnectedFill = new PIXI.Sprite(resources[GameConstants.TILE_CONFIG[this._tileIndex].imageName + "_inlet_connected"].texture);
	this._inletConnectedFill.visible = false; // hidden until the tile is marked as connected to an inlet
	this._sprite.addChild(this._inletConnectedFill);
	
	// the fill that will be shown, when a till is connected to an outlet
	this._outletConnectedFill = new PIXI.Sprite(resources[GameConstants.TILE_CONFIG[this._tileIndex].imageName + "_outlet_connected"].texture);
	this._outletConnectedFill.visible = false; // hidden until the tile is marked as connected to an inlet
	this._sprite.addChild(this._outletConnectedFill);
	
	// the actual tile image
	var imageName = GameConstants.TILE_CONFIG[this._tileIndex].imageName;
	var tileSprite = new PIXI.Sprite(resources[imageName].texture);

	this._sprite.addChild(tileSprite);

	// center the sprites pivot point
	this._sprite.pivot.x = GameConstants.TILE_SIZE / 2;
	this._sprite.pivot.y = GameConstants.TILE_SIZE / 2;

	// randomly rotate the tile
	var randomAngleValues = [0, 90, 180, 270];
	var randomIndex = Math.floor(Math.random() * 4); // start at 0, 4 is the number of possible results
	this._angle = randomAngleValues[randomIndex];
	this._sprite.rotation = PIXI.DEG_TO_RAD * this._angle;

	// rotate the pipeSides array
	for (var i = 0; i < randomIndex; i++)
	{
		var lastVal = this._pipeSides.pop();
		this._pipeSides.splice(0, 0, lastVal);
	}

	this._sprite.x = this._calcXPosition(this._col);

	if (animate)
	{
		// position tile off the board first
		this._sprite.y = this._calcYPosition(-(GameConstants.BOARD_ROWS - this._row));

		var moveToY = this._calcYPosition(this._row);

		TweenLite.to(this._sprite, GameConstants.TILE_MOVE_DURATION / 1000, {y: moveToY, ease: Strong.easeOut, delay: 0});
	}
	else
	{
		this._sprite.y = this._calcYPosition(this._row);
	}

	this._container.addChild(this._sprite);

	//enable input actions on this image
	this._sprite.interactive = true;
	this._sprite.buttonMode = true;
	this._sprite.on('mousedown', this._handleClick.bind(this));
	this._sprite.on('touchstart', this._handleClick.bind(this));
};

/**
 * When a tile is clicked, rotate the tile, and re-evaluate
 * @private
 */
Tile.prototype._handleClick = function ()
{
	this._rotate();

	this._board.evaluateTiles();
};

/**
 * Rotate the tile
 * @private
 */
Tile.prototype._rotate = function ()
{
	// rotate the image - always clockwise
	this._angle += 90;
	if (this._angle >= 360) this._angle = 0;

	// rotation is in radians
	TweenLite.to(this._sprite, GameConstants.TILE_ROTATE_DURATION / 1000, {rotation: PIXI.DEG_TO_RAD * this._angle});

	// rotate the pipeSides array
	var lastVal = this._pipeSides.pop();
	this._pipeSides.splice(0, 0, lastVal);
};

/**
 * Move the tile to the new position
 * @param row
 * @param col
 */
Tile.prototype.move = function (row, col)
{
	this._row = row; // row position
	this._col = col; // column position

	var y = this._calcYPosition(this._row);
	TweenLite.to(this._sprite, GameConstants.TILE_MOVE_DURATION / 1000, {y: y, ease: Strong.easeOut});
};

/**
 * Play the tile explosion
 * After a certain time remove the tile, and explosion
 */
Tile.prototype.explode = function ()
{
	this._sprite.off('mousedown', this._handleClick.bind(this));
	this._sprite.off('touchstart', this._handleClick.bind(this));

	this._tileExplosion = new TileExplosion(this._sprite, this._game);

	// increment points
	this._board.incrementPoints(GameConstants.TILE_CONFIG[this._tileIndex].points);
};

Tile.prototype.getRow = function ()
{
	return this._row;
};

Tile.prototype.getCol = function ()
{
	return this._col;
};

Tile.prototype.isCompletePath = function ()
{
	return this._inletConnected && this._outletConnected;
};

Tile.prototype.setInletConnected = function (boo)
{
	this._inletConnected = boo;

	this._inletConnectedFill.visible = this._inletConnected;

	if (this._inletConnected)
	{
		this._outletConnectedFill.visible = false;
	}
};

Tile.prototype.isInletConnected = function ()
{
	return this._inletConnected;
};

Tile.prototype.setOutletConnected = function (boo)
{
	this._outletConnected = boo;

	// inlet colour takes priority
	if (!this._inletConnected)
	{
		this._outletConnectedFill.visible = this._outletConnected;
	}
};

Tile.prototype.isOutletConnected = function ()
{
	return this._outletConnected;
};

Tile.prototype.hasEdgeConnected = function (i)
{
	return this._pipeSides[i] === 1
};

/**
 * Calculate the x position of the tile
 * @param col
 * @returns {number}
 * @private
 */
Tile.prototype._calcXPosition = function (col)
{
	return (col * GameConstants.TILE_SIZE) + GameConstants.TILE_X_OFFSET + (GameConstants.TILE_SIZE / 2);
};

/**
 * Calculate the y position of the tile
 * @param row
 * @returns {number}
 * @private
 */
Tile.prototype._calcYPosition = function (row)
{
	return (row * GameConstants.TILE_SIZE) + GameConstants.TILE_Y_OFFSET + (GameConstants.TILE_SIZE / 2);
};

Tile.prototype.toString = function ()
{
	return "Tile: " + this._row + " - " + this._col;
};
