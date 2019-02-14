import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import PaginateDates from './PaginateDates.vue'

describe('PaginateDates.vue', () => {
  it('Uses now as default date', () => {
    const wrapper = shallowMount(PaginateDates, {
      propsData: {},
      scopedSlots: {
        default: function(props) {
          return this.$createElement('div', props.date)
        }
      }
    })
    const { vm } = wrapper
    const vmDateString = vm.date.toString()
    const nowString = new Date().toString()
    assert.equal(vmDateString, nowString, `date should be today's date`)
  })

  it('emits update:interval event properly', () => {
    const wrapper = shallowMount(PaginateDates, {
      propsData: {
        interval: null,
        date: new Date(2019, 1, 6)
      },
      scopedSlots: {
        default: function(props) {
          return this.$createElement('div', props.date)
        }
      }
    })
    const emitted = wrapper.emitted()

    assert(emitted['update:startDate'], 'update:startDate was emitted')
    assert(emitted['update:endDate'], 'update:endDate was emitted')

    const events_updateInterval = emitted['update:interval']

    assert.equal(
      events_updateInterval.length,
      1,
      'should have only called update:interval once'
    )

    const eventArgs = events_updateInterval[0]
    const interval = eventArgs[0]
    const expectedInterval = {
      start: new Date(2019, 1, 3),
      end: new Date('Sat Feb 09 2019 23:59:59.999')
    }

    assert.deepEqual(interval, expectedInterval)
  })

  it('exports correct props', () => {
    const expectedEachDay = [
      new Date(2019, 1, 3),
      new Date(2019, 1, 4),
      new Date(2019, 1, 5),
      new Date(2019, 1, 6),
      new Date(2019, 1, 7),
      new Date(2019, 1, 8),
      new Date(2019, 1, 9)
    ]

    shallowMount(PaginateDates, {
      propsData: {
        date: new Date(2019, 1, 7)
      },
      scopedSlots: {
        default: function(props) {
          const expectedProps = [
            'date',
            'dateProps',
            'dateEvents',
            'isCurrentInterval',
            'startDate',
            'endDate',
            'interval',
            'eachDay',
            'setDate',
            'add',
            'sub'
          ]
          const {
            dateProps,
            dateEvents,
            startDate,
            endDate,
            interval,
            eachDay,
            setDate,
            add,
            sub
          } = props

          assert.deepEqual(Object.keys(props), expectedProps)
          assert.equal(
            dateProps.value.toString(),
            'Thu Feb 07 2019 00:00:00 GMT-0700 (MST)',
            'date should have been set to today by default'
          )
          assert.equal(typeof dateEvents.input, 'function')
          assert.equal(startDate.getTime(), 1549177200000)
          assert.equal(endDate.getTime(), 1549781999999)
          assert.equal(interval.start, startDate)
          assert.equal(interval.end, endDate)
          assert.equal(eachDay.length, 7)
          assert.deepEqual(eachDay, expectedEachDay)
          assert.equal(typeof setDate, 'function')
          assert.equal(typeof add, 'function')
          assert.equal(typeof sub, 'function')

          return this.$createElement('div', props.date)
        }
      }
    })
  })

  it('calculates startDate and endDate', () => {
    const decisionTable = [
      {
        date: new Date(2019, 1, 6),
        unit: 'week',
        multiplier: 1,
        projectionDirection: 'back',
        startDate: new Date(2019, 1, 3),
        endDate: new Date('Sat Feb 09 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'week',
        multiplier: 2,
        projectionDirection: 'back',
        startDate: new Date(2019, 0, 27),
        endDate: new Date('Feb 09 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'week',
        multiplier: 3,
        projectionDirection: 'back',
        startDate: new Date(2019, 0, 20),
        endDate: new Date('Feb 09 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'week',
        multiplier: 1,
        projectionDirection: 'forward',
        startDate: new Date(2019, 1, 3),
        endDate: new Date('Sat Feb 09 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'week',
        multiplier: 2,
        projectionDirection: 'forward',
        startDate: new Date(2019, 1, 3),
        endDate: new Date('Sat Feb 16 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'week',
        multiplier: 3,
        projectionDirection: 'forward',
        startDate: new Date(2019, 1, 3),
        endDate: new Date('Sat Feb 23 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'day',
        multiplier: 1,
        projectionDirection: 'back',
        startDate: new Date(2019, 1, 6),
        endDate: new Date('Wed Feb 06 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'day',
        multiplier: 2,
        projectionDirection: 'back',
        startDate: new Date(2019, 1, 5),
        endDate: new Date('Wed Feb 06 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'day',
        multiplier: 3,
        projectionDirection: 'back',
        startDate: new Date(2019, 1, 4),
        endDate: new Date('Wed Feb 06 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'day',
        multiplier: 1,
        projectionDirection: 'forward',
        startDate: new Date(2019, 1, 6),
        endDate: new Date('Wed Feb 06 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'day',
        multiplier: 2,
        projectionDirection: 'forward',
        startDate: new Date(2019, 1, 6),
        endDate: new Date('Wed Feb 07 2019 23:59:59')
      },
      {
        date: new Date(2019, 1, 6),
        unit: 'day',
        multiplier: 3,
        projectionDirection: 'forward',
        startDate: new Date(2019, 1, 6),
        endDate: new Date('Wed Feb 08 2019 23:59:59')
      }
    ]

    decisionTable.forEach(
      ({ date, unit, multiplier, projectionDirection, startDate, endDate }) => {
        const wrapper = shallowMount(PaginateDates, {
          propsData: { date, unit, multiplier, projectionDirection },
          scopedSlots: {
            default: function(props) {
              return this.$createElement('div', props.date)
            }
          }
        })
        const { vm } = wrapper

        assert.equal(
          vm.internalStartDate.toString(),
          startDate.toString(),
          `startDate mismatch for unit ${unit}, multiplier ${multiplier}, projectionDirection ${projectionDirection}`
        )
        assert.equal(
          vm.internalEndDate.toString(),
          endDate.toString(),
          `endDate mismatch for unit ${unit}, multiplier ${multiplier}, projectionDirection ${projectionDirection}`
        )
      }
    )
  })

  it('can add and sub properly', () => {
    const decisionTable = [
      {
        date: new Date(2019, 1, 7),
        method: 'add',
        howMany: undefined,
        unit: undefined,
        expected: new Date(2019, 1, 14)
      },
      {
        date: new Date(2019, 1, 7),
        method: 'add',
        howMany: undefined,
        unit: 'day',
        expected: new Date(2019, 1, 8)
      },
      {
        date: new Date(2019, 1, 7),
        method: 'sub',
        howMany: undefined,
        unit: undefined,
        expected: new Date(2019, 0, 31)
      },
      {
        date: new Date(2019, 1, 7),
        method: 'sub',
        howMany: 1,
        unit: undefined,
        expected: new Date(2019, 0, 31)
      },
      {
        date: new Date(2019, 1, 7),
        method: 'sub',
        howMany: 1,
        unit: 'day',
        expected: new Date(2019, 1, 6)
      },
      {
        date: new Date(2019, 1, 7),
        method: 'sub',
        howMany: 2,
        unit: 'days',
        expected: new Date(2019, 1, 5)
      },
      {
        date: new Date(2019, 1, 7),
        method: 'add',
        howMany: 1,
        unit: 'day',
        expected: new Date(2019, 1, 8)
      }
    ]

    decisionTable.forEach(({ date, method, howMany, unit, expected }) => {
      const wrapper = shallowMount(PaginateDates, {
        propsData: { date },
        scopedSlots: {
          default: function(props) {
            return this.$createElement('div', props.date)
          }
        }
      })
      const { vm } = wrapper

      vm[method](howMany, unit)

      assert.equal(
        vm.internalDate.toString(),
        expected.toString(),
        `should have added ${howMany} ${unit}s`
      )
    })
  })
})
