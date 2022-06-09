import moment from 'moment';
import MarkdownIt from 'markdown-it';

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

// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
const markdown = new MarkdownIt();
// Remember old renderer, if overridden, or proxy to default renderer
let defaultRender =
  markdown.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  var aIndex = tokens[idx].attrIndex('target');
  var rIndex = tokens[idx].attrIndex('rel');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
  }

  if (rIndex < 0) {
    tokens[idx].attrPush(['rel', 'noreferrer']);
  } else {
    tokens[idx].attrs[aIndex][1] = 'noreferrer';
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export { formatBytes, formatDate, checkDateTerm, markdown };
