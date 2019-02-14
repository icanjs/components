export const dateToString = date => {
  if (date) {
    let utc = date.toISOString()
    let [dateString] = utc.split('T')
    return dateString
  } else {
    return null
  }
}
export const stringToDate = string => {
  if (string) {
    let [year, month, day] = string.split('-')
    month = parseInt(month) - 1
    return new Date(year, month, day)
  } else {
    return null
  }
}
export const stringFromDate = sourceDateProp => {
  return {
    get() {
      const date = this[sourceDateProp]
      const dateString = dateToString(date)
      return dateString
    },
    set(dateString) {
      const date = stringToDate(dateString)
      this[sourceDateProp] = date
    }
  }
}
export const dateFromString = sourceStringProp => {
  return {
    get() {
      const string = this[sourceStringProp]
      const date = stringToDate(string)
      return date
    },
    set(date) {
      const dateString = dateToString(date)
      this[sourceStringProp] = dateString
    }
  }
}
