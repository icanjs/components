## Slots

The default slot will receive the following props:

- **date** : The primary date
- **dateProps**: for binding the date to an input `v-bind="dateProps"`
- **dateEvents**: for binding the date to an input `v-on="dateEvents"`
- **isCurrentInterval** {Boolean}: true if the current interval contains today's date
- **startDate** {Date}: The interval's start date.
- **endDate** {Date}: The interval's end date.
- **interval** {Interval}: An interval object (see [date-fns Interval](https://date-fns.org/v2.0.0-alpha.27/docs/Interval))
- **eachDay** {Array}: An array of strings containing each day of the current interval (see [date-fns eachDayOfInterval](https://date-fns.org/v2.0.0-alpha.27/docs/eachDayOfInterval))
- **setDate** {Function} Set the internal date to a specific date. See the methods documentation
- **add** {Function} Add time to the internal date. See the methods documentation
- **sub** {Function} Subtract time from the internal date. See the methods documentation

## Examples

```vue
<styleguide-data v-slot="{ paginateDates }">
  <div>
    <div class="pb-5">
      <h3>Pick a unit:</h3>
      <div class="flex mb-4">
        <button :class="[paginateDates.unit === 'second' ? 'bg-blue-light' : 'bg-blue']" class="hover:bg-blue-light text-white font-bold py-2 px-4 rounded-tl-lg rounded-bl-lg" @click="paginateDates.unit = 'second'">Second</button>
        <button :class="[paginateDates.unit === 'minute' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="paginateDates.unit = 'minute'">Minute</button>
        <button :class="[paginateDates.unit === 'hour' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="paginateDates.unit = 'hour'">Hour</button>
        <button :class="[paginateDates.unit === 'day' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="paginateDates.unit = 'day'">Day</button>
        <button :class="[paginateDates.unit === 'week' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="paginateDates.unit = 'week'">Week</button>
        <button :class="[paginateDates.unit === 'month' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="paginateDates.unit = 'month'">Month</button>
        <button :class="[paginateDates.unit === 'quarter' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="paginateDates.unit = 'quarter'">Quarter</button>
        <button :class="[paginateDates.unit === 'year' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 rounded-tr-lg rounded-br-lg" @click="paginateDates.unit = 'year'">Year</button>
      </div>

      <h3>Enter a multiplier</h3>
      <input min="1" v-model="paginateDates.multiplier" class="rounded bg-grey-lighter p-2" type="number" />

      <h3 class="mt-3">Projection Direction</h3>
      <div class="flex mb-4">
        <button :class="[paginateDates.projectionDirection === 'back' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 rounded-tl-lg rounded-bl-lg" @click="paginateDates.projectionDirection = 'back'">Back</button>
        <button :class="[paginateDates.projectionDirection === 'forward' ? 'bg-blue-light' : 'bg-blue']" class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 rounded-tr-lg rounded-br-lg" @click="paginateDates.projectionDirection = 'forward'">Forward</button>
      </div>

      <h3>Week starts on</h3>
      <div class="inline-block relative w-64">
        <select class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" v-model="paginateDates.weekStartsOn">
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
        </select>
        <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>

    <h2>In Parent Component</h2>
    <table class="w-full">
      <tbody>
        <tr>
          <td>Start Date</td>
          <td>{{paginateDates.startDate}}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>{{paginateDates.date}}</td>
        </tr>
        <tr>
          <td>End Date</td>
          <td>{{paginateDates.endDate}}</td>
        </tr>
      </tbody>
    </table>

    <paginate-dates
      class="mt-5"
      v-model="paginateDates.date"
      :start-date.sync="paginateDates.startDate"
      :end-date.sync="paginateDates.endDate"
      :unit="paginateDates.unit"
      :multiplier="paginateDates.multiplier"
      :projection-direction="paginateDates.projectionDirection"
      :week-starts-on="paginateDates.weekStartsOn"
      v-slot="{ date, add, sub }"
    >
      <div>
        <h2>Inside Default Slot</h2>
        <table class="w-full">
          <tbody>
            <tr>
              <td>Date</td>
              <td>{{date}}</td>
            </tr>
          </tbody>
        </table>

        <div class="flex">
          <button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 rounded-tl-lg rounded-bl-lg" @click="sub(1, 'month')">-1M</button>
          <button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="sub(1, 'week')">-1Wk</button>
          <button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 mr-1" @click="sub(1, 'day')">-1D</button>
          <button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="add(1, 'day')">+1D</button>
          <button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4" @click="add(1, 'week')">+1Wk</button>
          <button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 rounded-tr-lg rounded-br-lg" @click="add(1, 'month')">+1M</button>
        </div>
      </div>
    </paginate-dates>
  </div>
</styleguide-data>
```