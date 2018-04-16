function GameConstants()
{
}

GameConstants.WRAPPER_WIDTH = 769;
GameConstants.WRAPPER_HEIGHT = 1589;

GameConstants.GAME_WIDTH = 640;
GameConstants.GAME_HEIGHT = 1136;

// Level 1 config
GameConstants.NUM_PATHS_REQUIRED = 12;
GameConstants.TIME_ALLOWED = 60000;

GameConstants.BOARD_ROWS = 6;
GameConstants.BOARD_COLUMNS = 6;
GameConstants.INLET_SOURCES = [true, true, true, true, true, true];
GameConstants.OUTLET_SOURCES = [true, true, true, true, true, true];
GameConstants.TILE_TYPES = ["1", "2", "3", "4", "5"];

GameConstants.TILE_SIZE = 99;
GameConstants.TILE_X_OFFSET = 6;
GameConstants.TILE_Y_OFFSET = 9;
GameConstants.TILE_FILL_COLOUR = 0xFFFFFF;
GameConstants.TILE_INLET_CONNECTED_FILL_COLOUR = 0xFCA802;
GameConstants.TILE_OUTLET_CONNECTED_FILL_COLOUR = 0xFF0000;

GameConstants.TILE_CONFIG = [];
GameConstants.TILE_CONFIG[0] = { // horizontal
	"imageName" : "tile0",
	"sides" : [0, 1, 0, 1],
	"weighting" : 24, // as percentage of 100
	"points" : 10
};
GameConstants.TILE_CONFIG[1] = { // top right corner
	"imageName" : "tile1",
	"sides" : [1, 1, 0, 0],
	"weighting" : 24,
	"points" : 20
};
GameConstants.TILE_CONFIG[2] = { // upside down t
	"imageName" : "tile2",
	"sides" : [1, 1, 0, 1],
	"weighting" : 24,
	"points" : 30
};
GameConstants.TILE_CONFIG[3] = { // cross
	"imageName" : "tile3",
	"sides" : [1, 1, 1, 1],
	"weighting" : 24,
	"points" : 40
};
GameConstants.TILE_CONFIG[4] = { // dead end
	"imageName" : "tile4",
	"sides" : [1, 0, 0, 0],
	"weighting" : 4,
	"points" : 50
};

/**
 * Game Timings
 */
GameConstants.TILE_ROTATE_DURATION = 100;
GameConstants.TILE_MOVE_DURATION = 500;
GameConstants.INLET_FILL_DURATION = 150;
GameConstants.FUEL_POINTER_MOVE_DURATION = 200;
GameConstants.EXPLOSION_REMOVE_TILE_DELAY = 300;
GameConstants.EXPLOSION_DURATION = 1000;
GameConstants.REPOPULATE_DELAY = 500;
GameConstants.REEVALUATE_DELAY = 1000;



