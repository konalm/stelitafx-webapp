/**
 * Takes buy and sell orders and groups them into an array of trades
 * ( a trade being an object with a buy and sell order)
 */
module.exports = (_orders) => {
  if (_orders.length === 0) return [];

  let orders = [... _orders];

  /* sort by earliest order */
  orders.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  /* first trade needs to be a buy */
  if (orders[0].transaction === 'sell') orders.splice(0, 1);

  orders = sortOrderTransactionSequence(orders);

  const trades = [];
  for (let i = 0; i <= orders.length - 1; i += 2) {
    const buy = orders[i];
    const sell = orders[i + 1];

    if (buy.transaction !== 'buy') {
      throw new Error(`buy transaction out of order for ${buy.id}`)
    }
    if (sell.transaction !== 'sell') {
      throw new Error(`sell transaction out of order for ${sell.id}`)
    }

    const trade = {
      percentDiff: calcPercentDiff(buy.rate, sell.rate),
      minsBetween: calcMinsBetweenDates(sell.date, buy.date),
      buy,
      sell
    };

    trades.push(trade);
  }

  /* sort trades by latest sale date */
  trades.sort((a, b) => {
    return new Date(b.sell.date) - new Date(a.sell.date);
  });

  return trades
}

/**
 * Any transaction not in correct order will not be pushed into the returned
 * sorted orders array.
 * buy orders should be on even index and sell orders on odd index
 */
const sortOrderTransactionSequence = (orders) => {
  const isEven = (value) => (value%2 === 0);
  let index = 0;

  const sortedOrders = [];
  orders.forEach((order) => {
    /* buy transaction should be on even index */
    if (isEven(index) && order.transaction === 'buy') {
      sortedOrders.push(order);
      index++;
      return;
    }
    /* sell transactions should be on odd index */
    if (!isEven(index) && order.transaction === 'sell') {
      sortedOrders.push(order);
      index++;
      return;
    }
  });

  return sortedOrders;
}

const calcPercentDiff = (originalNumber, newNumber) => {
  const diff = originalNumber - newNumber;
  return (diff / originalNumber * 100) * -1;
}

const calcMinsBetweenDates = (dateAString, dateBString) => {
  const dateA = new Date(dateAString);
  const dateB = new Date(dateBString);

  var diffMs = (dateA - dateB); // milliseconds between now & Christmas

  return Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
}
