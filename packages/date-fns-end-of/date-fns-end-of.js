import {
  endOfSecond,
  endOfMinute,
  endOfHour,
  endOfDay,
  endOfWeek,
  endOfISOWeek,
  endOfMonth,
  endOfQuarter,
  endOfYear,
  endOfISOWeekYear,
  endOfDecade,
  toDate
} from 'date-fns'

export default function endOf(date, unit, options) {
  if (!unit) {
    throw new Error('unit is required')
  }
  unit = unit.toLowerCase()
  date = toDate(date)

  const methods = {
    second: endOfSecond,
    minute: endOfMinute,
    hour: endOfHour,
    day: endOfDay,
    week: endOfWeek,
    isoweek: endOfISOWeek,
    month: endOfMonth,
    quarter: endOfQuarter,
    year: endOfYear,
    isoweekyear: endOfISOWeekYear,
    decade: endOfDecade
  }
  const endOf = methods[unit]

  return endOf(date, options)
}
