function BoardHelper()
{
}

BoardHelper.markTiles = function (tiles)
{
	BoardHelper._markTilesInletConnected(tiles);
	BoardHelper._markTilesOutletConnected(tiles);
};

BoardHelper._markTilesInletConnected = function (tiles)
{
	//reset all inletConnected flags to false
	for (var x = 0; x < tiles.length; x++)
	{
		for (var y = 0; y < tiles[x].length; y++)
		{
			tiles[x][y].setInletConnected(false);
		}
	}

	//The basic process is this:
	//Keep track of tiles you've checked. This list starts empty.
	//Keep track of the next tiles to check. This list starts with just the fuel tile.
	//With each "next" tile:
	//Add it to the "checked" list.
	//Look at the four connected tiles (N, E, S, & W) to see if they're already in the "checked" list; ignore the ones that are.
	//If there are any connected tiles that haven't been checked yet, check to see if fuel will flow to them (pipes line up), and let if flow if it can.
	//Add all of the unchecked tiles to the "checked" list, if any.
	//Add all of the newly-fueled tiles to the "next" list, if any.
	//As long as there are tiles in the "next" list, go back to step 3. If the "next" list is empty, you're done.
	//If the rocket tile got fueled, *BOOM*!

	//Use a queue object to place the pipes that we are declaring as having water
	//but that we still need to check if they have any neighbors that will get water
	var tilesConnectedToInletToProcess = [];
	var tile;

	//seed the queue with pipes that connect to an inlet
	var firstRow = tiles[0];
	for (var i = 0; i < GameConstants.INLET_SOURCES.length; i++)
	{
		if (GameConstants.INLET_SOURCES[i])
		{
			tile = firstRow[i];
			if (tile.hasEdgeConnected(0))
			{
				tile.setInletConnected(true);
				tilesConnectedToInletToProcess.push(tile);
			}
		}
	}

	while (tilesConnectedToInletToProcess.length > 0)
	{
		tile = tilesConnectedToInletToProcess.pop();
		var r = tile.getRow();
		var c = tile.getCol();

		// check tile above
		if (r > 0)
		{
			var aboveTile = tiles[r - 1][c];
			if (!aboveTile.isInletConnected())
			{
				if (tile.hasEdgeConnected(0) && aboveTile.hasEdgeConnected(2))
				{
					aboveTile.setInletConnected(true);
					tilesConnectedToInletToProcess.push(aboveTile);
				}
			}
		}

		// check tile to right
		if (c < tiles[r].length - 1)
		{
			var rightTile = tiles[r][c + 1];
			if (!rightTile.isInletConnected())
			{
				if (tile.hasEdgeConnected(1) && rightTile.hasEdgeConnected(3))
				{
					rightTile.setInletConnected(true);
					tilesConnectedToInletToProcess.push(rightTile);
				}
			}
		}

		// check tile below
		if (r < tiles.length - 1)
		{
			var belowTile = tiles[r + 1][c];
			if (!belowTile.isInletConnected())
			{
				if (tile.hasEdgeConnected(2) && belowTile.hasEdgeConnected(0))
				{
					belowTile.setInletConnected(true);
					tilesConnectedToInletToProcess.push(belowTile);
				}
			}
		}

		// check tile to left
		if (c > 0)
		{
			var leftTile = tiles[r][c - 1];
			if (!leftTile.isInletConnected())
			{
				if (tile.hasEdgeConnected(3) && leftTile.hasEdgeConnected(1))
				{
					leftTile.setInletConnected(true);
					tilesConnectedToInletToProcess.push(leftTile);
				}
			}
		}
	}
};

