import {
  addMilliseconds,
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  addISOWeekYears,
  toDate
} from 'date-fns'

export default function add(date, unit, amount) {
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
    millisecond: addMilliseconds,
    second: addSeconds,
    minute: addMinutes,
    hour: addHours,
    day: addDays,
    week: addWeeks,
    month: addMonths,
    quarter: addQuarters,
    year: addYears,
    isoweekyear: addISOWeekYears,
    decade(date) {
      return addYears(date, 10)
    }
  }
  const startOf = methods[unit]

  return startOf(date, amount)
}
