# JavaScript Date Format Reference

## Complete List of Date Format Options

### Date Methods

| Method | Description | Example Output | Code Example |
|--------|-------------|----------------|--------------|
| `toDateString()` | Returns date portion as readable string | "Mon Jan 01 2024" | `new Date().toDateString()` |
| `toTimeString()` | Returns time portion as readable string | "12:00:00 GMT+0000 (UTC)" | `new Date().toTimeString()` |
| `toISOString()` | Returns ISO 8601 format (UTC) | "2024-01-01T12:00:00.000Z" | `new Date().toISOString()` |
| `toUTCString()` | Returns UTC date string | "Mon, 01 Jan 2024 12:00:00 GMT" | `new Date().toUTCString()` |
| `toLocaleDateString()` | Returns locale-specific date | "1/1/2024" (US) | `new Date().toLocaleDateString()` |
| `toLocaleTimeString()` | Returns locale-specific time | "12:00:00 PM" (US) | `new Date().toLocaleTimeString()` |
| `toLocaleString()` | Returns locale-specific date and time | "1/1/2024, 12:00:00 PM" | `new Date().toLocaleString()` |
| `toString()` | Returns full date string | "Mon Jan 01 2024 12:00:00 GMT+0000" | `new Date().toString()` |
| `toJSON()` | Returns JSON string (ISO format) | "2024-01-01T12:00:00.000Z" | `new Date().toJSON()` |

### Intl.DateTimeFormat Options

| Option | Values | Description | Example |
|--------|--------|-------------|---------|
| `weekday` | `'narrow'`, `'short'`, `'long'` | Day of week format | "Mon", "Monday" |
| `year` | `'numeric'`, `'2-digit'` | Year format | "2024", "24" |
| `month` | `'numeric'`, `'2-digit'`, `'narrow'`, `'short'`, `'long'` | Month format | "1", "01", "Jan", "January" |
| `day` | `'numeric'`, `'2-digit'` | Day format | "1", "01" |
| `hour` | `'numeric'`, `'2-digit'` | Hour format (12 or 24 hour) | "1", "01", "13" |
| `minute` | `'numeric'`, `'2-digit'` | Minute format | "5", "05" |
| `second` | `'numeric'`, `'2-digit'` | Second format | "5", "05" |
| `hour12` | `true`, `false` | 12-hour or 24-hour format | true = "1 PM", false = "13" |
| `timeZoneName` | `'short'`, `'long'` | Timezone name | "PST", "Pacific Standard Time" |
| `era` | `'narrow'`, `'short'`, `'long'` | Era (BC/AD) | "AD", "Anno Domini" |
| `dayPeriod` | `'narrow'`, `'short'`, `'long'` | AM/PM | "AM", "a.m.", "ante meridiem" |
| `fractionalSecondDigits` | `1`, `2`, `3` | Milliseconds digits | 1 = ".0", 3 = ".000" |

### Common Format Patterns

| Pattern | Description | Example Output | Code Example |
|---------|-------------|----------------|--------------|
| `YYYY-MM-DD` | ISO date format | "2024-01-01" | `date.toISOString().split('T')[0]` |
| `MM/DD/YYYY` | US date format | "01/01/2024" | `(date.getMonth()+1).toString().padStart(2,'0') + '/' + date.getDate().toString().padStart(2,'0') + '/' + date.getFullYear()` |
| `DD/MM/YYYY` | European date format | "01/01/2024" | `date.getDate().toString().padStart(2,'0') + '/' + (date.getMonth()+1).toString().padStart(2,'0') + '/' + date.getFullYear()` |
| `YYYY-MM-DD HH:mm:ss` | Date and time | "2024-01-01 12:00:00" | Custom formatting |
| `DD MMM YYYY` | Day Month Year | "01 Jan 2024" | Custom formatting |
| `MMMM DD, YYYY` | Full month name | "January 01, 2024" | `new Intl.DateTimeFormat('en-US', {month: 'long', day: '2-digit', year: 'numeric'}).format(date)` |
| `HH:mm:ss` | 24-hour time | "12:00:00" | Custom formatting |
| `hh:mm:ss A` | 12-hour time with AM/PM | "12:00:00 PM" | Custom formatting |
| `YYYY-MM-DDTHH:mm:ss.sssZ` | ISO 8601 with milliseconds | "2024-01-01T12:00:00.000Z" | `date.toISOString()` |
| `Unix Timestamp` | Milliseconds since epoch | 1704110400000 | `date.getTime()` |
| `Unix Timestamp (seconds)` | Seconds since epoch | 1704110400 | `Math.floor(date.getTime() / 1000)` |

### Individual Date Component Methods

| Method | Returns | Range | Example |
|--------|---------|-------|---------|
| `getFullYear()` | 4-digit year | 1000-9999 | 2024 |
| `getYear()` | Year - 1900 (deprecated) | -1900+ | 124 |
| `getMonth()` | Month index | 0-11 | 0 (January) |
| `getDate()` | Day of month | 1-31 | 1 |
| `getDay()` | Day of week index | 0-6 | 1 (Monday) |
| `getHours()` | Hours | 0-23 | 12 |
| `getMinutes()` | Minutes | 0-59 | 30 |
| `getSeconds()` | Seconds | 0-59 | 45 |
| `getMilliseconds()` | Milliseconds | 0-999 | 123 |
| `getTime()` | Milliseconds since epoch | - | 1704110400000 |
| `getTimezoneOffset()` | Timezone offset in minutes | - | -480 (UTC+8) |

