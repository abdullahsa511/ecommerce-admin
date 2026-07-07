<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useBookingManagementStore } from '@/stores/bookingManagement';
import { storeToRefs } from 'pinia';
import BookingMonthGrid from './BookingMonthGrid.vue';
import BookingDayGrid from './BookingDayGrid.vue';
import SplitButton from 'primevue/splitbutton';

import {
  exportTableData,
  type ExportColumn
} from '@/utils/exportUtils';   // 👈 add this

import {
  addDays,
  addMonths,
  flattenBookingGroups,
  formatTimeOfDay,
  formatYMD,
  type FlatBookingEvent
} from '@/views/booking-management/utils/bookingCalendarUtils';

type CalendarViewMode = 'month' | 'day';

const bookingManagementStore = useBookingManagementStore();
const {fb, bookingManagements, contactPersons, showrooms } = storeToRefs(bookingManagementStore);

const toast = useToast();
const anchorDate = ref(new Date());
const currentView = ref<CalendarViewMode>('month');
const selectedContactPerson = ref<number | null>(null);
const selectedShowroomId = ref<number | null>(null);
const selectedShowroomLocation = ref<string | null>(null);
const schedulePanelOpen = ref(false);
const userId = ref(10);

const selectedMentor = ref<string | null>(null);
const meetingName = ref('');
const tourType = ref('physicalTour');
const bookingSource = ref('Office Upgrades & Refurbishments');
const selectedVisitShowroomId = ref<number | null>(null);
const meetingLink = ref('');
const meetingStart = ref<Date | null>(null);
const meetingEnd = ref<Date | null>(null);
const submitting = ref(false);
const sendingAbsentEmail = ref(false);
/** Month grid: selected day (YYYY-MM-DD). Day grid: selected time range on that day. */
const selectedMonthYmd = ref<string | null>(null);
const selectedDaySlot = ref<{ ymd: string; startMin: number; endMin: number } | null>(null);

const timeZones: Record<number, string> = {
  1: "AEST/AEDT (GMT+10:00) Sydney time",
  2: "AEST/AEDT (GMT+10:00) Melbourne time",
  3: "AEST (GMT+10:00) Brisbane time"
};


const flatEvents = computed<FlatBookingEvent[]>(() =>
  flattenBookingGroups(bookingManagements.value as Parameters<typeof flattenBookingGroups>[0])
);

const currentTitle = computed(() => {
  if (currentView.value === 'month') {
    return anchorDate.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }
  return anchorDate.value.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
});

const selectedDateLabel = computed(() => {
  if (!meetingStart.value) return '';
  return formatSelectedLabel(meetingStart.value.toISOString());
});

const selectedDateStr = computed(() => {
  if (!meetingStart.value) return '';
  return meetingStart.value.toISOString();
});

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

