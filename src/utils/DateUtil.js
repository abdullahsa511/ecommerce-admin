import moment from 'moment';

export const formatFrontendDate = (date) => {
    return moment(date).format("ddd D/M/YY");
};

export const formatBackendDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

/** Parses API date/datetime strings into a Date (invalid input yields undefined). */
export const parseDateString = (dateStr) => {
    if (!dateStr) return undefined;
    const m = moment(dateStr);
    return m.isValid() ? m.toDate() : undefined;
};

/** Formats a datetime string for display (time portion). */
export const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const m = moment(dateTimeStr);
    return m.isValid() ? m.format('h:mm A') : '';
};