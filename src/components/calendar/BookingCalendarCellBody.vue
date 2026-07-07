<template>
  <template v-for="data in splicedCellData" :key="data?.identifier">
    <div
      :id="`cell-body-row-${data?.identifier}`"
      class="project-calendar-logistic"
      :style="getJobStyle(data)"
      @click="onCellRowSelect($event, data)"
    >
      <!-- [{{ data.logisticType?.short ?? "" }}] {{ data.order?.reference }} | {{ data.expectedStartTime ?? "" }} - {{ data.expectedEndTime ?? "" }} -->
      <span class="logistic-cell-type"
        >[{{ data.logisticType?.short ?? "" }}]</span
      >
      <span class="logistic-cell-order">
        {{ data.order?.reference }} - {{ data.order?.job?.title ?? "" }}
      </span>
    </div>
  </template>
  <Button
    v-if="rowOverflowCount"
    class="p-button-link"
    @click="toggleAllLogisticsPanel"
    ><b>{{ rowOverflowCount }} more...</b></Button
  >
  <OverlayPanel
    ref="project-calendar-op"
    :dismissable="true"
    class="logistic-date-overlay"
  >
    <LogisticDetailsPopup v-if="logistic" :logisticDate="logistic" />
  </OverlayPanel>
  <OverlayPanel
    ref="all-logistics-overlay"
    :dismissable="true"
    class="all-logistics-overlay"
  >
    <div class="all-logistics-panel">
      <template v-for="data in filteredData" :key="data?.identifier">
        <div
          :id="`cell-body-row-${data?.identifier}`"
          class="project-calendar-logistic"
          :style="getJobStyle(data)"
          @click="onCellRowSelect($event, data)"
        >
          <!-- [{{ data.logisticType?.short ?? "" }}] {{ data.order?.reference }} | {{ data.expectedStartTime ?? "" }} - {{ data.expectedEndTime ?? "" }} -->
          <span class="logistic-cell-type"
            >[{{ data.logisticType?.short ?? "" }}]</span
          >
          <span class="logistic-cell-order">
            {{ data.order?.reference }} - {{ data.order?.job?.title ?? "" }}
          </span>
        </div>
      </template>
    </div>
  </OverlayPanel>
</template>

<script>
  import { getContrast } from '@/utils/ColourUtils'
  export default {
    props: {
      date: {
        required: true,
        type: Object,
      },
      calendarData: {
        required: true,
        type: Object,
      },
      maxRowsDisplayed: {
        required: false,
        type: Number,
        default: 3,
      },
      //DONT DEPLOY, colours should be added to response for calendarData
      pmColours: {
        required: true,
        type: Object,
      },
      filters: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        overlayVisible: false,
        logistic: null,
      };
    },
    computed: {
      cellData() {
        let { day, month, year } = this.date;
        let dateObj = new Date(year, month, day);
        let key = moment(dateObj).format("DD-MM-YYYY");
        let data = this.calendarData[key];
        return data ?? [];
      },
      filteredData() {
        return this.cellData.filter(l => {
            return this.filters.logisticTypeIdentifiers.includes(l.logisticType?.identifier)
                && this.filters.projectManagerIdentifiers.includes(l.order?.projectManager?.identifier);
        })
      },
      rowOverflowCount() {
        if (this.filteredData?.length > this.maxRowsDisplayed)
          return this.filteredData.length - this.maxRowsDisplayed;
        else return 0;
      },
      splicedCellData() {
        //Shallow copy, nested objects possess original references
        if (this.filteredData?.length > this.maxRowsDisplayed) {
          let t = this.filteredData.slice(0, this.maxRowsDisplayed);
          return t;
        } else return this.filteredData;
      },
      order() {
        return this.logistic?.order ?? null;
      }
    },
    methods: {
      getJobStyle(job) {
        const background = '#' + (job?.order?.projectManager?.colour ?? '5E5E5E');
        return {
          'background-color': background,
          'color': getContrast(background),
        }
      },
      onCellRowSelect(event, data) {
        this.logistic = data;
        this.toggleOverlayPanel(event);
      },
      toggleOverlayPanel(event) {
        this.$refs["project-calendar-op"].toggle(event);
      },
      toggleAllLogisticsPanel(event) {
        this.$refs["all-logistics-overlay"].toggle(event);
      },
    },
  };
</script>