import moment from 'moment';
import numberToWord from 'num-words';


export const numberToWMAStringValue = (length) => {
  const lengthAsWord = numberToWord(length)

  let formattedLengthAsWord = lengthAsWord.replace(/(\w+)(?:\s+|$)/g, (_, word) =>
    word.charAt(0).toUpperCase() + word.substr(1)
  )
  formattedLengthAsWord = formattedLengthAsWord.charAt(0).toLowerCase() +
    formattedLengthAsWord.slice(1)
  
  return `${formattedLengthAsWord}WMA`
}

/**
 * Compare hour and min of dates to find index in array
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
  const date = stringHMSFromDate(new Date())
  date.setDate(date.getDate() - minusDays)

  return date.toISOString();
}

export const getDaysFromToday = (date) => {
  const today = stringHMSFromDate(new Date());
  const d = stringHMSFromDate(date);

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((today - d) / oneDay));
}

const stringHMSFromDate = (date) => {
  const d = new Date(date)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)

  return d
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

export const formatDate = (date) => {
  return moment(date).format('DD/MM/YYYY')
}

export const formatTime = (date) => {
  return moment(date).format('HH:mm')
}

export const formatDateTime = (date) => {
  return moment(date).format('DD/MM/YYYY') + moment(date).format('HH:mm')
}