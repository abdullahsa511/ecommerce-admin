<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import _ from 'lodash';
import BookingCalendarCellBody from './BookingCalendarCellBody.vue';
import { parseDateString, formatTime } from '@/utils/DateUtil';
import { createQueryString, parseQueryString } from '@/utils/SearchUtils';

const route = useRoute();
const router = useRouter();

/** Populated when wired to your global/API layer (replaces legacy Vuex global module). */
const logisticTypes = ref<{ name: string; identifier: string; short: string }[]>([]);
const projectManagers = ref<{ name: string; identifier: string }[]>([]);
const activeUser = ref<{ identifier: string } | null>(null);

const today = ref(new Date());
const year = ref(route.query.year ? Number(route.query.year) : new Date().getFullYear());
const month = ref(route.query.month ? Number(route.query.month) : new Date().getMonth());
const calendarData = ref<Record<number, Record<number, Record<string, unknown[]>>>>({});
const loading = ref(false);
const colourSet = ['pm-blue', 'pm-purple', 'pm-red', 'pm-star', 'pm-turquoise'];
const pmColours = ref<Record<string, string>>({});
const filters = ref({
  logisticTypeIdentifiers: [] as string[],
  projectManagerIdentifiers: [] as string[]
});
const loadedFilters = ref<
  Record<number, Record<number, { logisticTypeIdentifiers: string[]; projectManagerIdentifiers: string[] }>>
>({});

const monthData = computed(() => calendarData.value?.[year.value]?.[month.value]);

const selectedTypesLabel = computed(() => {
  if (filters.value.logisticTypeIdentifiers.length === logisticTypes.value.length) {
    return 'All';
  }
  return `${filters.value.logisticTypeIdentifiers.length} selected`;
});

const selectedManagersLabel = computed(() => {
  if (filters.value.projectManagerIdentifiers.length === projectManagers.value.length) {
    return 'All';
  }
  return `${filters.value.projectManagerIdentifiers.length} selected`;
});

function parseAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message;
  }
  return String(error);
}

function getDefaultLogisticTypes() {
  return (logisticTypes.value ?? []).filter((t) => ['ID', 'I', 'CI', 'WI'].includes(t.short)).map((t) => t.identifier);
}

function getDayName(date: { year: number; month: number; day: number }) {
  const dateObj = new Date(date.year, date.month, date.day);
  return dateObj.toLocaleString('default', { weekday: 'long' });
}

function pushRouteParams() {
  void router.push(
    '/logistics/project-calendar?' +
      createQueryString({
        year: year.value,
        month: month.value,
        logisticTypeIdentifiers: filters.value.logisticTypeIdentifiers,
        projectManagerIdentifiers: filters.value.projectManagerIdentifiers
      })
  );
}

function getProjectCalendar(
  y: number,
  m: number,
  logisticTypeIdentifiers: string[],
  projectManagerIdentifiers: string[],
  add = false
) {
  year.value = y;
  month.value = m;
  today.value = new Date(year.value, month.value, 1);
  return new Promise<void>((resolve) => {
    loadProjectData(y, m, logisticTypeIdentifiers, projectManagerIdentifiers, add)
      .then(() => {
        pushRouteParams();
      })
      .finally(() => resolve());
  });
}

function groupAndParseDates(data: unknown[]) {
  const mappedData: Record<string, unknown[]> = {};
  _.forEach(data, (item) => {
    const d = item as Record<string, unknown>;
    const dateKey = d.date as string;
    if (!mappedData[dateKey]) mappedData[dateKey] = [];
    d['dateParsed'] = parseDateString(dateKey);
    if (d['actualStart']) {
      d['actualStartParsed'] = parseDateString(d['actualStart'] as string);
      d['actualStartTime'] = formatTime(d['actualStart'] as string);
    }
    if (d['actualEnd']) {
      d['actualEndParsed'] = parseDateString(d['actualEnd'] as string);
      d['actualEndTime'] = formatTime(d['actualEnd'] as string);
    }
    if (d['expectedStart']) {
      d['expectedStartParsed'] = parseDateString(d['expectedStart'] as string);
      d['expectedStartTime'] = formatTime(d['expectedStart'] as string);
    }
    if (d['expectedStart']) {
      d['expectedEndParsed'] = parseDateString(d['expectedEnd'] as string);
      d['expectedEndTime'] = formatTime(d['expectedEnd'] as string);
    }
    const order = d.order as { projectManager?: { fullName?: string } } | undefined;
    if (!pmColours.value[order?.projectManager?.fullName ?? '']) {
      const ran = Math.floor(Math.random() * colourSet.length);
      pmColours.value[order?.projectManager?.fullName ?? ''] = colourSet[ran];
    }
    mappedData[dateKey].push(d);
  });
  return mappedData;
}

