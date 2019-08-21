/**
 * Compare hour and min of dates to find indx in array
 */
export function compareHourAndMin (item) {
  const itemDate = new Date(item.date);
  const itemHour = itemDate.getHours();
  const itemMin = itemDate.getMinutes();

  const bDate = new Date(this);
  const bHour = bDate.getHours();
  const bMin = bDate.getMinutes();

  return itemHour == bHour && itemMin === bMin;
}

/**
 * date of beginning of day & minus days passed in
 */
export const beginningOfDay = (minusDays = 0) => {
  const date = new Date();

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setDate(date.getDate() - minusDays);

  return date.toISOString();
}

/**
 *
 */
export const calcPercentangeOfGain = (gained, lost) => {
  const wholeNumber = gained + lost;
  const division = gained / wholeNumber

  return division * 100;
}

export const durationOfTrade = (openDateString, closeDateString) => {
  const openDate = new Date(openDateString)
  const closeDate = new Date(closeDateString)
  var diffMs = (closeDate - openDate);

  const hours = (Math.abs(closeDate - openDate) / 36e5).toFixed(0)
  const mins =  Math.round(((diffMs % 86400000) % 3600000) / 60000);

  let duration = '';
  if (hours > 0) duration += `${hours} H  `
  duration += `${mins} M`

  return duration
}
