const VIEW_MODE = 'Catalog';
const CHILD_LINKS = 'None';
const CONTENT_TYPE = 'application/json';
const UNIFORM_RESPONSE = 'y';
const INLINE_ATTACHMENT = 'true';
const uniformResponseParamName = 'uniformresponse';
const recordCountHeaderName = 'total-record-count';
const inlineAttachmentParamName = 'inlineattachment';
const sinceParamName = 'since';

const idMaxLength = 100;
const versionRegexString = 'v:version(\\d+)';
const idRegex = /^[0-9\-A-Za-z]{1,100}$/;
const idName = 'rowId';
const attachmentIdName = 'attachmentId';

const casesAttachmentsFieldName = 'Case Id';
const incidentsAttachmentsFieldName = 'Incident Id';
const srAttachmentsFieldName = 'SR Id';
const memoAttachmentsFieldName = 'Memo Id';

export {
  VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
  UNIFORM_RESPONSE,
  INLINE_ATTACHMENT,
  uniformResponseParamName,
  recordCountHeaderName,
  inlineAttachmentParamName,
  sinceParamName,
  idMaxLength,
  versionRegexString,
  idRegex,
  idName,
  attachmentIdName,
  casesAttachmentsFieldName,
  incidentsAttachmentsFieldName,
  srAttachmentsFieldName,
  memoAttachmentsFieldName,
};
