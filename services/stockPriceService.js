const axios = require('axios');
const redisClient = require('./redisClient');
const eventEmitter = require('../utils/eventEmitter');

// Mock API URL to fetch stock price
const API_URL = 'http://localhost:3000/stock-price';

// Function to fetch stock price for a given symbol
async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get(`${API_URL}?symbol=${symbol}`);
    const price = parseFloat(response.data.price);
    
    // Cache the stock price in Redis
    await redisClient.set(`stock:${symbol}:price`, price);

    // Emit an event when price is updated, triggering strategies
    eventEmitter.emit('price-update', { symbol, price });
  } catch (error) {
    console.error('Error fetching stock price:', error);
  }
}

// Periodic function to fetch stock prices at regular intervals
function startFetchingStockPrices(symbols, interval = 5000) {
  setInterval(() => {
    symbols.forEach(symbol => fetchStockPrice(symbol));
  }, interval);
}

module.exports = { startFetchingStockPrices };
