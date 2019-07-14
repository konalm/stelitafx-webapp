/**
 * Takes buy and sell orders and groups them into an array of trades
 * ( a trade being an object with a buy and sell order)
 */
module.exports = (orders) => {
  if (orders.length === 0) return [];

  /* first trade needs to be a buy */
  if (orders[orders.length - 1].transaction === 'sell') {
    orders.splice(orders.length - 2, orders.length -1);
  }

  const trades = [];
  for (var i = orders.length - 1; i > 0; i -= 2) {
    const buy = orders[i];
    const sell = orders[i - 1];
    const trade = {
      percentDiff: calcPercentDiff(buy.rate, sell.rate),
      minsBetween: calcMinsBetweenDates(sell.date, buy.date),
      buy,
      sell
    };

    trades.push(trade);
  }

  trades.sort((a, b) => {
    return new Date(b.sell.date) - new Date(a.sell.date);
  });

  return trades
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
