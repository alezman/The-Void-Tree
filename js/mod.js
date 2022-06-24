let modInfo = {
	name: "The Tree of Void",
	id: "theGreatestAmongi",
	author: "nobody",
	pointsName: "points of chaos",
	modFiles: ["layers.js", "layers2.js", "tree.js"],

	discordName: "Alez's Server",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 240,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "PART 2",
	name: "The Tree of Void - Last Part",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `You just finished the game, however, you only finished it by one way. It is dependant on whether what you did. If you opened the portal, you got the good ending. Otherwise, if you instead got the Dreamension II layer, that means you got the bad ending, and you disintegrated onto the dreams, to become another one.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(2)
	if(!hasUpgrade('p',11))gain=new Decimal(0)
	if(hasUpgrade('p',12))gain=gain.mul(upgradeEffect('p',12))
	if(hasUpgrade('p',14))gain=gain.mul(upgradeEffect('p',14))
	if (!inChallenge('c',11))gain=gain.times(tmp.d.effect)
	if(hasUpgrade('d',12))gain=gain.mul(upgradeEffect('d',12))
	if(inChallenge('p',11))gain=gain.div(1.5)
	if (player.m.isEnabled == true) gain=gain.mul(tmp.m.buyables[11].effect.x1)
	if (player.m.isEnabled2 == true) gain=gain.div(tmp.m.buyables[12].effect.y1)
	if (player.m.isEnabled3 == true && !hasMilestone('m',0)) gain=gain.mul(tmp.m.buyables[13].effect.x1)
	gain=gain.mul(tmp.c.effect)
	if (inChallenge('c',11)) gain = gain.pow(0.25)
	if (inChallenge('c',12)) gain = gain.pow(0.65)
	if (hasUpgrade('c',13)) gain = gain.mul(upgradeEffect('c',13))
    if (hasUpgrade('a',14)) gain = gain.mul(upgradeEffect('a',14).x)
	if (hasUpgrade('a',24)) gain = gain.mul(upgradeEffect('a',24))
	if (hasUpgrade('p',31)) gain = gain.mul(5000)
	if (hasUpgrade('p',44)) gain = gain.mul(upgradeEffect('p',44))
	if (hasUpgrade('s',11)) gain = gain.mul("e100")
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	paused: false,
	hasEnding1: false,
	hasEnding2: false,
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		if (player.paused) return "<span style=color:#ff0000;>The game is paused. Press P to unpause.</span>"
	},
	function() {
		if(player.m.isEnabled3 && !hasMilestone('m',0)) return "<span style=color:#ff0000;>The production is frozen because you have enabled the Memory 3. Disable it if you want to continue producing stuff.</span>"
	},
	"Max Offline Time: 10 days (240 hours)"
]

// Determines when the game "ends"
function isEndgame() {
	return player.hasEnding1 || player.hasEnding2
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}