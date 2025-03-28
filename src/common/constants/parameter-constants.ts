const VIEW_MODE = 'Organization';
const CHILD_LINKS = 'None';
const CONTENT_TYPE = 'application/json';
const UNIFORM_RESPONSE = 'y';
const INLINE_ATTACHMENT = 'true';
const GET_CHILDREN = 'all';
const uniformResponseParamName = 'uniformresponse';
const recordCountHeaderName = 'total-record-count';
const inlineAttachmentParamName = 'inlineattachment';
const afterParamName = 'after';

const idMaxLength = 100;
const versionNumber = '2';
const idRegex = /^[0-9\-A-Za-z]{1,100}$/;
const emojiRegex =
  /(?![\u0023\u002A\u0030-\u0039])[\p{Extended_Pictographic}\p{Emoji_Component}]/u;
const mimeTypeRegex = /.(jpg|jpeg|png|pdf)/;
const fileExtensionRegex =
  /(\.[pP][nN][gG]|\.[jJ][pP][eE]?[gG]|\.[pP][dD][fF])$/;
const idName = 'rowId';
const attachmentIdName = 'attachmentId';
const contactIdName = 'contactId';
const supportNetworkIdName = 'supportNetworkId';
const visitIdName = 'visitId';
const safetyAssessmentIdName = 'safetyAssessmentId';

const casesAttachmentsFieldName = 'Case Id';
const incidentsAttachmentsFieldName = 'Incident Id';
const srAttachmentsFieldName = 'SR Id';
const memoAttachmentsFieldName = 'Memo Id';
const attachmentIdFieldName = 'Attachment Id';

export {
  VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
  UNIFORM_RESPONSE,
  INLINE_ATTACHMENT,
  GET_CHILDREN,
  uniformResponseParamName,
  recordCountHeaderName,
  inlineAttachmentParamName,
  afterParamName,
  idMaxLength,
  versionNumber,
  idRegex,
  emojiRegex,
  mimeTypeRegex,
  fileExtensionRegex,
  idName,
  attachmentIdName,
  contactIdName,
  supportNetworkIdName,
  visitIdName,
  safetyAssessmentIdName,
  casesAttachmentsFieldName,
  incidentsAttachmentsFieldName,
  srAttachmentsFieldName,
  memoAttachmentsFieldName,
  attachmentIdFieldName,
};
