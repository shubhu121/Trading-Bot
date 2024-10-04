const BaseStrategy = require('./baseStrategy');
const redisClient = require('../services/redisClient');

class MomentumStrategy extends BaseStrategy {
  constructor(symbol, tradeManager, buyThreshold = -0.02, sellThreshold = 0.03) {
    super(symbol, tradeManager);
    this.buyThreshold = buyThreshold;
    this.sellThreshold = sellThreshold;
  }

  async applyStrategy() {
    const currentPrice = parseFloat(await redisClient.get(`stock:${this.symbol}:price`));
    const previousPrice = parseFloat(await redisClient.lindex(`stock:${this.symbol}:price_history`, 1));

    const priceChange = (currentPrice - previousPrice) / previousPrice;

    if (priceChange <= this.buyThreshold) {
      const canBuy = await this.tradeManager.canBuy(this.symbol, currentPrice);
      if (canBuy) {
        await this.tradeManager.executeTrade('BUY', this.symbol, currentPrice);
      }
    } else if (priceChange >= this.sellThreshold) {
      const canSell = await this.tradeManager.canSell(this.symbol);
      if (canSell) {
        await this.tradeManager.executeTrade('SELL', this.symbol, currentPrice);
      }
    }
  }
}

module.exports = MomentumStrategy;