BoardHelper._markTilesOutletConnected = function (tiles)
{
	//reset all outletConnected flags to false
	for (var x = 0; x < tiles.length; x++)
	{
		for (var y = 0; y < tiles[x].length; y++)
		{
			tiles[x][y].setOutletConnected(false);
		}
	}

	var tilesConnectedToOutletToProcess = [];
	var tile;

	//seed the queue with pipes that connect to a outlet
	var lastRow = tiles[tiles.length - 1];
	for (var i = 0; i < GameConstants.OUTLET_SOURCES.length; i++)
	{
		if (GameConstants.OUTLET_SOURCES[i])
		{
			tile = lastRow[i];
			if (tile.hasEdgeConnected(2))
			{
				tile.setOutletConnected(true);
				tilesConnectedToOutletToProcess.push(tile);
			}
		}
	}

	while (tilesConnectedToOutletToProcess.length > 0)
	{
		tile = tilesConnectedToOutletToProcess.pop();
		var r = tile.getRow();
		var c = tile.getCol();

		// check tile above
		if (r > 0)
		{
			var aboveTile = tiles[r - 1][c];
			if (!aboveTile.isOutletConnected())
			{
				if (tile.hasEdgeConnected(0) && aboveTile.hasEdgeConnected(2))
				{
					aboveTile.setOutletConnected(true);
					tilesConnectedToOutletToProcess.push(aboveTile);
				}
			}
		}

		// check tile to right
		if (c < tiles[r].length - 1)
		{
			var rightTile = tiles[r][c + 1];
			if (!rightTile.isOutletConnected())
			{
				if (tile.hasEdgeConnected(1) && rightTile.hasEdgeConnected(3))
				{
					rightTile.setOutletConnected(true);
					tilesConnectedToOutletToProcess.push(rightTile);
				}
			}
		}

		// check tile below
		if (r < tiles.length - 1)
		{
			var belowTile = tiles[r + 1][c];
			if (!belowTile.isOutletConnected())
			{
				if (tile.hasEdgeConnected(2) && belowTile.hasEdgeConnected(0))
				{
					belowTile.setOutletConnected(true);
					tilesConnectedToOutletToProcess.push(belowTile);
				}
			}
		}

		// check tile to left
		if (c > 0)
		{
			var leftTile = tiles[r][c - 1];
			if (!leftTile.isOutletConnected())
			{
				if (tile.hasEdgeConnected(3) && leftTile.hasEdgeConnected(1))
				{
					leftTile.setOutletConnected(true);
					tilesConnectedToOutletToProcess.push(leftTile);
				}
			}
		}
	}
};

/**
BoardHelper.markTilesForRemoval = function (tiles, bottomTileWithWater)
{
	var tilesToProcess = [];
	tilesToProcess.push(bottomTileWithWater);

	while (tilesToProcess.length > 0)
	{
		var tile = tilesToProcess.pop();
		var r = tile.getRow();
		var c = tile.getCol();

		// check tile above
		if (r > 0)
		{
			var aboveTile = tiles[r - 1][c];
			if (aboveTile.hasWater() && !aboveTile.isMarkedForRemoval())
			{
				if (tile.hasEdgeConnected(0) && aboveTile.hasEdgeConnected(2))
				{
					aboveTile.markForRemoval();
					tilesToProcess.push(aboveTile);
				}
			}
		}

		// check tile to right
		if (c < tiles[r].length - 1)
		{
			var rightTile = tiles[r][c + 1];
			if (rightTile.hasWater() && !rightTile.isMarkedForRemoval())
			{
				if (tile.hasEdgeConnected(1) && rightTile.hasEdgeConnected(3))
				{
					rightTile.markForRemoval();
					tilesToProcess.push(rightTile);
				}
			}
		}

		// check tile below
		if (r < tiles.length - 1)
		{
			var belowTile = tiles[r + 1][c];
			if (belowTile.hasWater() && !belowTile.isMarkedForRemoval())
			{
				if (tile.hasEdgeConnected(2) && belowTile.hasEdgeConnected(0))
				{
					belowTile.markForRemoval();
					tilesToProcess.push(belowTile);
				}
			}
		}

		// check tile to left
		if (c > 0)
		{
			var leftTile = tiles[r][c - 1];
			if (leftTile.hasWater() && !leftTile.isMarkedForRemoval())
			{
				if (tile.hasEdgeConnected(3) && leftTile.hasEdgeConnected(1))
				{
					leftTile.markForRemoval();
					tilesToProcess.push(leftTile);
				}
			}
		}
	}
};*/

