import _ from "lodash";
import moment from "moment";


/**
 * Formts a date object into correct string format for database
 * @param {Date} dateObject
 */
export function formatDateForDatabase(dateObject) {
  if(dateObject === 'empty') return dateObject;
  if (!dateObject) return undefined;
  return moment(dateObject).format('YYYY-MM-DD');
}
