<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { CalendarOptions, EventClickArg, EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import { useToast } from 'primevue/usetoast';
import { useBookingManagementStore } from '@/stores/bookingManagement';
import { storeToRefs } from 'pinia';
type CalendarView = 'dayGridMonth' | 'timeGridDay';

const bookingManagementStore = useBookingManagementStore();
const { bookingManagements } = storeToRefs(bookingManagementStore);

const toast = useToast();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const currentTitle = ref('');
const currentView = ref<CalendarView>('dayGridMonth');

const schedulePanelOpen = ref(false);
const selectedDateStr = ref('');
const selectedDateLabel = ref('');
const userId = ref(10);

const selectedMentor = ref<string | null>(null);
const meetingName = ref('');
const selectedDay = ref<string | null>(null);
const selectedTimeSlot = ref<string | null>(null);
const meetingLink = ref('');

const WEEKDAY_TO_VALUE: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};

const mentors = [
  { name: 'John Doe', value: 'john-doe' },
  { name: 'Jane Smith', value: 'jane-smith' },
  { name: 'Mike Johnson', value: 'mike-johnson' }
];

const days = [
  { name: 'Monday', value: 'monday' },
  { name: 'Tuesday', value: 'tuesday' },
  { name: 'Wednesday', value: 'wednesday' },
  { name: 'Thursday', value: 'thursday' },
  { name: 'Friday', value: 'friday' },
  { name: 'Saturday', value: 'saturday' },
  { name: 'Sunday', value: 'sunday' }
];

const timeSlots = [
  { name: '9:00 AM', value: '09:00' },
  { name: '10:00 AM', value: '10:00' },
  { name: '11:00 AM', value: '11:00' },
  { name: '12:00 PM', value: '12:00' },
  { name: '1:00 PM', value: '13:00' },
  { name: '2:00 PM', value: '14:00' }
];

