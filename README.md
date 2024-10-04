# Trading Bot 

## Overview

This project simulates a basic trading bot for a hypothetical stock market. The bot executes trades based on predefined strategies, continuously monitors stock prices, and tracks profit/loss. It is designed to be scalable and modular, allowing easy addition of new trading strategies and integration of new data sources.

### Key Features:

1. **Stock Price Monitoring**: Continuously fetches stock prices using mock data and updates them in real time.
2. **Trading Strategies**: Supports multiple trading strategies such as Moving Average Crossover and Momentum Trading.
3. **Profit/Loss Tracking**: Tracks portfolio performance and calculates overall profit/loss based on trades.
4. **Event-Driven Architecture**: Trading decisions are triggered by real-time stock price updates using custom event emitters.
5. **Scalable Design**: Extensible code architecture allows easy integration of additional trading strategies and new stock symbols.

---

## Project Structure

```
├── src
│   ├── services
│   │   ├── stockPriceService.js     # Fetches stock prices, caches them in Redis, emits events
│   │   ├── tradeManager.js          # Manages buying/selling, updates portfolio and balances
│   │   ├── profitLossTracker.js     # Calculates and tracks profit/loss, logs trades
│   │   └── redisClient.js           # Redis client setup
│   ├── strategies
│   │   ├── movingAverageStrategy.js # Implements Moving Average Crossover strategy
│   │   ├── momentumStrategy.js      # Implements Momentum Trading strategy
│   │   └── baseStrategy.js          # Base strategy class for extensibility
│   ├── utils
│   │   └── eventEmitter.js          # Custom event emitter for trading events
│   └── app.js                       # Entry point of the application (initializes services)
├── package.json
└── README.md
```

### Directory Breakdown

