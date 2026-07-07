/** Normalized booking row for calendar rendering (from store groups). */
export interface FlatBookingEvent {
  id: string;
  visit_showroom_id: string;
  groupTitle: string;
  index: number;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  title: string;
  label: string;
  tour_type: string;
  enquiry_type: string;
  /** Milliseconds since epoch */
  startMs: number;
  endMs: number;
  allDay: boolean;
}

export interface BookingItemLike {
  visit_showroom_id?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  title?: string;
  label?: string;
  tour_type?: string;
  enquiry_type?: string;
}

export interface BookingGroupLike {
  title: string;
  data?: BookingItemLike[];
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

/** Normalizes "HH:mm" or "HH:mm:ss" for ISO datetime strings. */
export function normalizeTime(t: string | undefined): string {
  if (!t) return '00:00:00';
  const parts = String(t).split(':');
  if (parts.length === 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
  if (parts.length >= 3) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${String(parts[2]).slice(0, 2).padStart(2, '0')}`;
  }
  return '00:00:00';
}

export function formatYMD(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function formatTimeOfDay(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function parseStartMs(item: BookingItemLike | undefined, groupTitle: string): number {
  const dateStr = item?.start_date || groupTitle;
  if (!dateStr) return Date.now();
  if (item?.start_time) {
    const ms = new Date(`${dateStr}T${normalizeTime(item.start_time)}`).getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  const day = new Date(`${dateStr}T00:00:00`);
  return day.getTime();
}

function parseEndMs(item: BookingItemLike | undefined, startMs: number): number {
  if (item?.end_date && item?.end_time) {
    const ms = new Date(`${item.end_date}T${normalizeTime(item.end_time)}`).getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  if (item?.end_date) {
    const ms = new Date(`${item.end_date}T23:59:59`).getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  return startMs + 60 * 60 * 1000;
}

export function flattenBookingGroups(groups: BookingGroupLike[]): FlatBookingEvent[] {
  return groups.flatMap((group) =>
    (group.data ?? []).map((item, index) => {
      const startMs = parseStartMs(item, group.title);
      const endMs = parseEndMs(item, startMs);
      const allDay = !item?.start_time;

      return {
        id: `${group.title}-${index}`,
        visit_showroom_id: item?.visit_showroom_id ?? '',
        groupTitle: group.title,
        index,
        start_date: item?.start_date ?? group.title,
        end_date: item?.end_date,
        start_time: item?.start_time,
        end_time: item?.end_time,
        title: item?.title ?? item?.label ?? 'Booking',
        label: item?.label ?? item?.title ?? 'Booking',
        tour_type: item?.tour_type ?? '',
        enquiry_type: item?.enquiry_type ?? '',
        startMs,
        endMs,
        allDay
      };
    })
  );
}

export function eventsForDate(events: FlatBookingEvent[], day: Date): FlatBookingEvent[] {
  const ymd = formatYMD(day);
  return events
    .filter((e) => formatYMD(new Date(e.startMs)) === ymd)
    .sort((a, b) => a.startMs - b.startMs);
}

export function eventsOverlappingDay(events: FlatBookingEvent[], day: Date): FlatBookingEvent[] {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const end = start + 24 * 60 * 60 * 1000;
  return events
    .filter((e) => e.startMs < end && e.endMs > start)
    .sort((a, b) => a.startMs - b.startMs);
}

export interface MonthCell {
  date: Date;
  isCurrentMonth: boolean;
}

/** 42 cells (6×7), Sunday-first week to match common calendar UIs. */
export function buildMonthCells(anchorInMonth: Date): MonthCell[] {
  const year = anchorInMonth.getFullYear();
  const month = anchorInMonth.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: MonthCell[] = [];
  let day = 1 - startPad;
  while (cells.length < 42) {
    const date = new Date(year, month, day);
    const isCurrentMonth = day >= 1 && day <= daysInMonth;
    cells.push({ date, isCurrentMonth });
    day++;
  }
  return cells;
}

export function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, d.getDate());
}

export function addDays(d: Date, delta: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + delta);
  return n;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Stable colour from string for event chips. */
export function eventColour(seed: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return {
    bg: `hsl(${h} 55% 42%)`,
    fg: '#fff'
  };
}
