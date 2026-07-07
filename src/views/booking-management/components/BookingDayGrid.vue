<template>
  <div
    class="booking-day-grid rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 overflow-hidden flex flex-col gap-4 shrink-0"
  >
    <div
      class="booking-day-heading flex border-b border-surface-200 dark:border-surface-700 px-5 py-4 text-base font-semibold text-surface-700 dark:text-surface-200"
    >
      {{ dayTitle }}
    </div>
    <div class="booking-day-time-body flex shrink-0 px-3 pb-3 pt-4">
      <div
        class="w-[4.75rem] sm:w-20 flex-shrink-0 border-r border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-right pr-2 text-xs text-surface-500 select-none"
      >
        <div v-for="h in hourRange" :key="'l' + h" :style="{ height: pxPerHour + 'px' }" class="relative">
          <span class="absolute -top-2 right-0">{{ formatHourLabel(h) }}</span>
        </div>
      </div>
      <div
        ref="gridBody"
        class="relative flex-1 overflow-hidden bg-surface-0 dark:bg-surface-900"
        @click="onGridClick"
      >
        <!-- hour lines -->
        <div class="relative" :style="{ height: totalPx + 'px' }">
          <div
            v-for="h in hourRange"
            :key="'r' + h"
            class="absolute left-0 right-0 border-b border-surface-100 dark:border-surface-800"
            :style="{ top: (h - dayStartHour) * pxPerHour + 'px', height: pxPerHour + 'px' }"
          />
          <!-- now line -->
          <div
            v-if="nowLineTop !== null"
            class="absolute left-0 right-0 z-20 pointer-events-none border-t-2 border-red-500"
            :style="{ top: nowLineTop + 'px' }"
          />
          <!-- selected empty slot / range highlight -->
          <div
            v-if="slotHighlightStyle"
            class="booking-day-slot-highlight absolute left-1 right-1 z-[8] pointer-events-none rounded-md"
            :style="slotHighlightStyle"
            aria-hidden="true"
          />
          <!-- events -->
          <button
            v-for="block in positioned"
            :key="block.ev.id"
            type="button"
            class="absolute left-1 right-1 z-10 rounded-md px-2 py-1 text-left text-xs font-medium shadow-md overflow-hidden border border-white/10"
            :style="block.boxStyle"
            @click.stop="emit('select-event', block.ev)"
          >
            <div class="font-semibold leading-tight">{{ block.ev.label || block.ev.title }}</div>
            <div class="opacity-90 text-[10px] mt-0.5">{{ block.rangeLabel }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { eventsOverlappingDay, eventColour, formatYMD, type FlatBookingEvent } from '@/views/booking-management/utils/bookingCalendarUtils';

const props = defineProps<{
  day: Date;
  events: FlatBookingEvent[];
  /** Highlight a time range on this day (minutes from midnight). */
  selectedSlot?: { ymd: string; startMin: number; endMin: number } | null;
}>();

const emit = defineEmits<{
  'select-slot': [payload: { date: Date; minutesFromMidnight: number }];
  'select-event': [ev: FlatBookingEvent];
}>();

const gridBody = ref<HTMLElement | null>(null);
const nowMs = ref(Date.now());

/** Pixels per hour (Google Calendar–like density). */
const pxPerHour = 52;
/** Visible day window: 8:00 AM – 7:00 PM (local), 11 hours, no scroll. */
const dayStartHour = 8;
const dayEndHour = 19;
const slotMinutes = 15;

const hourRange = computed(() => {
  const r: number[] = [];
  for (let h = dayStartHour; h < dayEndHour; h++) r.push(h);
  return r;
});

const totalPx = computed(() => (dayEndHour - dayStartHour) * pxPerHour);

const dayTitle = computed(() =>
  props.day.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
);

const dayEvents = computed(() => eventsOverlappingDay(props.events, props.day));

const dayStartMs = computed(() => {
  const d = props.day;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), dayStartHour, 0, 0, 0).getTime();
});

