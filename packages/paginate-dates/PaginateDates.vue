<script>
import { eachDayOfInterval, isWithinInterval, isValid } from 'date-fns'
import { stringFromDate, dateFromString } from './utils'
import endOf from '@icanjs/date-fns-end-of'
import startOf from '@icanjs/date-fns-start-of'
import add from '@icanjs/date-fns-add'
import sub from '@icanjs/date-fns-sub'

export { stringFromDate, dateFromString }

const intervalTypes = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'ISOweek',
  'month',
  'quarter',
  'year',
  'ISOyear'
]
const dayValues = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
}

export default {
  name: 'PaginateDates',
  model: {
    prop: 'date',
    event: 'update'
  },
  props: {
    /**
     * The `targetDate` is currently the master date.  The `startDate` and `endDate`
     * both use the `targetDate` for their calculations.
     */
    date: {
      type: Date,
      default: () => new Date()
    },
    /**
     * For weekly intervals, specifies which day will be counted as the first day of the week.  Can be specified as a string ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday') or as a number (0, 1, 2, 3, 4, 5, 6, respectively).
     */
    weekStartsOn: {
      type: [Number, String],
      default: 'sunday',
      validator(val) {
        const intVal = parseInt(val)

        if (typeof val === 'string' && isNaN(parseInt(val))) {
          return Object.keys(dayValues).includes(val)
        }
        if (typeof intVal === 'number') {
          return intVal >= 0 || intVal <= 6
        }
      },
      /**
       * Does nothing, internally, but can be used with .sync to get the interval in a parent component.
       */
      interval: {
        type: Object
      }
    },
    /**
     * The `projectionDirection` determines which direction the module displays additional
     * data above 1 day.  It can be either 'back' or 'forward'.  If it's 'back', it
     * will calculate back in time.  If it's set to 'forward', it will calculate
     * forward in time.
     */
    projectionDirection: {
      type: String,
      default: 'back',
      validator(val) {
        return ['back', 'forward'].includes(val)
      }
    },
    /**
     * Can be second, minute, hour, day, week, month, quarter, year, isoweekyear, decade
     */
    unit: {
      type: String,
      default: 'week',
      validator(val) {
        return intervalTypes.includes(val)
      }
    },
    /**
     * How many units to paginate
     */
    multiplier: {
      type: [Number, String],
      default: 1,
      validator(val) {
        return parseInt(val) > 0
      }
    },
    /**
     * Does nothing, internally, but can be used with .sync to get the endDate in a parent component.
     */
    startDate: {
      type: Date,
      default: null
    },
    /**
     * Does nothing, internally, but can be used with .sync to get the endDate in a parent component.
     */
    endDate: {
      type: Date,
      default: null
    }
  },
  data: () => ({
    internalDate: null
  }),
  computed: {
    isCurrentInterval() {
      const { internalInterval: interval } = this
      if (interval && isValid(interval.start) && isValid(interval.end)) {
        return isWithinInterval(new Date(), interval)
      } else {
        return false
      }
    },
    intervalTypes() {
      return intervalTypes
    },
    normalizedDate() {
      let normalizedDate
      try {
        normalizedDate = new Date(this.internalDate)
      } catch (error) {
        normalizedDate = null
      }
      return normalizedDate
    },
    normalizedWeekStartsOn() {
      const { weekStartsOn } = this
      const newVal = dayValues[weekStartsOn]

      if (typeof weekStartsOn === 'number') {
        return weekStartsOn
      }

      return newVal
    },
    internalStartDate() {
      const {
        normalizedDate: date,
        unit,
        multiplier,
        projectionDirection,
        normalizedWeekStartsOn
      } = this
      const options = { weekStartsOn: normalizedWeekStartsOn }

      if (projectionDirection === 'back') {
        return startOf(sub(date, unit, multiplier - 1), unit, options)
      } else {
        return startOf(
          sub(this.internalEndDate, unit, multiplier - 1),
          unit,
          options
        )
      }
    },
    internalEndDate() {
      const {
        normalizedDate: date,
        unit,
        multiplier,
        projectionDirection,
        normalizedWeekStartsOn
      } = this
      const options = { weekStartsOn: normalizedWeekStartsOn }

      if (projectionDirection === 'back') {
        return endOf(
          add(this.internalStartDate, unit, multiplier - 1),
          unit,
          options
        )
      } else {
        return endOf(add(date, unit, multiplier - 1), unit, options)
      }
    },
    internalInterval() {
      if (this.normalizedDate) {
        return { start: this.internalStartDate, end: this.internalEndDate }
      } else {
        return { start: null, end: null }
      }
    },
    eachDay() {
      if (this.internalDate) {
        return eachDayOfInterval(this.internalInterval)
      } else {
        return null
      }
    }
  },
  watch: {
    date: {
      handler: 'setDate',
      immediate: true
    },
    internalDate: {
      handler: 'updateDate',
      immediate: true
    },
    internalInterval: {
      handler(interval) {
        /**
         * Passes the interval object out to the parent component.
         *
         * @event update:interval
         * @type {object}
         */
        this.$emit('update:interval', interval)
        /**
         * Passes the startDate up to the parent component.
         *
         * @event update:startDate
         * @type {Date}
         */
        this.$emit('update:startDate', interval.start)
        /**
         * Passes the endDate up to the parent component.
         *
         * @event update:endDate
         * @type {Date}
         */
        this.$emit('update:endDate', interval.end)
      },
      immediate: true
    }
  },
  methods: {
    updateDate(date) {
      if (this.date.toString() !== date.toString()) {
        /**
         * Passes the date up to the parent component.  For use with v-model.
         *
         * @event update
         * @type {Date} date
         */
        this.$emit('update', date)
      }
    },
    /**
     * The `setDate` method can be bound to an action to set the date to a specific date. For example:
     *
     * ```
     * <button @click="setDate(new Date())">Set to today's date</button>
     * ```
     *
     * @param {Date} date
     * @public
     */
    setDate(date) {
      let normalizedDate
      try {
        normalizedDate = new Date(date)
      } catch (error) {
        normalizedDate = null
      }
      this.internalDate = normalizedDate
    },
    /**
     * The `add` method can be bound to an action to add a number of units to the current date. For example:
     *
     * ```
     * <button @click="add(1, 'month')">Forward One Month</button>"
     * <button @click="add(2, 'months')">Forward Two Months</button>"
     *  ```
     *
     * @param {Integer} howMany
     * @param {String} unit
     * @public
     */
    add(howMany, unit) {
      howMany = howMany || 1
      unit = unit || this.unit
      this.internalDate = add(this.internalDate, unit, howMany)
    },
    /**
     * The `sub` method can be bound to an action to subtract a number of units from the current date. For example:
     *
     * ```
     * <button @click="sub(1, 'month')">Back One Month</button>"
     * <button @click="sub(2, 'months')">Back Two Months</button>"
     *  ```
     *
     * @param {Integer} howMany
     * @param {String} unit
     * @public
     */
    sub(howMany = 1, unit) {
      unit = unit || this.unit
      this.internalDate = sub(this.internalDate, unit, howMany)
    }
  },
  render() {
    return this.$scopedSlots.default({
      date: this.internalDate,
      dateProps: {
        value: this.internalDate
      },
      dateEvents: {
        input: e => (this.internalDate = new Date(e.target.value))
      },
      isCurrentInterval: this.isCurrentInterval,
      startDate: this.internalStartDate,
      endDate: this.internalEndDate,
      interval: this.internalInterval,
      eachDay: this.eachDay,
      setDate: this.setDate,
      add: this.add,
      sub: this.sub
    })
  }
}
</script>
