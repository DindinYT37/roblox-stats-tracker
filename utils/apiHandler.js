const axios = require('axios');

class APIHandler {
	constructor() {
		this.MAX_RETRIES = 3;
		this.RETRY_DELAY = 5000; // 5 seconds
	}

	async fetchWithRetry(url, retryCount = 0) {
		try {
			const response = await axios.get(url);
			return response;
		} catch (error) {
			if (retryCount < this.MAX_RETRIES) {
				// Handle specific error cases
				if (error.response) {
					switch (error.response.status) {
						case 429: // Too Many Requests
						case 500: // Server Error
						case 502: // Bad Gateway
						case 503: // Service Unavailable
						case 504: // Gateway Timeout
							await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
							return this.fetchWithRetry(url, retryCount + 1);
						default:
							throw error; // Don't retry for other status codes
					}
				}
			}
			throw error;
		}
	}
}

module.exports = new APIHandler(); 