1. **services/**
   - **`stockPriceService.js`**: Periodically fetches stock prices using mock data and updates the stock prices in Redis. Emits events that trigger trading decisions.
   - **`tradeManager.js`**: Manages the logic for executing trades (buy/sell) and updating the balance and portfolio in Redis.
   - **`profitLossTracker.js`**: (Optional) Tracks and logs profit/loss based on the trades executed. Can be extended to log historical data and generate reports.
   - **`redisClient.js`**: Configures the Redis client for caching stock prices, portfolio data, and trading history.

2. **strategies/**
   - **`baseStrategy.js`**: A base class for implementing different trading strategies. Each strategy extends this class and implements its own logic.
   - **`movingAverageStrategy.js`**: Implements a moving average crossover strategy, where the bot buys when the short-term moving average crosses above the long-term moving average, and sells when it crosses below.
   - **`momentumStrategy.js`**: Implements a momentum-based strategy, where the bot buys when the price drops by 2% and sells when it increases by 3%.

3. **utils/**
   - **`eventEmitter.js`**: Custom event emitter that listens for stock price updates and triggers trading decisions in the relevant strategy.

4. **`app.js`**: The main entry point of the application. Initializes services, configures trading strategies, and starts the stock price fetch loop.

---

## Setup and Installation

### Prerequisites:

- **Node.js**: Version 14+ is recommended.
- **Redis**: Used for caching stock prices, managing portfolio data, and storing trade history.

### Step 1: Install Dependencies

To install the required dependencies, run:

```bash
npm install
```

This will install all required Node.js modules such as `axios`, `redis`, and `events`.

### Step 2: Configure Redis

Ensure that Redis is installed and running locally. You can install Redis using:

- **Linux**: `sudo apt-get install redis-server`
- **macOS**: `brew install redis`
- **Windows**: Use **Redis for Windows** or **WSL** (Windows Subsystem for Linux).

### Step 3: Start the Application

Run the trading bot:

```bash
node src/app.js
```

---

## Core Modules and Explanation

### 1. `stockPriceService.js`
This module is responsible for periodically fetching stock prices and emitting events that trigger the bot’s trading logic.

- **Functionality**:
  - Fetches stock prices for specified symbols using a mock API.
  - Caches the fetched prices in Redis for further use by trading strategies.
  - Emits `price-update` events when stock prices are updated.
- **Key Methods**:
  - `fetchStockPrice(symbol)`: Fetches and updates the price for a given stock symbol.
  - `startFetchingStockPrices(symbols, interval)`: Periodically fetches stock prices for the provided list of symbols.

### 2. `tradeManager.js`
Handles the execution of trades and manages the balance and portfolio in Redis.

- **Functionality**:
  - Executes trades based on buy or sell signals.
  - Updates the user's balance and stock holdings.
  - Validates whether the bot can buy/sell based on available balance and portfolio holdings.
- **Key Methods**:
  - `executeTrade(action, symbol, price)`: Executes a trade (buy or sell) for a specific stock symbol at a given price.
  - `canBuy(symbol, price)`: Checks if there is enough balance to buy the stock.
  - `canSell(symbol)`: Checks if there are enough holdings to sell the stock.

### 3. `baseStrategy.js`
An abstract class that serves as the base for different trading strategies.

- **Functionality**:
  - Defines the `applyStrategy()` method, which must be implemented by any subclass.
  - Encourages extensibility, allowing new strategies to be easily added by subclassing.
- **Key Methods**:
  - `applyStrategy()`: Abstract method that contains the core trading logic (implemented by subclasses).

### 4. `movingAverageStrategy.js`
Implements the **Moving Average Crossover** strategy, where trades are made based on short-term and long-term moving averages.

- **Functionality**:
  - Buys when the short-term moving average crosses above the long-term moving average.
  - Sells when the short-term moving average crosses below the long-term moving average.
- **Key Methods**:
  - `calculateMovingAverage(window)`: Calculates the moving average based on recent stock prices.
  - `applyStrategy()`: Executes buy/sell decisions based on the moving average crossover logic.

### 5. `momentumStrategy.js`
Implements the **Momentum Trading** strategy, where trades are made based on percentage price changes.

- **Functionality**:
  - Buys when the price drops by 2%.
  - Sells when the price increases by 3%.
- **Key Methods**:
  - `applyStrategy()`: Executes buy/sell decisions based on percentage price changes.

### 6. `redisClient.js`
Configures the Redis client, which is used for caching stock prices, managing the user's balance and holdings, and storing trade history.

- **Functionality**:
  - Provides a Redis client instance for interacting with the Redis data store.
  - Used by other modules for storing and retrieving data.

### 7. `app.js`
The entry point of the application that initializes all services and strategies, and starts the price fetching loop.

- **Functionality**:
  - Initializes trading strategies for each stock symbol.
  - Listens for `price-update` events to apply strategies dynamically.
  - Starts fetching stock prices for the given symbols at regular intervals.

---

## Extending the Application

### Adding New Trading Strategies

To add a new strategy:
1. Create a new file under the `strategies/` directory (e.g., `newStrategy.js`).
2. Extend the `BaseStrategy` class.
3. Implement the `applyStrategy()` method with the custom logic.
4. Register the strategy in `app.js` so that it is triggered when stock prices update.

### Scaling for Multiple Stocks

To monitor more stocks, simply add the stock symbols to the list in `app.js`:
```javascript
const symbols = ['AAPL', 'GOOGL', 'MSFT'];
```

### Integrating Real Stock Data

Replace the mock stock price API in `stockPriceService.js` with a real API (e.g., Alpha Vantage, Yahoo Finance). Update the `fetchStockPrice()` function accordingly.

---

## Future Enhancements

1. **Risk Management**: Add features to manage risk (e.g., stop-loss, take-profit limits).
2. **Reporting**: Implement a detailed reporting mechanism that shows daily, weekly, and monthly performance.
3. **Machine Learning**: Introduce machine learning models to predict price movements and adjust trading strategies dynamically.