const nowLineTop = computed(() => {
  void nowMs.value;
  const ymd = formatYMD(props.day);
  const today = formatYMD(new Date(nowMs.value));
  if (ymd !== today) return null;
  const now = nowMs.value;
  const mins = (now - dayStartMs.value) / 60000;
  if (mins < 0 || mins > (dayEndHour - dayStartHour) * 60) return null;
  return (mins / 60) * pxPerHour;
});

const slotHighlightStyle = computed(() => {
  if (!props.selectedSlot) return null;
  if (formatYMD(props.day) !== props.selectedSlot.ymd) return null;
  const gridStartMinFromMidnight = dayStartHour * 60;
  const spanMin = (dayEndHour - dayStartHour) * 60;
  const startOff = Math.max(0, props.selectedSlot.startMin - gridStartMinFromMidnight);
  const endOff = Math.min(
    spanMin,
    Math.max(startOff + 1, props.selectedSlot.endMin - gridStartMinFromMidnight)
  );
  if (endOff <= startOff) return null;
  const top = (startOff / 60) * pxPerHour;
  const height = Math.max(((endOff - startOff) / 60) * pxPerHour, 8);
  return {
    top: `${top}px`,
    height: `${height}px`
  };
});

const positioned = computed(() => {
  const start = dayStartMs.value;
  const spanMin = (dayEndHour - dayStartHour) * 60;
  const dayEndMs = start + spanMin * 60 * 1000;
  return dayEvents.value.flatMap((ev) => {
    const startMsClipped = Math.max(ev.startMs, start);
    const endMsClipped = Math.min(ev.endMs, dayEndMs);
    if (endMsClipped <= startMsClipped) return [];
    const startMin = Math.max(0, (startMsClipped - start) / 60000);
    const endMin = Math.min(spanMin, (endMsClipped - start) / 60000);
    const dur = Math.max(endMin - startMin, slotMinutes);
    const top = (startMin / 60) * pxPerHour;
    const height = Math.max((dur / 60) * pxPerHour, 22);
    const c = eventColour(ev.id);
    const s = new Date(ev.startMs);
    const e = new Date(ev.endMs);
    const rangeLabel = `${s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })} – ${e.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    return [
      {
        ev,
        rangeLabel,
        boxStyle: {
          top: `${top}px`,
          height: `${height}px`,
          backgroundColor: c.bg,
          color: c.fg
        }
      }
    ];
  });
});

function formatHourLabel(h: number) {
  const d = new Date(2000, 0, 1, h, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
}

function onGridClick(e: MouseEvent) {
  const el = gridBody.value;
  if (!el) return;
  const target = e.target as HTMLElement;
  if (target.closest('button')) return;
  const rect = el.getBoundingClientRect();
  const y = e.clientY - rect.top + el.scrollTop;
  const minutesFloat = (y / pxPerHour) * 60;
  const rounded = Math.round(minutesFloat / slotMinutes) * slotMinutes;
  const spanMin = (dayEndHour - dayStartHour) * 60;
  const clamped = Math.max(0, Math.min(spanMin - slotMinutes, rounded));
  emit('select-slot', { date: new Date(props.day), minutesFromMidnight: dayStartHour * 60 + clamped });
}

let tick: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  tick = setInterval(() => {
    nowMs.value = Date.now();
  }, 30 * 1000);
});
onUnmounted(() => {
  if (tick) clearInterval(tick);
});

watch(
  () => props.day,
  () => {
    nowMs.value = Date.now();
  }
);
</script>

<style scoped>
.booking-day-slot-highlight {
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  background: rgba(95, 99, 104, 0.1);
}

:global(.app-dark) .booking-day-slot-highlight {
  border-color: #c1c1c1;
  background: rgba(154, 160, 166, 0.12);
}
</style>
