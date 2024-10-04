const redisClient = require('./redisClient');

// Function to execute a trade (buy or sell)
async function executeTrade(action, symbol, price) {
  try {
    const session = redisClient.multi(); // Start Redis transaction

    if (action === 'BUY') {
      session.decrby('balance', price);           // Decrease balance by price
      session.incrby(`stock:${symbol}:owned`, 1); // Increase stock holding
    } else if (action === 'SELL') {
      session.incrby('balance', price);           // Increase balance by price
      session.decrby(`stock:${symbol}:owned`, 1); // Decrease stock holding
    }

    await session.exec(); // Execute the Redis transaction
    console.log(`${action} executed for ${symbol} at price $${price}`);

    return { success: true, action, symbol, price };
  } catch (error) {
    console.error('Trade execution error:', error);
    return { success: false, error: 'Trade execution failed' };
  }
}

async function canBuy(symbol, price) {
  const balance = parseFloat(await redisClient.get('balance'));
  return balance >= price;
}

async function canSell(symbol) {
  const holdings = parseInt(await redisClient.get(`stock:${symbol}:owned`), 10);
  return holdings > 0;
}

module.exports = { executeTrade, canBuy, canSell };
