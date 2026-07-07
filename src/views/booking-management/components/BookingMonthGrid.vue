<script setup lang="ts">
import { computed } from 'vue';
import {
  buildMonthCells,
  eventsForDate,
  eventColour,
  formatYMD,
  type FlatBookingEvent
} from '@/views/booking-management/utils/bookingCalendarUtils';

const props = defineProps<{
  anchorDate: Date;
  events: FlatBookingEvent[];
  /** Highlight this calendar day (YYYY-MM-DD). */
  selectedYmd?: string | null;
}>();

function isCellSelected(cell: { date: Date }) {
  return props.selectedYmd != null && props.selectedYmd !== '' && formatYMD(cell.date) === props.selectedYmd;
}

const emit = defineEmits<{
  'select-date': [date: Date];
  'select-event': [ev: FlatBookingEvent];
}>();

const MAX_VISIBLE = 4;

const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const cells = computed(() => buildMonthCells(props.anchorDate));

function listForCell(cell: { date: Date }) {
  return eventsForDate(props.events, cell.date);
}

function visibleForCell(cell: { date: Date }) {
  return listForCell(cell).slice(0, MAX_VISIBLE);
}

function extraCount(cell: { date: Date }) {
  const n = listForCell(cell).length;
  return n > MAX_VISIBLE ? n - MAX_VISIBLE : 0;
}

function timeLabel(ev: FlatBookingEvent) {
  const d = new Date(ev.startMs);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function chipStyle(id: string) {
  const c = eventColour(id);
  return { backgroundColor: c.bg, color: c.fg };
}
</script>

<template>
  <div class="booking-month-grid rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden bg-surface-0 dark:bg-surface-900">
    <div class="grid grid-cols-7 gap-px bg-surface-200 dark:bg-surface-700">
      <div
        v-for="wd in weekLabels"
        :key="wd"
        class="bg-surface-100 dark:bg-surface-800 px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-surface-600 dark:text-surface-300"
      >
        {{ wd }}
      </div>
      <div
        v-for="(cell, idx) in cells"
        :key="idx"
        class="min-h-[6.5rem] bg-surface-0 dark:bg-surface-900 p-1 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer rounded-sm"
        :class="[
          !cell.isCurrentMonth ? 'opacity-60' : '',
          isCellSelected(cell) ? 'booking-month-cell--selected' : ''
        ]"
        role="button"
        tabindex="0"
        @click="emit('select-date', cell.date)"
        @keydown.enter.prevent="emit('select-date', cell.date)"
      >
        <div
          class="w-full pt-[5px] text-center text-sm font-medium leading-none"
          :class="cell.isCurrentMonth ? 'text-surface-900 dark:text-surface-0' : 'text-surface-400'"
        >
          {{ cell.date.getDate() }}
        </div>
        <div class="mt-1 flex flex-col gap-0.5 overflow-hidden">
          <button
            v-for="ev in visibleForCell(cell)"
            :key="ev.id"
            type="button"
            class="w-full truncate rounded px-1 py-0.5 text-left text-xs font-medium leading-tight shadow-sm transition-opacity hover:opacity-90"
            :style="chipStyle(ev.id)"
            @click.stop="emit('select-event', ev)"
          >
            <span v-if="!ev.allDay" class="opacity-90">{{ timeLabel(ev) }} </span>
            {{ ev.title || ev.label }} 
          </button>
          <div v-if="extraCount(cell) > 0" class="text-[10px] font-medium text-primary pl-0.5">
            +{{ extraCount(cell) }} more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.booking-month-cell--selected {
  box-shadow: inset 0 0 0 1px #c1c1c1;
  z-index: 1;
}

:global(.app-dark) .booking-month-cell--selected {
  box-shadow: inset 0 0 0 1px #c1c1c1;
}
</style>
