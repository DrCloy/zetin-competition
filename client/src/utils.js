import moment from 'moment';

// https://www.codegrepper.com/code-examples/javascript/javascript+bytes+to+human+readable+size
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(str) {
  return moment(str).format('YYYY-MM-DD');
}

function checkDateTerm(comp, start, end) {
  const c = moment(comp);
  const s = moment(start);
  const e = moment(end);

  if (s.diff(c) <= 0 && c.diff(e) <= 0) return true;
  else return false;
}

export { formatBytes, formatDate, checkDateTerm };
