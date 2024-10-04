class BaseStrategy {
  constructor(symbol, tradeManager) {
    this.symbol = symbol;
    this.tradeManager = tradeManager;
  }

  applyStrategy() {
    throw new Error('applyStrategy() must be implemented by a subclass');
  }
}

module.exports = BaseStrategy;
