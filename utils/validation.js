function validateConfig(config) {
	const errors = [];

	// Check if universeId is a positive integer
	if (!Number.isInteger(config.universeId) || config.universeId <= 0) {
		errors.push('universeId must be a positive integer');
	}

	// Check if groupId is a positive integer
	if (!Number.isInteger(config.groupId) || config.groupId <= 0) {
		errors.push('groupId must be a positive integer');
	}

	// Check if saveInterval is at least 1 minute (in milliseconds)
	if (!Number.isInteger(config.saveInterval) || config.saveInterval < 60000) {
		errors.push('saveInterval must be at least 1 minute (60000 milliseconds)');
	}

	// Check if directories are strings
	if (typeof config.savesDir !== 'string' || typeof config.logDir !== 'string') {
		errors.push('savesDir and logDir must be strings');
	}

	// Check if logFileName is a string and has .log extension
	if (typeof config.logFileName !== 'string' || !config.logFileName.endsWith('.log')) {
		errors.push('logFileName must be a string ending with .log');
	}

	if (errors.length > 0) {
		throw new Error('Invalid configuration:\n' + errors.join('\n'));
	}
}

module.exports = { validateConfig }; 