function formatSelectedLabel(isoLike: string) {
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return isoLike;
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function toIsoDateTime(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:00`;
}

function applySelectionFromDateStr(dateStr: string) {
  selectedDateStr.value = dateStr;
  selectedDateLabel.value = formatSelectedLabel(dateStr);
  schedulePanelOpen.value = true;

  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    const w = WEEKDAY_TO_VALUE[d.getDay()];
    if (days.some((day) => day.value === w)) {
      selectedDay.value = w;
    }
  }

  if (dateStr.includes('T')) {
    const timePart = dateStr.split('T')[1]?.slice(0, 5);
    if (timePart) {
      const [hh, mm] = timePart.split(':').map(Number);
      const match = timeSlots.find((s) => {
        const [sh, sm] = s.value.split(':').map(Number);
        return sh === hh && (sm === mm || Number.isNaN(mm));
      });
      if (match) selectedTimeSlot.value = match.value;
    }
  }

  void nextTick(() => {
    document.getElementById('booking-schedule-sidebar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

const calendarEvents = computed<EventInput[]>(() => {
  return bookingManagements.value.flatMap((group) =>
    (group.data ?? []).map((item, index) => ({
      id: `${group.title}-${index}`,
      title: item.title || item.label || 'Booking',
      start: item.start_time ? `${item.start_date}T${item.start_time}` : item.start_date,
      end: item.end_date ? (item.end_time ? `${item.end_date}T${item.end_time}` : item.end_date) : undefined,
      allDay: !item.start_time
    }))
  );
});

function loadEvents(_arg: EventSourceFuncArg, successCallback: (events: EventInput[]) => void) {
  successCallback(calendarEvents.value);
}

const calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: false,
  height: 'auto',
  editable: false,
  selectable: false,
  dayMaxEvents: true,
  nowIndicator: true,
  events: loadEvents,
  datesSet: (arg) => {
    currentTitle.value = arg.view.title;
    const type = arg.view.type;
    if (type === 'dayGridMonth' || type === 'timeGridDay') {
      currentView.value = type;
    }
  },
  eventClick: (info: EventClickArg) => {
    const start = info.event.start;
    if (start) applySelectionFromDateStr(info.event.allDay ? start.toISOString().slice(0, 10) : toIsoDateTime(start));
    toast.add({
      severity: 'info',
      summary: info.event.title,
      detail: start ? `Start: ${start.toLocaleString()}` : 'Event selected',
      life: 3500
    });
  },
  dateClick: (info: DateClickArg) => {
    applySelectionFromDateStr(info.dateStr);
    toast.add({
      severity: 'success',
      summary: 'Date selected',
      detail: `Schedule a meeting for ${selectedDateLabel.value}`,
      life: 2800
    });
  }
};

function getApi() {
  return calendarRef.value?.getApi();
}

function goPrev() {
  getApi()?.prev();
}

function goNext() {
  getApi()?.next();
}

function onViewChange(view: CalendarView) {
  currentView.value = view;
  getApi()?.changeView(view);
}

const viewOptions = [
  { label: 'Month', value: 'dayGridMonth' as const },
  { label: 'Day', value: 'timeGridDay' as const }
];

watch(calendarEvents, () => {
  getApi()?.refetchEvents();
});

onMounted(async () => {
  await bookingManagementStore.fetchBookingManagements(userId.value);
  getApi()?.refetchEvents();
});
</script>

<template>
  <div class="booking-management-calendar card">
    <!-- Tailwind 12-col grid: 8 + 4 at md+ (Bootstrap .row margin reset was breaking col-md-8/4) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      <div class="md:col-span-8 min-w-0">
        <div class="booking-management-calendar-header h-full">
          <div class="booking-cal-toolbar surface-ground border-round-top p-3 flex align-items-center justify-between flex-wrap gap-3">
            <div class="flex align-items-center">
              <span class="booking-cal-nav p-buttonset">
                <Button
                  icon="pi pi-chevron-left"
                  rounded
                  severity="primary"
                  aria-label="Previous period"
                  class="booking-cal-nav-btn"
                  @click="goPrev"
                />
                <Button
                  icon="pi pi-chevron-right"
                  rounded
                  severity="primary"
                  aria-label="Next period"
                  class="booking-cal-nav-btn"
                  @click="goNext"
                />
              </span>
            </div>
            <div>
              <h2 class="booking-cal-title m-0 text-center flex-1 order-1 sm:order-0 min-w-0">
                {{ currentTitle || '\u00a0' }}
              </h2>

            </div>
            <SelectButton
              v-model="currentView"
              :options="viewOptions"
              option-label="label"
              option-value="value"
              aria-labelledby="booking-view-label"
              class="booking-cal-view-toggle"
              @update:model-value="(v: CalendarView | null) => v && onViewChange(v)"
            />
            <span id="booking-view-label" class="sr-only">Calendar view</span>
          </div>
          <div class="booking-cal-body p-3 pt-0">
            <FullCalendar ref="calendarRef" :options="calendarOptions" class="booking-fullcalendar" />
          </div>
        </div>
      </div>
      <div class="md:col-span-4 min-w-0">
        <div
          id="booking-schedule-sidebar"
          class="booking-management-calendar-sidebar surface-card border-1 surface-border border-round p-4 h-full transition-all transition-duration-200"
          :class="{ 'booking-sidebar--active': schedulePanelOpen }"
        >
          <template v-if="!schedulePanelOpen">
            <h3 class="mt-0 mb-3 text-xl font-semibold">Schedule Meeting</h3>
            <Message severity="secondary" :closable="false" class="w-full">
              Click a day or time slot on the calendar to open this form and book a meeting.
            </Message>
          </template>
          <template v-else>
            <div class="flex justify-content-between align-items-start gap-2 flex-wrap mb-3">
              <div>
                <h3 class="mt-0 mb-1 text-xl font-semibold">Schedule Meeting</h3>
                <p class="text-muted-color m-0 text-sm">{{ selectedDateLabel }}</p>
                <p v-if="selectedDateStr" class="text-500 m-0 mt-1 text-xs font-mono">{{ selectedDateStr }}</p>
              </div>
              <Button
                icon="pi pi-times"
                severity="secondary"
                text
                rounded
                aria-label="Clear date selection"
                @click="schedulePanelOpen = false"
              />
            </div>
            <Fluid class="schedule-meeting-form">
              <div class="flex flex-col gap-4">
                <div class="form-group flex flex-col gap-2">
                  <label for="booking-mentor" class="font-medium text-surface-700 dark:text-surface-200">Select Mentor</label>
                  <Select
                    v-model="selectedMentor"
                    :options="mentors"
                    option-label="name"
                    option-value="value"
                    placeholder="Select a mentor"
                    class="w-full"
                    input-id="booking-mentor"
                  />
                </div>
                <div class="form-group flex flex-col gap-2">
                  <label for="booking-meeting-name" class="font-medium text-surface-700 dark:text-surface-200">Meeting Name</label>
                  <InputText
                    id="booking-meeting-name"
                    v-model="meetingName"
                    class="w-full"
                    placeholder="Enter meeting name"
                  />
                </div>
                <div class="grid grid-cols-12 gap-2">
                  <div class="col-12 md:col-span-6">
                    <div class="form-group flex flex-col gap-2">
                      <label for="booking-day" class="font-medium text-surface-700 dark:text-surface-200">SelectDay</label>
                      <Select
                        id="booking-day"
                        v-model="selectedDay"
                        :options="days"
                        option-label="name"
                        option-value="value"
                        placeholder="Select day"
                        class="w-full"
                        input-id="booking-day"
                      />
                    </div>
                  </div>
                  <div class="col-12 md:col-span-6">
                    <div class="form-group flex flex-col gap-2">
                      <label for="booking-slot" class="font-medium text-surface-700 dark:text-surface-200">Select Time slot</label>
                      <Select
                        id="booking-slot"
                        v-model="selectedTimeSlot"
                        :options="timeSlots"
                        option-label="name"
                        option-value="value"
                        placeholder="Select time"
                        class="w-full"
                        input-id="booking-slot"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group flex flex-col gap-2">
                  <label for="booking-meeting-link" class="font-medium text-surface-700 dark:text-surface-200">Meeting link</label>
                  <InputText
                    id="booking-meeting-link"
                    v-model="meetingLink"
                    class="w-full"
                    placeholder="https://…"
                  />
                </div>
                <div class="flex justify-content-between gap-2 pt-2">
                  <Button label="Book a Meeting" severity="primary" icon="pi pi-check" />
                  <Button label="Reject" severity="danger" outlined icon="pi pi-times" />
                </div>
              </div>
            </Fluid>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-management-calendar {
  overflow: hidden;
  padding:0;
  border:none;
}

.booking-management-calendar-sidebar {
  min-height: 12rem;
}
.booking-cal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.booking-cal-nav :deep(.p-button) {
  border-radius: 0;
}      
.booking-cal-nav :deep(.p-button:first-child) {
  border-top-left-radius: var(--p-border-radius-md);
  border-bottom-left-radius: var(--p-border-radius-md);
}

.booking-cal-nav :deep(.p-button:last-child) {
  border-top-right-radius: var(--p-border-radius-md);
  border-bottom-right-radius: var(--p-border-radius-md);
}

.booking-cal-nav-btn :deep(.p-button-icon) {
  color: var(--p-primary-contrast-color);
}

/* Dark grey view switcher (reference image) */
.booking-cal-view-toggle :deep(.p-togglebutton) {
  background: var(--p-surface-600);
  border-color: var(--p-surface-700);
  color: var(--p-surface-0);
}

.booking-cal-view-toggle :deep(.p-togglebutton.p-togglebutton-checked) {
  background: var(--p-surface-800);
  border-color: var(--p-surface-900);
  color: var(--p-surface-0);
}
.booking-cal-view-toggle :deep(.p-togglebutton-checked .p-togglebutton-content){
  color: var(--p-surface-900);
}

.booking-cal-view-toggle :deep(.p-togglebutton:not(.p-disabled):hover) {
  background: var(--p-surface-500);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* FullCalendar — match reference: blue events, grey header row, light borders */
.booking-fullcalendar :deep(.fc) {
  --fc-border-color: #d7d7d7;
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: #e8e8e8;
  --fc-today-bg-color: rgba(59, 130, 246, 0.08);
  --fc-event-bg-color: #3788d8;
  --fc-event-border-color: #2f7bc9;
  --fc-event-text-color: #ffffff;
  --fc-daygrid-event-dot-width: 0;
  font-family: inherit;
}

.booking-fullcalendar :deep(.fc-col-header-cell) {
  font-weight: 500;
  font-size: 0.875rem;
}

.booking-fullcalendar :deep(.fc-daygrid-day-number) {
  float: right;
  padding: 4px 6px;
  font-size: 0.875rem;
}

.booking-fullcalendar :deep(.fc-day-other .fc-daygrid-day-number) {
  opacity: 0.45;
}

.booking-fullcalendar :deep(.fc-daygrid-event) {
  cursor: pointer;
  border-radius: 2px;
  margin-top: 1px;
}

.booking-fullcalendar :deep(.fc-daygrid-day-frame) {
  cursor: pointer;
}

.booking-fullcalendar :deep(.fc-timegrid-slot) {
  cursor: pointer;
}

.booking-fullcalendar :deep(.fc-timegrid-event) {
  cursor: pointer;
}

.booking-fullcalendar :deep(.fc-scrollgrid) {
  border-radius: 0 0 var(--p-border-radius-md) var(--p-border-radius-md);
}
</style>
