import {
  subMilliseconds,
  subSeconds,
  subMinutes,
  subHours,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  subISOWeekYears,
  toDate
} from 'date-fns'

export default function sub(date, unit, amount) {
  if (!unit) {
    throw new Error('unit is required')
  }
  unit = unit.toLowerCase()
  date = toDate(date)
  // Allow passing plural units
  if (unit.endsWith('s')) {
    unit = unit.slice(0, unit.length - 1)
  }

  const methods = {
    millisecond: subMilliseconds,
    second: subSeconds,
    minute: subMinutes,
    hour: subHours,
    day: subDays,
    week: subWeeks,
    month: subMonths,
    quarter: subQuarters,
    year: subYears,
    isoweekyear: subISOWeekYears,
    decade(date) {
      return subYears(date, 10)
    }
  }
  const startOf = methods[unit]

  return startOf(date, amount)
}
