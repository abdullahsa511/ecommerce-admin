<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useBookingManagementStore } from '@/stores/bookingManagement';
import { storeToRefs } from 'pinia';
import BookingMonthGrid from './BookingMonthGrid.vue';
import BookingDayGrid from './BookingDayGrid.vue';
import SplitButton from 'primevue/splitbutton';

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
  console.log(bookingManagements.value);
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

// 1. Define the dropdown items for formatting options
const exportMenuItems = [
  {
    label: 'Export as CSV',
    icon: 'pi pi-file',
    command: () => exportData('csv')
  },
  {
    label: 'Export as Excel (.xlsx)',
    icon: 'pi pi-file-excel',
    command: () => exportData('xlsx')
  },
  {
    label: 'Export as PDF',
    icon: 'pi pi-file-pdf',
    command: () => exportData('pdf')
  }
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

  switch (format) {
    case 'csv':
      triggerCSVExport(extractedEvents);
      break;
    case 'xlsx':
      triggerXLSXExport(extractedEvents);
      break;
    case 'pdf':
      triggerPDFExport(extractedEvents);
      break;
  }
}

// ==========================================================================
// CSV — unchanged, already dependency-free
// ==========================================================================
function triggerCSVExport(events: any[]) {
  try {
    const headers = ['ID', 'Title/Name', 'Label', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Meeting Link'];

    const rows = events.map(ev => [
      `"${ev.visit_showroom_id || ''}"`,
      `"${(ev.title || '').replace(/"/g, '""')}"`,
      `"${(ev.label || '').replace(/"/g, '""')}"`,
      `"${ev.start_date || ''}"`,
      `"${ev.start_time || ''}"`,
      `"${ev.end_date || ''}"`,
      `"${ev.end_time || ''}"`,
      `"${ev.meeting_link || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `bookings_report_${new Date().toISOString().slice(0, 10)}.csv`);

    toast.add({ severity: 'success', summary: 'Success', detail: 'CSV file downloaded successfully.', life: 3000 });
  } catch (error) {
    console.error('CSV Export Error:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong during export.', life: 4000 });
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---- CRC32 (needed by the ZIP format) ----
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ---- Minimal ZIP writer (store/no-compression entries only) ----
function createZip(files: { name: string; data: Uint8Array }[]): Blob {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  const u16 = (n: number) => new Uint8Array([n & 0xff, (n >> 8) & 0xff]);
  const u32 = (n: number) => new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff]);
  const concat = (...arrs: Uint8Array[]) => {
    const total = arrs.reduce((s, a) => s + a.length, 0);
    const out = new Uint8Array(total);
    let p = 0;
    for (const a of arrs) { out.set(a, p); p += a.length; }
    return out;
  };

  const dosTime = new Uint8Array([0, 0]);
  const dosDate = u16(0x21); // 1980-01-01, valid minimum DOS date

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const data = file.data;
    const crc = crc32(data);

    const localHeader = concat(
      u32(0x04034b50),      // local file header signature
      u16(20),               // version needed
      u16(0),                 // flags
      u16(0),                 // compression = store
      dosTime, dosDate,
      u32(crc),
      u32(data.length),       // compressed size == uncompressed
      u32(data.length),
      u16(nameBytes.length),
      u16(0),                 // extra length
      nameBytes
    );

    localParts.push(localHeader, data);

    const centralHeader = concat(
      u32(0x02014b50),      // central dir header signature
      u16(20), u16(20),       // version made by / needed
      u16(0), u16(0),          // flags / compression
      dosTime, dosDate,
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0), u16(0),           // extra / comment length
      u16(0), u16(0),            // disk number / internal attrs
      u32(0),                     // external attrs
      u32(offset),                // offset of local header
      nameBytes
    );
    centralParts.push(centralHeader);

    offset += localHeader.length + data.length;
  }

  const centralDir = concat(...centralParts);
  const localData = concat(...localParts);

  const eocd = concat(
    u32(0x06054b50),
    u16(0), u16(0),
    u16(files.length), u16(files.length),
    u32(centralDir.length),
    u32(localData.length), // offset to start of central directory
    u16(0)
  );

  return new Blob([localData, centralDir, eocd], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// ---- Build the OOXML XML parts for a single-sheet workbook ----
function xmlEscape(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function colLetter(index: number): string {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function buildSheetXml(headers: string[], rows: (string | number)[][]): string {
  const cell = (r: number, c: number, val: string | number, bold: boolean) => {
    const ref = `${colLetter(c)}${r}`;
    const s = bold ? ' s="1"' : '';
    return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xmlEscape(val)}</t></is></c>`;
  };

  const headerRow = `<row r="1">${headers.map((h, c) => cell(1, c, h, true)).join('')}</row>`;
  const dataRows = rows.map((row, i) =>
    `<row r="${i + 2}">${row.map((val, c) => cell(i + 2, c, val, false)).join('')}</row>`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${headerRow}${dataRows}</sheetData>
</worksheet>`;
}

function buildXlsxBlob(headers: string[], rows: (string | number)[][]): Blob {
  const encoder = new TextEncoder();

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Bookings" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="1"><fill><patternFill patternType="none"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
</cellXfs>
</styleSheet>`;

  const sheet1 = buildSheetXml(headers, rows);

  const files = [
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rootRels) },
    { name: 'xl/workbook.xml', data: encoder.encode(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
    { name: 'xl/styles.xml', data: encoder.encode(styles) },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(sheet1) },
  ];

  return createZip(files);
}

function triggerXLSXExport(events: any[]) {
  try {
    const headers = ['ID', 'Title/Name', 'Label', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Meeting Link'];
    const rows = events.map(ev => [
      ev.visit_showroom_id || '',
      ev.title || '',
      ev.label || '',
      ev.start_date || '',
      ev.start_time || '',
      ev.end_date || '',
      ev.end_time || '',
      ev.meeting_link || ''
    ]);

    const blob = buildXlsxBlob(headers, rows);
    downloadBlob(blob, `bookings_report_${new Date().toISOString().slice(0, 10)}.xlsx`);

    toast.add({ severity: 'success', summary: 'Success', detail: 'Excel file downloaded successfully.', life: 3000 });
  } catch (error) {
    console.error('XLSX Export Error:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export Excel file.', life: 4000 });
  }
}

// ==========================================================================
// PDF — no JS library can write a PDF binary from scratch reliably here;
// the dependency-free approach is the browser's native print-to-PDF dialog.
// ==========================================================================
function triggerPDFExport(events: any[]) {
  try {
    const reportMonthYear = anchorDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const generatedOn = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const rowsHtml = events.map((ev, i) => `
      <tr>
        <td class="col-idx">${i + 1}</td>
        <td>${xmlEscape(ev.visit_showroom_id)}</td>
        <td>${xmlEscape(ev.title)}</td>
        <td><span class="badge">${xmlEscape(ev.label)}</span></td>
        <td>${xmlEscape(ev.start_date)}</td>
        <td>${xmlEscape(ev.start_time)}</td>
        <td>${xmlEscape(ev.end_date)}</td>
        <td>${xmlEscape(ev.end_time)}</td>
        <td class="col-link">${xmlEscape(ev.meeting_link)}</td>
      </tr>`).join('');

    const html = `
      <html>
      <head>
        <title>Booking Management Report - ${reportMonthYear}</title>
        <style>
          @page {
            size: A3;
            margin: 12mm 12mm 18mm 12mm;
          }

          * { box-sizing: border-box; }

          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* ---- Header (stacked for portrait) ---- */
          .report-header {
            display: flex;
            flex-direction: column;
            border-bottom: 2px solid #1e293b;
            padding-bottom: 10px;
            margin-bottom: 4px;
          }

          .report-title h1 {
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 2px 0;
            color: #0f172a;
            letter-spacing: 0.3px;
          }

          .report-title .subtitle {
            font-size: 11px;
            color: #64748b;
            font-weight: 500;
          }

          .report-meta {
            text-align: left;
            font-size: 9.5px;
            color: #64748b;
            line-height: 1.5;
            margin-top: 6px;
          }

          .report-meta strong {
            color: #334155;
          }

          .summary-bar {
            display: flex;
            gap: 24px;
            font-size: 9.5px;
            color: #475569;
            margin: 10px 0 14px 0;
            padding: 8px 12px;
            background: #f1f5f9;
            border-radius: 4px;
          }

          .summary-bar b { color: #0f172a; }

          /* ---- Table ---- */
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8.5px;
            table-layout: fixed;
          }

          thead {
            display: table-header-group; /* repeat header on every printed page */
          }

          tr {
            page-break-inside: avoid;
          }

          th {
            background: #1e293b;
            color: #f8fafc;
            text-align: left;
            padding: 7px 4px;
            font-weight: 600;
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            border-bottom: 2px solid #0f172a;
          }

          td {
            padding: 5px 4px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          tbody tr:nth-child(even) td {
            background: #f8fafc;
          }

          .col-idx {
            width: 22px;
            color: #94a3b8;
            text-align: center;
          }

          .col-link {
            width: 110px;
            max-width: 110px;
            word-break: break-all;
            white-space: normal;
            color: #2563eb;
          }

          .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 10px;
            background: #e0f2fe;
            color: #0369a1;
            font-size: 8px;
            font-weight: 600;
          }

          /* ---- Footer ---- */
          .report-footer {
            position: fixed;
            bottom: -12mm;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            font-size: 8.5px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 4px;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="report-title">
            <h1>Booking Management Report</h1>
            <div class="subtitle">${reportMonthYear}</div>
          </div>
          <div class="report-meta">
            Generated on <strong>${generatedOn}</strong><br/>
            Total records: <strong>${events.length}</strong>
          </div>
        </div>

        <div class="summary-bar">
          <span>Reporting Period: <b>${reportMonthYear}</b></span>
          <span>Total Bookings: <b>${events.length}</b></span>
        </div>

        <table>
          <thead>
            <tr>
              <th class="col-idx">#</th>
              <th>ID</th>
              <th>Title / Name</th>
              <th>Label</th>
              <th>Start Date</th>
              <th>Start Time</th>
              <th>End Date</th>
              <th>End Time</th>
              <th class="col-link">Link</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>

        <div class="report-footer">
          <span>Booking Management System</span>
          <span>${reportMonthYear} Report</span>
        </div>
      </body>
      </html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) throw new Error('Could not create print frame');
    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };

    toast.add({ severity: 'success', summary: 'Print dialog opened', detail: 'Choose "Save as PDF" in the print dialog to download.', life: 4000 });
  } catch (error) {
    console.error('PDF Export Error:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate PDF. Check console for details.', life: 4000 });
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
                      { label: 'Virtual Tour', value: 'virtulTour' }
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
