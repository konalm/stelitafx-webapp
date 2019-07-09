/**
 *
 */
module.exports = (data, valueKey, dateKey) => {
  console.log('format data for line graph')

  console.log('data before format for graph >>>')
  console.log(data[0].date)

  return data.map((row) => {
    return {
      date: row[dateKey],
      value: row[valueKey],
      shortWMA: row[valueKey]
    }
  })
}
