const path = require("path");

const config = {
	universeId: 1931573465, // Your game's universe ID
	groupId: 2880815,       // Your group ID
	saveInterval: 5 * 60 * 1000, // 5 minutes in milliseconds
	savesDir: path.join(__dirname, "saves"),
	logDir: path.join(__dirname, "logs"),
	logFileName: "latest.log"
};

module.exports = config; 