### UTC Methods (getUTC*)

| Method | Returns | Description |
|--------|---------|-------------|
| `getUTCFullYear()` | 4-digit year (UTC) | Year in UTC timezone |
| `getUTCMonth()` | Month index (UTC) | 0-11 in UTC |
| `getUTCDate()` | Day of month (UTC) | 1-31 in UTC |
| `getUTCDay()` | Day of week (UTC) | 0-6 in UTC |
| `getUTCHours()` | Hours (UTC) | 0-23 in UTC |
| `getUTCMinutes()` | Minutes (UTC) | 0-59 in UTC |
| `getUTCSeconds()` | Seconds (UTC) | 0-59 in UTC |
| `getUTCMilliseconds()` | Milliseconds (UTC) | 0-999 in UTC |

### Locale-Specific Formatting Examples

| Locale | Code | Date Format Example | Time Format Example |
|--------|------|---------------------|---------------------|
| US English | `'en-US'` | "1/1/2024" | "12:00:00 PM" |
| UK English | `'en-GB'` | "01/01/2024" | "12:00:00" |
| German | `'de-DE'` | "01.01.2024" | "12:00:00" |
| French | `'fr-FR'` | "01/01/2024" | "12:00:00" |
| Japanese | `'ja-JP'` | "2024/1/1" | "12:00:00" |
| Chinese | `'zh-CN'` | "2024/1/1" | "12:00:00" |
| Spanish | `'es-ES'` | "1/1/2024" | "12:00:00" |
| Italian | `'it-IT'` | "01/01/2024" | "12:00:00" |

### Formatting with Intl.DateTimeFormat Examples

```javascript
// Full date and time
new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full',
  timeStyle: 'full'
}).format(new Date())
// Output: "Monday, January 1, 2024 at 12:00:00 PM Pacific Standard Time"

// Short date
new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short'
}).format(new Date())
// Output: "1/1/24"

// Medium date
new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium'
}).format(new Date())
// Output: "Jan 1, 2024"

// Long date
new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long'
}).format(new Date())
// Output: "January 1, 2024"

// Full date
new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full'
}).format(new Date())
// Output: "Monday, January 1, 2024"

// Short time
new Intl.DateTimeFormat('en-US', {
  timeStyle: 'short'
}).format(new Date())
// Output: "12:00 PM"

// Medium time
new Intl.DateTimeFormat('en-US', {
  timeStyle: 'medium'
}).format(new Date())
// Output: "12:00:00 PM"

// Long time
new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long'
}).format(new Date())
// Output: "12:00:00 PM PST"

// Full time
new Intl.DateTimeFormat('en-US', {
  timeStyle: 'full'
}).format(new Date())
// Output: "12:00:00 PM Pacific Standard Time"
```

### Date Style Options

| Style | Description | Example Output |
|-------|-------------|----------------|
| `'full'` | Complete date/time with weekday and timezone | "Monday, January 1, 2024 at 12:00:00 PM Pacific Standard Time" |
| `'long'` | Long format without weekday | "January 1, 2024 at 12:00:00 PM PST" |
| `'medium'` | Medium format | "Jan 1, 2024, 12:00:00 PM" |
| `'short'` | Short format | "1/1/24, 12:00 PM" |

### Custom Formatting Patterns (Manual)

| Pattern | Code | Example Output |
|---------|------|----------------|
| `YYYY-MM-DD` | `date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0')` | "2024-01-01" |
| `MM/DD/YYYY` | `String(date.getMonth()+1).padStart(2,'0') + '/' + String(date.getDate()).padStart(2,'0') + '/' + date.getFullYear()` | "01/01/2024" |
| `DD-MM-YYYY` | `String(date.getDate()).padStart(2,'0') + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + date.getFullYear()` | "01-01-2024" |
| `HH:mm:ss` | `String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0') + ':' + String(date.getSeconds()).padStart(2,'0')` | "12:00:00" |
| `hh:mm:ss A` | Custom with AM/PM | "12:00:00 PM" |
| `DD MMM YYYY` | `date.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()] + ' ' + date.getFullYear()` | "01 Jan 2024" |
| `DD MMMM YYYY` | With full month name | "01 January 2024" |
| `YYYYMMDD` | Compact date | "20240101" |
| `YYYY-MM-DD HH:mm:ss` | Date and time | "2024-01-01 12:00:00" |
| `YYYY-MM-DDTHH:mm:ssZ` | ISO-like format | "2024-01-01T12:00:00+00:00" |

### Relative Time Formatting

| Format | Description | Example |
|--------|-------------|---------|
| `Intl.RelativeTimeFormat` | Relative time (ago/from now) | "2 days ago", "in 3 hours" |
| `toLocaleString()` with `numeric: 'auto'` | Relative dates | "yesterday", "tomorrow" |

### Notes

- All date methods return values based on the local timezone unless using UTC methods
- Month values are 0-indexed (0 = January, 11 = December)
- Day of week values are 0-indexed (0 = Sunday, 6 = Saturday)
- `getYear()` is deprecated; use `getFullYear()` instead
- For consistent formatting across locales, use `Intl.DateTimeFormat`
- ISO 8601 format (`toISOString()`) is always in UTC timezone
- For timezone-aware formatting, use `Intl.DateTimeFormat` with `timeZone` option

