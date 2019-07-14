/**
 *
 */
module.exports = (data, valueKey, dateKey) => {
  return data.map((row) => {
    return {
      date: row[dateKey],
      value: row[valueKey],
      shortWMA: row[valueKey]
    }
  })
}
