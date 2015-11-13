/**
 * @desc Utilizes the Lusie library to run the app
 * @author Navdeep
 */



// Some nifty variables:
var numberInterval  = 4; // in `seconds`
var btMain          = document.getElementById( "btStart" );
var btIntermediate  = document.getElementById( "btPause" );
var newInterval     = document.getElementById( "newInterval" );
var switchTheme     = document.getElementById( "switchTheme" );
var themeStylesheet = document.getElementById( "style" );

// Initialize the library:
var app = new Lusie({
	"from"      : 1,
	"to"        : 90,
	"interval"  : numberInterval,
	"boardEl"   : document.getElementById( "board" ),
	"currNumEl" : document.getElementById( "num" )
});

// Set the current interval in the text box:
newInterval.value = numberInterval;

// Add click listener on the main button:
btMain.addEventListener( "click", function() {
	app.clearBoard();
	if( app.state.started ) {
		app.end();
		btIntermediate.innerText = "Pause";
		btIntermediate.disabled = true;
		newInterval.disabled = true;
		app.config.currNumEl.innerHTML = "--";
		newInterval.value = numberInterval;
		this.innerText = "Start";
	}
	else {
		app.start();
		btIntermediate.disabled = false;
		newInterval.disabled = false;
		this.innerText = "End";
	}
});

// Add click listener on the intermediate button:
btIntermediate.addEventListener( "click", function() {
	var val = newInterval.value;
	if( val ) {
		if( app.state.paused ) {
			app.resume( val );
			this.innerText = "Pause";
		}
		else {
			app.pause();
			this.innerText = "Resume";
		}
	}
});

// Add click listener on the theme changer link:
switchTheme.addEventListener( "click", function( e ) {
	e.preventDefault();
	var isThemeLight = themeStylesheet.getAttribute( "href" ) === "css/main.css" ? true : false;
	if( isThemeLight ) {
		this.firstElementChild.innerText = "Light";
		themeStylesheet.setAttribute( "href", "css/main.dark.css" );
	}
	else {
		this.firstElementChild.innerText = "Dark";
		themeStylesheet.setAttribute( "href", "css/main.css" );
	}
});