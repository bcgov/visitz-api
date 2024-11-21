const VIEW_MODE = 'Catalog';
const CHILD_LINKS = 'None';
const CONTENT_TYPE = 'application/json';
const UNIFORM_RESPONSE = 'y';
const uniformResponseParamName = 'uniformresponse';
const recordCountHeaderName = 'total-record-count';
const sinceParamName = 'since';

const idMaxLength = 100;
const idRegex = /^[0-9\-A-Za-z]{1,100}$/;
const idName = 'rowId';

const casesAttachmentsFieldName = 'No Intervention';
const incidentsAttachmentsFieldName = 'Incident No';
const srAttachmentsFieldName = 'Application No';
const memoAttachmentsFieldName = 'MemoNumber';

export {
  VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
  recordCountHeaderName,
  sinceParamName,
  idMaxLength,
  idRegex,
  idName,
  casesAttachmentsFieldName,
  incidentsAttachmentsFieldName,
  srAttachmentsFieldName,
  memoAttachmentsFieldName,
};