function orderByDate(data: Record<string, unknown[]>) {
  const dateKeys = Object.keys(data);
  for (let i = 0; i < dateKeys.length; i++) {
    if (data[dateKeys[i]]?.length > 1)
      data[dateKeys[i]].sort((a: unknown, b: unknown) => {
        const rowA = a as { expectedStartParsed?: Date };
        const rowB = b as { expectedStartParsed?: Date };
        if (!rowA?.expectedStartParsed && !rowB?.expectedStartParsed) return 0;
        if (!rowA?.expectedStartParsed) return 1;
        if (!rowB?.expectedStartParsed) return -1;
        return rowA.expectedStartParsed.getTime() - rowB.expectedStartParsed.getTime();
      });
  }
  return data;
}

function mergeMonthData(existingData: Record<string, unknown[]>, newData: Record<string, unknown[]>) {
  const merged: Record<string, unknown[]> = {};
  const dates = _.uniq(Object.keys(existingData).concat(Object.keys(newData)));
  for (const date of dates) {
    merged[date] = (existingData[date] ?? []).concat(newData[date] ?? []);
  }
  return merged;
}

function loadProjectData(
  y: number,
  m: number,
  logisticTypeIdentifiers: string[],
  projectManagerIdentifiers: string[],
  add: boolean
) {
  return new Promise<void>((resolve, reject) => {
    loading.value = true;
    axios
      .post('/api/logistics/project-calendar?per_page=2000', {
        year: y,
        month: m + 1,
        logisticTypeIdentifiers,
        projectManagerIdentifiers
      })
      .then((response) => {
        const groupedData = groupAndParseDates(response?.data?.data ?? []);
        calendarData.value[y] = calendarData.value[y] ?? {};
        if (add) {
          calendarData.value[y][m] = calendarData.value[y][m] ?? {};
          const mergedData = mergeMonthData(
            calendarData.value[y][m] as Record<string, unknown[]>,
            groupedData
          );
          calendarData.value[y][m] = orderByDate(mergedData);
        } else {
          const orderedData = orderByDate(groupedData);
          calendarData.value[y][m] = orderedData;
        }
        loadedFilters.value[y] = loadedFilters.value[y] ?? {};
        loadedFilters.value[y][m] = { ...filters.value };
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(parseAxiosError(error));
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

function onMonthChange(event: { year: number; month: number }) {
  void onDateChange(event);
}

function onYearChange(event: { year: number; month: number }) {
  void onDateChange(event);
}

function onDateChange({ year: y, month: mo }: { year: number; month: number }) {
  return new Promise<void>((resolve) => {
    const notLoadedTypes = _.difference(
      filters.value.logisticTypeIdentifiers,
      loadedFilters.value[y]?.[mo]?.logisticTypeIdentifiers ?? []
    );
    const notLoadedManagers = _.difference(
      filters.value.projectManagerIdentifiers,
      loadedFilters.value[y]?.[mo]?.projectManagerIdentifiers ?? []
    );
    if (notLoadedTypes.length && notLoadedManagers.length) {
      void getProjectCalendar(y, mo, filters.value.logisticTypeIdentifiers, filters.value.projectManagerIdentifiers, true).then(
        () => resolve()
      );
    } else if (notLoadedTypes.length) {
      void getProjectCalendar(y, mo, notLoadedTypes, filters.value.projectManagerIdentifiers, true).then(() => resolve());
    } else if (notLoadedManagers.length) {
      void getProjectCalendar(y, mo, filters.value.logisticTypeIdentifiers, notLoadedManagers, true).then(() => resolve());
    } else {
      year.value = y;
      month.value = mo;
      today.value = new Date(year.value, month.value, 1);
      pushRouteParams();
      resolve();
    }
  });
}

function onLogisticTypeSelect() {
  const notLoadedTypes = _.difference(
    filters.value.logisticTypeIdentifiers,
    loadedFilters.value[year.value]?.[month.value]?.logisticTypeIdentifiers ?? []
  );
  if (notLoadedTypes.length)
    void getProjectCalendar(year.value, month.value, notLoadedTypes, filters.value.projectManagerIdentifiers, true);
  else pushRouteParams();
}

function onProjectManagerSelect() {
  const notLoadedManagers = _.difference(
    filters.value.projectManagerIdentifiers,
    loadedFilters.value[year.value]?.[month.value]?.projectManagerIdentifiers ?? []
  );
  if (notLoadedManagers.length)
    void getProjectCalendar(year.value, month.value, filters.value.logisticTypeIdentifiers, notLoadedManagers, true);
  else pushRouteParams();
}

function initFromRouteAndQuery() {
  if (year.value !== today.value.getFullYear() || month.value !== today.value.getMonth()) {
    today.value = new Date(year.value, month.value, 1);
  }
  const params = parseQueryString(window.location.search) as {
    logisticTypeIdentifiers?: string[];
    projectManagerIdentifiers?: string[];
  };
  if (params.logisticTypeIdentifiers?.length) {
    filters.value.logisticTypeIdentifiers = [...params.logisticTypeIdentifiers];
  } else if (logisticTypes.value?.length) {
    filters.value.logisticTypeIdentifiers = getDefaultLogisticTypes();
  }
  if (params.projectManagerIdentifiers?.length) {
    filters.value.projectManagerIdentifiers = [...params.projectManagerIdentifiers];
  } else if (projectManagers.value?.length && activeUser.value) {
    if (_.findIndex(projectManagers.value, { identifier: activeUser.value.identifier }) !== -1) {
      filters.value.projectManagerIdentifiers = [activeUser.value.identifier];
    }
  }
  if (filters.value.logisticTypeIdentifiers?.length && filters.value.projectManagerIdentifiers?.length) {
    void getProjectCalendar(
      year.value,
      month.value,
      filters.value.logisticTypeIdentifiers,
      filters.value.projectManagerIdentifiers
    );
  }
}

watch(logisticTypes, () => {
  if (!filters.value.logisticTypeIdentifiers?.length) {
    filters.value.logisticTypeIdentifiers = getDefaultLogisticTypes();
  }
  if (
    filters.value.projectManagerIdentifiers?.length &&
    !calendarData.value[year.value] &&
    !loading.value
  ) {
    void getProjectCalendar(
      year.value,
      month.value,
      filters.value.logisticTypeIdentifiers,
      filters.value.projectManagerIdentifiers
    );
  }
});

watch(projectManagers, () => {
  if (!filters.value.projectManagerIdentifiers?.length && activeUser.value) {
    if (_.findIndex(projectManagers.value, { identifier: activeUser.value.identifier }) !== -1) {
      filters.value.projectManagerIdentifiers = [activeUser.value.identifier];
      if (filters.value.logisticTypeIdentifiers?.length && !calendarData.value[year.value] && !loading.value) {
        void getProjectCalendar(
          year.value,
          month.value,
          filters.value.logisticTypeIdentifiers,
          filters.value.projectManagerIdentifiers
        );
      }
    }
  }
});

onMounted(() => {
  initFromRouteAndQuery();
});
</script>

<template>
    <div class="project-calendar-page">
      <!-- PrimeVue BUG: monthNavigator, yearNavigator props return inconsistent month integers -->
      <div class="project-calendar-filters">
        <div class="p-formgroup-inline">
          <div class="p-field">
            <label>Logistic Types</label>
            <PrimevueMultiSelect
              v-model="filters.logisticTypeIdentifiers"
              :options="logisticTypes"
              optionLabel="name"
              optionValue="identifier"
              @change="onLogisticTypeSelect"
            >
              <template #value>
                {{ selectedTypesLabel }}
              </template>
            </PrimevueMultiSelect>
          </div>
          <div class="p-field">
            <label>Project Managers</label>
            <PrimevueMultiSelect
              v-model="filters.projectManagerIdentifiers"
              :options="projectManagers"
              optionLabel="name"
              optionValue="identifier"
              @change="onProjectManagerSelect"
            >
              <template #value>
                {{ selectedManagersLabel }}
              </template>
            </PrimevueMultiSelect>
          </div>
        </div>
      </div>
      <div class="project-calendar-container">
        <Calendar :modelValue="today" :inline="true" @month-change="onMonthChange($event)" @year-change="onYearChange($event)">
          <template #date="{ date }">
            <div class="project-calendar-cell" :style="[loading ? 'opacity: 0.3;' : 'opacity: 1;']">
              <div class="cell-header">
                <span class="date-header-day-name">{{ getDayName(date) }}&nbsp;</span>{{ date.day }}
              </div>
              <div v-if="monthData" class="cell-body">
                <!-- DONT DEPLOY, colours should be added to response for calendarData -->
                <BookingCalendarCellBody
                  :date="date"
                  :calendarData="monthData"
                  :maxRowsDisplayed="5"
                  :pmColours="pmColours"
                  :filters="filters"
                />
              </div>
            </div>
          </template>
        </Calendar>
        <div class="panel-loader" v-if="loading">
          <ProgressSpinner />
        </div>
      </div>
    </div>
  </template>
