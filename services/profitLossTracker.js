const redisClient = require('./redisClient');

class ProfitLossTracker {
  constructor() {
    this.tradesKey = 'trades'; // Redis key for storing all trades
    this.portfolioKey = 'portfolio'; // Redis key for storing portfolio
    this.balanceKey = 'balance'; // Redis key for storing available balance
  }

  async logTrade(symbol, action, price, quantity) {
    const trade = {
      symbol,
      action,
      price,
      quantity,
      timestamp: new Date().toISOString(),
    };

    // Save trade to Redis
    await redisClient.lpush(this.tradesKey, JSON.stringify(trade));
    console.log(`Logged trade: ${action} ${quantity} of ${symbol} at ${price}`);
  }

  async calculateProfitLoss() {
    const trades = await redisClient.lrange(this.tradesKey, 0, -1);
    let totalProfitLoss = 0;

    for (const trade of trades) {
      const { action, price, quantity } = JSON.parse(trade);

      // Simplified profit/loss calculation
      if (action === 'sell') {
        totalProfitLoss += price * quantity;
      } else if (action === 'buy') {
        totalProfitLoss -= price * quantity;
      }
    }

    return totalProfitLoss;
  }

  async getProfitLossReport() {
    const totalProfitLoss = await this.calculateProfitLoss();
    console.log(`Total Profit/Loss: ${totalProfitLoss}`);
    return totalProfitLoss;
  }
}

module.exports = new ProfitLossTracker();