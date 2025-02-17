# ROBLOX Stats Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Dependencies Status](https://img.shields.io/badge/dependencies-1-brightgreen.svg)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A Node.js application that automatically tracks and logs various statistics for ROBLOX games and groups over time. It collects data such as:

- Game visits
- Favorite count
- Current active players
- Group member count
- Up/down votes

## Features

- Automatic data collection at configurable intervals
- CSV file output organized by date
- Detailed logging system
- Error handling and recovery
- Clean shutdown and log rotation
- Rate limiting to respect ROBLOX's API limits
- Automatic retry on server errors

## Getting Started and Installation

1. Clone this repository:
   `git clone https://github.com/yourusername/roblox-stats-tracker.git`
   `cd roblox-stats-tracker`

2. Install dependencies:
   `npm install`

3. Configure your settings in config.js:
   - Set your ROBLOX universe ID (currently set to 1931573465)
   - Set your group ID (currently set to 2880815)
   - Adjust the save interval if needed (default is 5 minutes)

### Finding your ROBLOX universe ID and group ID

1. Find your ROBLOX universe ID:
   - Go to your game's configuration page
   - The universe ID is in the URL: `https://create.roblox.com/dashboard/creations/experiences/[universeId]/...`

2. Find your group ID:
   - Go to your group's page
   - The group ID is in the URL: `https://www.roblox.com/groups/[groupId]/...`

3. Update these values in `config.js`

## Usage

Start the tracker:
`npm start`

Using Screen (recommended for servers):
1. Install screen if not already installed:
   - Ubuntu/Debian: `sudo apt-get install screen`
   - CentOS/RHEL: `sudo yum install screen`

2. Start the tracker in a screen session:
   `./start.sh`

3. Detach from the screen session: Press `Ctrl+A` then `D`
4. Reattach to the session later: `screen -r tracker`
5. List all screen sessions: `screen -ls`

## Data Format

The tracker creates daily CSV files in the `saves` directory with the following format:

| Column | Description |
|--------|-------------|
| Timestamp | ISO 8601 timestamp |
| Visits | Total game visits |
| Favorites | Total favorites |
| Players | Current active players |
| Members | Group member count |
| UpVotes | Total up votes |
| DownVotes | Total down votes |

Example:
`2024-03-20T12:00:00.000Z,1000000,50000,150,5000,75000,2500`

## Viewing the Data

While you can open the CSV files in any spreadsheet application, I recommend using [CSViewer](https://csviewer.com/) for analyzing the data. CSViewer is:

- Fast and lightweight
- Free for commercial use
- Great for large CSV files
- Includes filtering and basic visualization features

The data format is also compatible with other tools like Excel, Google Sheets, or any CSV viewer of your choice.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
