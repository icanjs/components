import {
  startOfSecond,
  startOfMinute,
  startOfHour,
  startOfDay,
  startOfWeek,
  startOfISOWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  startOfISOWeekYear,
  startOfDecade,
  toDate
} from 'date-fns'

export default function startOf(date, unit, options) {
  if (!unit) {
    throw new Error('unit is required')
  }
  unit = unit.toLowerCase()
  date = toDate(date)

  const methods = {
    second: startOfSecond,
    minute: startOfMinute,
    hour: startOfHour,
    day: startOfDay,
    week: startOfWeek,
    isoweek: startOfISOWeek,
    month: startOfMonth,
    quarter: startOfQuarter,
    year: startOfYear,
    isoweekyear: startOfISOWeekYear,
    decade: startOfDecade
  }
  const startOf = methods[unit]

  return startOf(date, options)
}