function openSidebarWithRange(start: Date, end: Date) {
  meetingStart.value = start;
  meetingEnd.value = end;
  schedulePanelOpen.value = true;
  void nextTick(() => {
    document.getElementById('booking-schedule-sidebar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/** Month cell: default new booking at 9:00 local. */
function onMonthSelectDate(d: Date) {
  selectedVisitShowroomId.value = null;
  selectedMonthYmd.value = formatYMD(d);
  selectedDaySlot.value = null;
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0, 0);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  openSidebarWithRange(start, end);

  console.log('start:', start);
  console.log('end:', end);

  meetingLink.value = makeMeetingLink({
    start: start,
    end: end,
    title: meetingName.value || 'Meeting'
  });

  console.log('meetingLink:', meetingLink.value);

  toast.add({
    severity: 'success',
    summary: 'Time selected',
    detail: 'Set start/end below or save to add the booking.',
    life: 2600
  });
}

function onDaySelectSlot(payload: { date: Date; minutesFromMidnight: number }) {
  selectedVisitShowroomId.value = null;
  const ymd = formatYMD(payload.date);
  const startMin = payload.minutesFromMidnight;
  const endMin = Math.min(startMin + 60, 24 * 60);
  selectedDaySlot.value = { ymd, startMin, endMin };
  selectedMonthYmd.value = null;
  const start = new Date(
    payload.date.getFullYear(),
    payload.date.getMonth(),
    payload.date.getDate(),
    0,
    0,
    0,
    0
  );
  start.setMinutes(payload.minutesFromMidnight);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  openSidebarWithRange(start, end);
  toast.add({
    severity: 'success',
    summary: 'Time slot selected',
    detail: 'Adjust start/end in the form if needed.',
    life: 2400
  });
}

function onSelectEvent(ev: FlatBookingEvent) {
  console.log('ev:', ev);
  selectedVisitShowroomId.value = Number(ev.visit_showroom_id);
  meetingLink.value = (ev as any).meeting_link || '';
  meetingName.value = ev.title || ev.label || '';
  tourType.value = ev.tour_type|| '';
  bookingSource.value = ev.enquiry_type|| '';
  const s = new Date(ev.startMs);
  const e = new Date(ev.endMs);
  selectedMonthYmd.value = formatYMD(s);
  const dayStart = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
  const startMin = Math.max(0, (ev.startMs - dayStart) / 60000);
  const endMin = Math.min(24 * 60, Math.max(startMin + 15, (ev.endMs - dayStart) / 60000));
  selectedDaySlot.value = { ymd: formatYMD(s), startMin, endMin };

  openSidebarWithRange(s, e);
  toast.add({
    severity: 'info',
    summary: ev.label || ev.title,
    detail: 'Review or edit times, then save.',
    life: 3200
  });
}

function onSelectTour(event: any) {
  if (event && event.target) {
    tourType.value = event.target.value;
  }
  console.log('Selected Tour Type:', tourType.value);
}

function onSelecSource(event: any) {
  if (event && event.target) {
    bookingSource.value = event.target.value;
  }
  console.log('Selected Booking Source:', bookingSource.value);
}


function goPrev() {
  if (currentView.value === 'month') {
    anchorDate.value = addMonths(anchorDate.value, -1);
  } else {
    anchorDate.value = addDays(anchorDate.value, -1);
  }
}

function goNext() {
  if (currentView.value === 'month') {
    anchorDate.value = addMonths(anchorDate.value, 1);
  } else {
    anchorDate.value = addDays(anchorDate.value, 1);
  }
}

function goToday() {
  anchorDate.value = new Date();
}

/** Date picker in day view: jump to any calendar day (local midnight). */
function onDayViewDatePicked(value: Date | Date[] | (Date | null)[] | null | undefined) {
  const d = Array.isArray(value) ? value[0] : value;
  if (!d || Number.isNaN(d.getTime())) return;
  anchorDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const viewOptions = [
  { label: 'Month', value: 'month' as const },
  { label: 'Day', value: 'day' as const }
];

async function submitBooking() {
  if (!meetingStart.value) {
    toast.add({ severity: 'warn', summary: 'Pick a start time', detail: 'Use the calendar or datetime fields.', life: 4000 });
    return;
  }
  const start = meetingStart.value;
  const end = meetingEnd.value ?? new Date(start.getTime() + 60 * 60 * 1000);
  if (end.getTime() <= start.getTime()) {
    toast.add({ severity: 'warn', summary: 'Invalid range', detail: 'End must be after start.', life: 4000 });
    return;
  }

  submitting.value = true;
  try {
    let response;

    // editing data
    if (selectedVisitShowroomId.value) {
      response = await bookingManagementStore.updateBookingManagement(selectedVisitShowroomId.value, {
        visit_showroom_id: selectedVisitShowroomId.value,
        showroom_contact_id: selectedContactPerson.value ?? null,
        showroom_id: selectedShowroomId.value ?? null,
        title: meetingName.value || 'Meeting',
        label: meetingName.value || 'Meeting',
        start_date: formatYMD(start),
        end_date: formatYMD(end),
        start_time: formatTimeOfDay(start),
        end_time: formatTimeOfDay(end),
        meeting_link: meetingLink.value,
        tour_type: tourType.value,    
        enquiry_type: bookingSource.value,
        time_zone:  timeZones[selectedShowroomId.value ?? 0] ?? ""
      } as Record<string, unknown>);
    } else {
      // add booking management
      response = await bookingManagementStore.createBookingManagement({
        visit_showroom_id: selectedVisitShowroomId?.value,
        showroom_contact_id: selectedContactPerson?.value,
        showroom_id: selectedShowroomId?.value,
        title: meetingName.value || 'Meeting',
        label: meetingName.value || 'Meeting',
        start_date: formatYMD(start),
        end_date: formatYMD(end),
        start_time: formatTimeOfDay(start),
        end_time: formatTimeOfDay(end),
        meeting_link: meetingLink.value,
        tour_type: tourType.value, 
        enquiry_type: bookingSource.value,
        time_zone:  timeZones[selectedShowroomId.value ?? 0] ?? ""
      } as Record<string, unknown>);
    }
    // console.log('response:', response);
    if (response.success) {
      schedulePanelOpen.value = false;
      selectedMonthYmd.value = null;
      selectedDaySlot.value = null;
      meetingName.value = '';
      meetingLink.value = '';
      selectedMentor.value = null;
      selectedVisitShowroomId.value = null;

      toast.add({ severity: 'success', summary: response.message, life: 3200 });
    } else {
      toast.add({ severity: 'error', summary: response.message, detail: 'Failed to save booking', life: 5000 });
    }
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: 'Could not save',
      detail: e instanceof Error ? e.message : 'Request failed',
      life: 5000
    });
  } finally {
    submitting.value = false;
  }
}

async function cancelBooking() {

  let response;
  // editing data
  if (selectedVisitShowroomId.value) {
    response = await bookingManagementStore.cancelBooking(selectedVisitShowroomId?.value ?? 0);
    if (response.success) {
      // add success toast
      schedulePanelOpen.value = false;
      toast.add({ severity: 'success', summary: response.message, life: 3200 });
    } else {
      toast.add({ severity: 'error', summary: response.message, life: 5000 });
    }
  }

}

function closeSidebar() {
  schedulePanelOpen.value = false;
}

function makeMeetingLink({ start, end, title }: { start: Date; end: Date; title: string }) {

  const format = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const startStr = format(start);
  const endStr = format(end);

  const location = selectedShowroomLocation.value;
  const add = 'c_18895tnlfoecignhmo94g3jqjc402@resource.calendar.google.com';

  const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}&location=${encodeURIComponent(location)}&add=${encodeURIComponent(add)}`;

  return url;
}

function onDateChange() {
  meetingLink.value = makeMeetingLink({
    start: meetingStart.value ?? new Date(),
    end: meetingEnd.value ?? new Date((meetingStart.value?.getTime() ?? 0) + 60 * 60 * 1000),
    title: meetingName.value || 'Meeting'
  });
}

function onMeetingNameChange(event: any) {
  meetingLink.value = makeMeetingLink({
    start: meetingStart.value ?? new Date(),
    end: meetingEnd.value ?? new Date((meetingStart.value?.getTime() ?? 0) + 60 * 60 * 1000),
    title: event.target.value || 'Meeting'
  });
}

async function onContactPersonChange(event: any) {
  // console.log('onContactPersonChange:', event);
  try {
    const contactPersonId = event.value;
    await bookingManagementStore.fetchBookingManagements(contactPersonId, selectedShowroomId?.value);
    toast.add({ severity: 'success', summary: 'Booking managements fetched', life: 3200 });
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch booking managements', life: 5000 });
  }
}

async function onShowroomChange(event: any) {
  // console.log('onContactPersonChange:', event);
  try {
    const showroomId = event.value;
    const showroomLocation = showrooms.value.find(showroom => showroom.showroom_id === showroomId)?.location;
    selectedShowroomLocation.value = showroomLocation ?? '';
    await bookingManagementStore.fetchBookingManagements(selectedContactPerson?.value, showroomId);
    toast.add({ severity: 'success', summary: 'Showroom fetched', life: 3200 });
    // close the sidebar
    schedulePanelOpen.value = false;
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch showroom', life: 5000 });
  }
}

watch(anchorDate, () => {
  selectedMonthYmd.value = null;
  selectedDaySlot.value = null;
});

// Update meeting link whenever start or end change (covers DatePicker model updates)
watch([meetingStart, meetingEnd], () => {
  onDateChange();
});

onMounted(async () => {
  await bookingManagementStore.fetchContactPersons();
  const defaultContactPerson = (contactPersons.value.length > 0) ? contactPersons.value[0]?.showroom_contact_id : null;
  const defaultShowroomId = (showrooms.value.length > 0) ? showrooms.value[0]?.showroom_id : null;
  const defaultShowroomLocation = (showrooms.value.length > 0) ? showrooms.value[0]?.location : null;
  selectedContactPerson.value = defaultContactPerson ?? 0;
  selectedShowroomId.value = defaultShowroomId ?? 0;
  selectedShowroomLocation.value = defaultShowroomLocation ?? '';
  // console.log('defaultContactPerson:', defaultContactPerson);
  await bookingManagementStore.fetchBookingManagements(defaultContactPerson, defaultShowroomId);
  // console.log(bookingManagements.value);
});

async function sendAbsentEmail() {
  // console.log('sendAbsentEmail');
  try {
    sendingAbsentEmail.value = true;
    const response = await bookingManagementStore.sendAbsentEmail(selectedVisitShowroomId?.value ?? 0);
    console.log('response:', response);
    if (response.success) {
      // add success toast
      toast.add({ severity: 'success', summary: response.message, life: 3200 });
    } else {
      toast.add({ severity: 'error', summary: response.message, life: 5000 });
    }
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', life: 5000 });
  } finally {
    sendingAbsentEmail.value = false;
  }
}

const meetingNameModel = computed({
  get() {
    return selectedVisitShowroomId.value ? meetingName.value : '';
  },
  set(val) {
    if (selectedVisitShowroomId.value) {
      meetingName.value = val;
    } else {
      meetingName.value = '';
    }
    onDateChange();
  }
});


// ==========================================================================
// Export (CSV / XLSX / PDF) — powered by exportUtils.js
// ==========================================================================
const exportMenuItems = [
  { label: 'Export as CSV', icon: 'pi pi-file', command: () => exportData('csv') },
  { label: 'Export as Excel (.xlsx)', icon: 'pi pi-file-excel', command: () => exportData('xlsx') },
  { label: 'Export as PDF', icon: 'pi pi-file-pdf', command: () => exportData('pdf') }
];

const bookingColumns: ExportColumn<any>[] = [
  { key: 'visit_showroom_id', header: 'ID', width: 40 },
  { key: 'title', header: 'Title / Name', width: 140 },
  { key: 'label', header: 'Label', width: 90, badge: true },
  { key: 'start_date', header: 'Start Date', width: 80 },
  { key: 'start_time', header: 'Start Time', width: 70 },
  { key: 'end_date', header: 'End Date', width: 80 },
  { key: 'end_time', header: 'End Time', width: 70 },
  { key: 'meeting_link', header: 'Link', width: 110 }
];

function exportData(format: 'csv' | 'xlsx' | 'pdf') {
  const rawGroups = bookingManagements.value || [];
  const extractedEvents: any[] = [];

  const targetYear = anchorDate.value.getFullYear();
  const targetMonth = anchorDate.value.getMonth();

  rawGroups.forEach((group: any) => {
    if (group && Array.isArray(group.data)) {
      group.data.forEach((item: any) => {
        if (item.start_date) {
          const parts = item.start_date.split('-');
          const eventYear = parseInt(parts[0], 10);
          const eventMonth = parseInt(parts[1], 10) - 1;
          if (eventYear === targetYear && eventMonth === targetMonth) {
            extractedEvents.push(item);
          }
        }
      });
    }
  });

  if (extractedEvents.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Export Failed',
      detail: 'There are no booking events available to export for this month.',
      life: 4000
    });
    return;
  }

  const reportMonthYear = anchorDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  try {
    exportTableData(format, {
      columns: bookingColumns,
      data: extractedEvents,
      fileName: `bookings_report_${reportMonthYear.replace(/\s+/g, '_')}`,
      title: 'Booking Management Report',
      subtitle: reportMonthYear,
      paperSize: 'A3',
      orientation: 'portrait'
    });

    if (format === 'pdf') {
      toast.add({ severity: 'success', summary: 'Print dialog opened', detail: 'Choose "Save as PDF" in the print dialog to download.', life: 4000 });
    } else {
      toast.add({ severity: 'success', summary: 'Success', detail: `${format.toUpperCase()} file downloaded successfully.`, life: 3000 });
    }
  } catch (error) {
    console.error(`${format.toUpperCase()} Export Error:`, error);
    toast.add({ severity: 'error', summary: 'Error', detail: `Failed to export ${format.toUpperCase()} file.`, life: 4000 });
  }
}
</script>

<template>
  <div class="booking-management-calendar card">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      <div class="md:col-span-8 min-w-0">
        <div class="booking-management-calendar-header h-full w-full min-w-0">
          <header class="gcal-toolbar flex align-items-center w-full flex-nowrap gap-3 border-round-top"
            aria-label="Calendar navigation">
            <div class="gcal-toolbar-left flex align-items-center flex-wrap gap-2 sm:gap-3 flex-1 min-w-0">
              <Button type="button" label="Today" outlined severity="secondary" class="gcal-btn-today shrink-0"
                @click="goToday" />
              <div class="gcal-nav-arrows flex align-items-center shrink-0 gap-1">
                <Button icon="pi pi-chevron-left" text rounded severity="secondary" aria-label="Previous period"
                  class="gcal-nav-chevron" @click="goPrev" />
                <Button icon="pi pi-chevron-right" text rounded severity="secondary" aria-label="Next period"
                  class="gcal-nav-chevron" @click="goNext" />
                <div v-if="currentView === 'day'" class="gcal-day-picker-wrap shrink-0">
                  <DatePicker :model-value="anchorDate" show-icon date-format="M d, yy"
                    input-id="booking-day-toolbar-date" aria-label="Go to date" placeholder="Date"
                    @update:model-value="onDayViewDatePicked" />
                </div>
              </div>
              <h2 class="gcal-toolbar-title m-0 min-w-0 truncate">
                {{ currentTitle || '\u00a0' }}
              </h2>
            </div>
            
            <div class="gcal-toolbar-right flex align-items-center justify-content-end gap-1 shrink-0 ml-auto">
              
              <SplitButton 
                label="Export" 
                icon="pi pi-download" 
                :model="exportMenuItems" 
                severity="secondary" 
                size="small"
                class="mr-2"
                @click="exportData('csv')" 
              />

              <Button v-tooltip.bottom="'Search'" icon="pi pi-search" text rounded severity="secondary"
                aria-label="Search" class="gcal-icon-btn" />
              <Button v-tooltip.bottom="'Help'" icon="pi pi-question-circle" text rounded severity="secondary"
                aria-label="Help" class="gcal-icon-btn" />
              <Button v-tooltip.bottom="'Settings'" icon="pi pi-cog" text rounded severity="secondary"
                aria-label="Settings" class="gcal-icon-btn" />
              <span id="booking-view-label" class="sr-only">Calendar view</span>
              <div class="gcal-view-select-wrap w-auto min-w-[7.5rem]">
                <Select v-model="currentView" :options="viewOptions" option-label="label" option-value="value"
                  aria-labelledby="booking-view-label" />
              </div>
              <div class="gcal-view-select-wrap w-auto min-w-[7.5rem]">
                <Select v-model="selectedContactPerson" :options="contactPersons" option-label="name"
                  option-value="showroom_contact_id" aria-labelledby="booking-view-label"
                  @change="onContactPersonChange" />
              </div>
              <div class="gcal-view-select-wrap w-auto min-w-[7.5rem]">
                <Select v-model="selectedShowroomId" :options="showrooms" option-label="name" option-value="showroom_id"
                  aria-labelledby="booking-view-label" @change="onShowroomChange" />
              </div>
              </div>
          </header>
          <div class="booking-cal-body p-3 pt-0">
            <BookingMonthGrid v-if="currentView === 'month'" :anchor-date="anchorDate" :events="flatEvents"
              :selected-ymd="selectedMonthYmd" @select-date="onMonthSelectDate" @select-event="onSelectEvent" />
            <BookingDayGrid v-else :day="anchorDate" :events="flatEvents" :selected-slot="selectedDaySlot"
              @select-slot="onDaySelectSlot" @select-event="onSelectEvent" />
          </div>
        </div>
      </div>
      <div class="md:col-span-4 min-w-0">
        <div id="booking-schedule-sidebar"
          class="booking-management-calendar-sidebar surface-card border-1 surface-border border-round p-4 h-full transition-all transition-duration-200"
          :class="{ 'booking-sidebar--active': schedulePanelOpen }">
          <template v-if="!schedulePanelOpen">
            <h3 class="mt-0 mb-3 text-xl font-semibold">Schedule Meeting</h3>
            <Message severity="secondary" :closable="false" class="w-full">
              Click a day or an empty time slot to add a booking. Click an existing event to edit its times in the form.
            </Message>
          </template>
          <template v-else>
            <div class="flex justify-content-between align-items-start gap-2 flex-wrap mb-3">
              <div>
                <h3 class="mt-0 mb-1 text-xl font-semibold">Schedule Meeting</h3>
                <p class="text-muted-color m-0 text-sm pb-5">{{ selectedDateLabel }}</p>
                <!-- <p v-if="selectedDateStr" class="text-500 m-0 mt-1 text-xs font-mono">{{ selectedDateStr }}</p> -->
              </div>
              <Button icon="pi pi-times" severity="secondary" text rounded aria-label="Close" @click="closeSidebar" />
            </div>
            <Fluid class="schedule-meeting-form">
              <div class="flex flex-col gap-4">
                <div class="form-group flex flex-col gap-2">
                  <label for="booking-meeting-name" class="font-medium text-surface-700 dark:text-surface-200">Meeting Name</label>
                  <InputText @change="onMeetingNameChange" id="booking-meeting-name" v-model="meetingNameModel"
                    class="w-full" placeholder="Enter meeting name" />
                </div>
                
                <div class="form-group flex flex-col gap-2">
                  <label for="tour_type" class="font-medium text-surface-700 dark:text-surface-200">Tour Type</label>
                  <Select 
                    id="tour_type" 
                    v-model="tourType" 
                    :options="[
                      { label: 'Showroom Tour', value: 'physicalTour' },
                      { label: 'Virtual Tour', value: 'virtualTour' }
                    ]" 
                    option-label="label" 
                    option-value="value" 
                    placeholder="Select tour type" 
                    class="w-full"
                    @change="onSelectTour"
                  />
                </div>
                
                <div class="form-group flex flex-col gap-2">
                  <label for="enquiry_type" class="font-medium text-surface-700 dark:text-surface-200">Booking Source</label>
                  <Select 
                    id="enquiry_type" 
                    v-model="bookingSource" 
                    :options="[
                      { label: 'Office Upgrades & Refurbishments', value: 'Office Upgrades & Refurbishments' },
                      { label: 'Full Office Fitout & Space Planning', value: 'Full Office Fitout & Space Planning' },
                      { label: 'Multi-Level Commercial Projects', value: 'Multi-Level Commercial Projects' },
                      { label: 'General Browsing & Inspiration', value: 'General Browsing & Inspiration' },
                      { label: 'Home Office', value: 'Home Office' }
                    ]" 
                    option-label="label" 
                    option-value="value" 
                    placeholder="Select enquiry type" 
                    class="w-full"
                    @change="onSelecSource"
                  />
                </div>
                
                <div class="form-group flex flex-col gap-2">
                  <label for="booking-start" class="font-medium text-surface-700 dark:text-surface-200">Starts</label>
                  <DatePicker @update:model-value="onDateChange" id="booking-start" v-model="meetingStart" show-time
                    hour-format="12" fluid :step-minute="30" placeholder="Start date & time" />
                </div>
                
                <div class="form-group flex flex-col gap-2">
                  <label for="booking-end" class="font-medium text-surface-700 dark:text-surface-200">Ends</label>
                  <DatePicker @update:model-value="onDateChange" id="booking-end" v-model="meetingEnd" show-time
                    hour-format="12" fluid :step-minute="30" placeholder="End date & time" />
                </div>
                
                <div class="form-group flex flex-col gap-2">
                  <label for="booking-meeting-link" class="font-medium text-surface-700 dark:text-surface-200">Meeting link</label>
                  <div v-if="meetingLink" class="flex flex-col gap-2">
                    <a :href="meetingLink" target="_blank" class="link text-primary calendar-link break-all">{{ meetingLink }}</a>
                  </div>
                  <div v-else class="text-muted-color text-xs">No link generated yet</div>
                </div>

                <div class="flex justify-content-between gap-2 pt-2">
                  <Button :label="selectedVisitShowroomId ? 'Update Booking' : 'Book a Meeting'"
                    :severity="selectedVisitShowroomId ? 'success' : 'primary'" icon="pi pi-check" :loading="submitting"
                    :disabled="submitting" @click="submitBooking" />
                  <Button label="Cancel" severity="danger" outlined
                      :icon="fb.loading['bookingManagement.cancel-booking.' + selectedVisitShowroomId] ? 'pi pi-spinner pi-spin' : 'pi pi-times'"
                      :disabled="!!fb.loading['bookingManagement.cancel-booking.' + selectedVisitShowroomId]" 
                    @click="cancelBooking" />                 
                </div>
                
                <div class="flex justify-content-between gap-2 pt-2">
                  <Button v-if="selectedVisitShowroomId" label="Send Absent Email" severity="primary" icon="pi pi-envelope" :loading="sendingAbsentEmail"
                    :disabled="sendingAbsentEmail" @click="sendAbsentEmail" />
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
.booking-management-calendar-sidebar a.calendar-link {
  display: inline-block;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  word-wrap: break-word;
  word-break: break-all;
}

.booking-management-calendar {
  overflow: hidden;
  padding: 0;
  border: none;
}

.booking-management-calendar-sidebar {
  min-height: 12rem;
}

/* Google Calendar–style toolbar */
.gcal-toolbar {
  --gcal-bg: #f8f9fa;
  --gcal-text: #3c4043;
  --gcal-border: #dadce0;
  --gcal-hover: rgba(60, 64, 67, 0.08);
  --gcal-icon: #5f6368;
  --gcal-toolbar-font-size: 1rem;
  --gcal-toolbar-line-height: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
  background: var(--gcal-bg);
  /* border-bottom: 1px solid var(--gcal-border); */
  padding: 0.5rem 1rem 0.625rem;
  font-family: 'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: var(--gcal-toolbar-font-size);
  line-height: var(--gcal-toolbar-line-height);
}

.gcal-toolbar-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.gcal-toolbar-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}

:global(.app-dark) .gcal-toolbar {
  --gcal-bg: var(--p-surface-900);
  --gcal-text: var(--p-surface-100);
  --gcal-border: var(--p-surface-700);
  --gcal-hover: rgba(255, 255, 255, 0.08);
  --gcal-icon: var(--p-surface-200);
}

.gcal-toolbar-title {
  font-size: var(--gcal-toolbar-font-size);
  font-weight: 500;
  line-height: var(--gcal-toolbar-line-height);
  letter-spacing: 0;
  color: var(--gcal-text);
}

.gcal-btn-today :deep(.p-button) {
  border-radius: 9999px;
  border-color: var(--gcal-border);
  background: var(--gcal-bg);
  color: var(--gcal-text);
  font-size: var(--gcal-toolbar-font-size);
  font-weight: 500;
  line-height: var(--gcal-toolbar-line-height);
  padding: 0.25rem 0.75rem;
  min-height: unset;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.gcal-btn-today :deep(.p-button-label) {
  font-size: inherit;
  line-height: inherit;
}

.gcal-btn-today :deep(.p-button:not(:disabled):hover) {
  background: var(--gcal-hover);
  border-color: var(--gcal-border);
  color: var(--gcal-text);
}

.gcal-nav-arrows {
  display: inline-flex;
  align-items: center;
}

.gcal-nav-chevron :deep(.p-button) {
  width: 2.25rem;
  height: 2.25rem;
  color: var(--gcal-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.gcal-nav-chevron :deep(.p-button-icon) {
  font-size: var(--gcal-toolbar-font-size);
}

.gcal-nav-chevron :deep(.p-button:not(:disabled):hover) {
  background: var(--gcal-hover);
  color: var(--gcal-text);
}

.gcal-day-picker-wrap {
  display: flex;
  align-items: center;
}

.gcal-day-picker-wrap :deep(.p-datepicker) {
  min-height: 2.25rem;
  height: 2.25rem;
  border-color: var(--gcal-border);
  background: var(--gcal-bg);
  border-radius: 9999px;
  box-shadow: none;
}

.gcal-day-picker-wrap :deep(.p-datepicker-input) {
  font-size: var(--gcal-toolbar-font-size);
  color: var(--gcal-text);
  font-weight: 500;
  line-height: var(--gcal-toolbar-line-height);
  padding: 0.25rem 0.5rem;
  min-width: 7rem;
}

.gcal-day-picker-wrap :deep(.p-datepicker-dropdown) {
  color: var(--gcal-icon);
}

.gcal-day-picker-wrap :deep(.p-datepicker:not(.p-disabled):hover) {
  border-color: var(--gcal-border);
  background: var(--gcal-hover);
}

.gcal-icon-btn :deep(.p-button) {
  width: 2.25rem;
  height: 2.25rem;
  color: var(--gcal-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.gcal-icon-btn :deep(.p-button-icon) {
  font-size: var(--gcal-toolbar-font-size);
}

.gcal-icon-btn :deep(.p-button:not(:disabled):hover) {
  background: var(--gcal-hover);
  color: var(--gcal-text);
}

.gcal-view-select-wrap {
  display: flex;
  align-items: center;
}

.gcal-view-select-wrap :deep(.p-select) {
  border-radius: 9999px;
  border-color: var(--gcal-border);
  background: var(--gcal-bg);
  min-height: 2.25rem;
  height: 2.25rem;
  align-items: center;
  box-shadow: none;
}

.gcal-view-select-wrap :deep(.p-select-label),
.gcal-view-select-wrap :deep(.p-select-dropdown) {
  color: var(--gcal-text);
  font-size: var(--gcal-toolbar-font-size);
  font-weight: 500;
  line-height: var(--gcal-toolbar-line-height);
}

.gcal-view-select-wrap :deep(.p-select:not(.p-disabled):hover) {
  background: var(--gcal-hover);
  border-color: var(--gcal-border);
}

.gcal-view-select-wrap :deep(.p-select:not(.p-disabled).p-focus) {
  border-color: var(--gcal-border);
  box-shadow: 0 0 0 1px var(--gcal-border);
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
</style>
