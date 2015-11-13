/**
 * Lusie
 * -----
 * @desc A casual housie / lotto / tambola playing script
 * @author Navdeep
 */



/**
 * @constructor Lusie
 * @params
 *     - config {object} The config hash
 */
var Lusie = function( config ) {
	// Consume the config in this instance:
	this.config = config;

	// The state block:
	// Keeps track of the app's state.
	this.state = {
		started : false,
		paused  : false,
		stopped : true
	};

	// Create the array that will store the
	// processed numbers:
	this.generated = [];

	// Draw the board:
	this.drawBoard();
};



/*********************************************************
 *
 * Application lifecycle methods
 *
 *********************************************************/

/**
 * @desc Starts the app
 */
Lusie.prototype.start = function() {
	// Start printing the numbers in an interval:
	this.beginInterval( this.config.interval );

	// Update the app state:
	this.state.started = true;
};

/**
 * @desc Pauses the app
 */
Lusie.prototype.pause = function() {
	// Clear the interval:
	clearInterval( this.printInterval );

	// Update the app state:
	this.state.paused = true;
};

/**
 * @desc Resumes the app
 * @params
 *     - newInterval {number} The interval with which the
 *                            numbers should be printed
 */
Lusie.prototype.resume = function( newInterval ) {
	// Start printing the numbers in an interval:
	this.beginInterval( newInterval );

	// Update the app state:
	this.state.paused  = false;
};

/**
 * @desc Ends the app
 */
Lusie.prototype.end = function() {
	// Clear the interval:
	clearInterval( this.printInterval );

	// Reset the app state:
	this.state.started = false;
	this.state.paused  = false;
	this.state.stopped = true;

	// Empty the array of generated numbers:
	this.generated = [];
};



/*****************************************************
 *
 * Board-related methods
 *
 *****************************************************/

/**
 * @desc Prints the numbers in the form of a board
 */
Lusie.prototype.drawBoard = function() {
	// Get the 'from' limit:
	// This will be used to generate all the numbers within
	// the limits sequentially.
	var num  = this.config.from;

	// A temporary variable:
	var curr = 0;

	// Iterate to form rows having columns of 10 nos. each:
	for( var row = 0; row < this.config.to / 10; row++ ) {
		for( var col = 0; col < 10; col++ ) {
			// In each block of the board, append a number:
			curr = num++;
			this.config.boardEl.innerHTML +=
				"<span id='num-" + curr + "' class='board__num'>" +
					curr +
				"</span>";
			// If the 'to' limit is not a multiple of 10
			// break the loop when the 'to' limit is reached:
			if( curr === this.config.to ) break;
		}
		// Add a break tag to separate the rows:
		this.config.boardEl.innerHTML += "<br />";
	}
};

/**
 * @desc Clears the board by resetting the selected numbers
 */
Lusie.prototype.clearBoard = function() {
	var arr = [];

	// Get all the board numbers in an array:
	arr = document.getElementsByClassName( "board__num" );

	// Now iterate over these elements and remove the class regarding
	// the number being selected:
	for( var idx = 0, len = arr.length; idx < len; idx++ ) {
		arr[ idx ].classList.remove( "board__num--processed" );
	}
};



/*****************************************************
 *
 * Utility methods
 *
 *****************************************************/

/**
 * @desc Begins the print interval
 * @params
 *     - interval {number} The interval with which the
 *                         numbers should be printed
 */
Lusie.prototype.beginInterval = function( interval ) {
	// Print the number immediately:
	this.printNumber();

	// And then set an interval that will print and select
	// a random number every `interval` seconds.
	this.printInterval = setInterval(
		// Set the context of the function using the
		// bind() function.
		// NOTE: bind() is ES5 i.e. modern browsers compatible
		// only.
		// TODO find alternative
		this.printNumber.bind( this ),
		// Convert seconds into milliseconds
		interval * 1000
	);
};

/**
 * @desc Selects the number on the board
 */
Lusie.prototype.printNumber = function() {
	// Get the number:
	var num = this.generateNumber();

	// Push this number in the generated numbers array
	// so it can be used to check whether the generated
	// numbers is fresh or not.
	this.generated.push( num );

	// Set this number on the DOM:
	// This is set in the big number display.
	this.config.currNumEl.innerText = num;

	// Select the number on the board too:
	document.getElementById( "num-" + num )
		.classList.add( "board__num--processed" );

	if( this.generated.length === this.config.to ) {
		this.end();
		console.log( "The End" );
	}
};

/**
 * @desc Generates a housie number
 */
Lusie.prototype.generateNumber = function() {
	// Get a random number within the limits:
	var num = this.getRandomInt( this.config.from, this.config.to );

	// Keep generating the number until a number is found that
	// is not already generated:
	while( this.generated.indexOf( num ) >= 0 ) {
		// Get a random number again:
		num = this.getRandomInt( this.config.from, this.config.to );
	}

	// Return this fresh number:
	return num;
};

/**
 * @desc Returns a randomly generated number within the limits
 * @params
 *     - min {number} The lower limit (inclusive)
 *     - max {number} The upper limit (inclusive)
 */
Lusie.prototype.getRandomInt = function( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
};



/*****************************************************
 *
 * Misc
 *
 *****************************************************/

Lusie.VERSION = {
	major : "1",
	minor : "0",
	dot   : "0",
	full  : "1.0.0"
};