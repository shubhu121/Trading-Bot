const { startFetchingStockPrices } = require('./services/stockPriceService');
const { executeTrade, canBuy, canSell } = require('./services/tradeManager');
const MovingAverageStrategy = require('./strategies/movingAverageStrategy');
const MomentumStrategy = require('./strategies/momentumStrategy');
const eventEmitter = require('./utils/eventEmitter');

const tradeManager = { executeTrade, canBuy, canSell };

// Symbols to monitor
const symbols = ['AAPL', 'GOOGL'];

// Initialize and apply trading strategies for each symbol
symbols.forEach(symbol => {
  const movingAverageStrategy = new MovingAverageStrategy(symbol, tradeManager);
  const momentumStrategy = new MomentumStrategy(symbol, tradeManager);

  eventEmitter.on('price-update', async ({ symbol: eventSymbol, price }) => {
    if (eventSymbol === symbol) {
      await movingAverageStrategy.applyStrategy();
      await momentumStrategy.applyStrategy();
    }
  });
});

// Start fetching stock prices
startFetchingStockPrices(symbols);
