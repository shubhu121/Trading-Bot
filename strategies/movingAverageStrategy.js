const BaseStrategy = require('./baseStrategy');
const redisClient = require('../services/redisClient');

class MovingAverageStrategy extends BaseStrategy {
  constructor(symbol, tradeManager, shortWindow = 3, longWindow = 5) {
    super(symbol, tradeManager);
    this.shortWindow = shortWindow;
    this.longWindow = longWindow;
  }

  async calculateMovingAverage(window) {
    const priceHistory = await redisClient.lrange(`stock:${this.symbol}:price_history`, 0, window - 1);
    const prices = priceHistory.map(parseFloat);
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / window;
  }

  async applyStrategy() {
    const shortMA = await this.calculateMovingAverage(this.shortWindow);
    const longMA = await this.calculateMovingAverage(this.longWindow);

    const currentPrice = parseFloat(await redisClient.get(`stock:${this.symbol}:price`));

    if (shortMA > longMA) {
      const canBuy = await this.tradeManager.canBuy(this.symbol, currentPrice);
      if (canBuy) {
        await this.tradeManager.executeTrade('BUY', this.symbol, currentPrice);
      }
    } else if (shortMA < longMA) {
      const canSell = await this.tradeManager.canSell(this.symbol);
      if (canSell) {
        await this.tradeManager.executeTrade('SELL', this.symbol, currentPrice);
      }
    }
  }
}

module.exports = MovingAverageStrategy;
