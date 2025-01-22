const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

// Configuration
const config = {
  universeId: 1931573465,
  groupId: 2880815,
  saveInterval: 5 * 60 * 1000, // 5 minutes in milliseconds
  savesDir: path.join(__dirname, "saves"),
  logDir: path.join(__dirname, "logs"),
  logFileName: "latest.log"
};

// API endpoints
const APIs = {
  game: `https://games.roblox.com/v1/games?universeIds=${config.universeId}`,
  group: `https://groups.roblox.com/v1/groups/${config.groupId}`,
  votes: `https://games.roblox.com/v1/games/votes?universeIds=${config.universeId}`
};

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(config.savesDir, { recursive: true });
  await fs.mkdir(config.logDir, { recursive: true });
}

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

// Function to initialize log file
async function initializeLogFile() {
  const logFilePath = path.join(config.logDir, config.logFileName);

  try {
    await fs.access(logFilePath);
    const stats = await fs.stat(logFilePath);
    const oldLogName = `${stats.birthtime.toISOString().replace(/:/g, "-")}.log`;
    await fs.rename(logFilePath, path.join(config.logDir, oldLogName));
  } catch (error) {
    // If latest.log doesn"t exist, we'll create a new one
    if (error.code !== "ENOENT") throw error;
  }

  // Create a new empty log file
  await fs.writeFile(logFilePath, "");
}

// Function to log messages
async function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  console.log(logMessage.trim());

  const logFilePath = path.join(config.logDir, config.logFileName);
  await fs.appendFile(logFilePath, logMessage);
}

// Function to fetch ROBLOX statistics from all APIs
async function fetchRobloxStats() {
  const stats = {
    timestamp: new Date().toISOString(),
    visits: null,
    favorites: null,
    players: null,
    members: null,
    upVotes: null,
    downVotes: null
  };

  const apiCalls = [
    { name: "game", api: APIs.game },
    { name: "group", api: APIs.group },
    { name: "votes", api: APIs.votes }
  ];

  for (const call of apiCalls) {
    try {
      const response = await axios.get(call.api);
      await log(`${call.name} API call successful. Status: ${response.status}`);

      if (call.name === "game") {
        const gameData = response.data.data[0];
        stats.visits = gameData.visits;
        stats.favorites = gameData.favoritedCount;
        stats.players = gameData.playing;
      } else if (call.name === "group") {
        stats.members = response.data.memberCount;
      } else if (call.name === "votes") {
        const voteData = response.data.data[0];
        stats.upVotes = voteData.upVotes;
        stats.downVotes = voteData.downVotes;
      }
    } catch (error) {
      const errorMessage = `Error in ${call.name} API call: ${error.message}. Status: ${error.response ? error.response.status : "Unknown"}`;
      await log(errorMessage);
    }
  }

  return stats;
}

// Function to save data to CSV file
async function saveDataToCSV(data) {
  const currentDate = getCurrentDate();
  const fileName = `${currentDate}.csv`;
  const filePath = path.join(config.savesDir, fileName);
  const csvLine = `${data.timestamp},${data.visits},${data.favorites},${data.players},${data.members},${data.upVotes},${data.downVotes}\n`;

  try {
    // Check if file exists, if not, create it with headers
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, "Timestamp,Visits,Favorites,Players,Members,UpVotes,DownVotes\n");
    }

    // Append data to the file
    await fs.appendFile(filePath, csvLine);
    await log(`Data saved successfully to ${fileName}`);
  } catch (error) {
    await log(`Failed to save data: ${error.message}`);
  }
}

// Function to get the next 5-minute mark
function getNextFiveMinuteMark() {
  const now = new Date();
  return new Date(Math.ceil(now.getTime() / config.saveInterval) * config.saveInterval);
}

// Main function to run the tracker
async function runTracker() {
  try {
    await ensureDirectories();
    await initializeLogFile();
    await log("ROBLOX Stats Tracker started");

    // Fetch and log data immediately for debugging
    const initialStats = await fetchRobloxStats();
    await saveDataToCSV(initialStats);
    await log("Initial data fetched and saved for debugging");

    // Calculate time until next 5-minute mark
    let nextRun = getNextFiveMinuteMark();
    let delay = nextRun.getTime() - Date.now();

    // Wait until the next 5-minute mark
    await new Promise(resolve => setTimeout(resolve, delay));

    // Start the main loop
    while (true) {
      const stats = await fetchRobloxStats();
      await saveDataToCSV(stats);
      nextRun = new Date(nextRun.getTime() + config.saveInterval);
      delay = nextRun.getTime() - Date.now();
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  } catch (error) {
    await log(`Critical error: ${error.message}`);
    process.exit(1);
  }
}

// Start the tracker
runTracker().catch(console.error);