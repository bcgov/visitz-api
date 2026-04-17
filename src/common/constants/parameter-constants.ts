const VIEW_MODE = 'Organization';
const CHILD_LINKS = 'None';
const CONTENT_TYPE = 'application/json';
const UNIFORM_RESPONSE = 'y';
const INLINE_ATTACHMENT = 'true';
const GET_CHILDREN = 'all';
const uniformResponseParamName = 'uniformresponse';
const recordCountHeaderName = 'total-record-count';
const checkIdsReturnHeaderName = 'existing-ids';
const inlineAttachmentParamName = 'inlineattachment';
const excludeEmptyFieldsParamName = 'excludeEmptyFieldsInResponse';
const checkIdsParamName = 'checkIds';
const afterParamName = 'after';
const caseIncludeParam = 'includeCase';
const incidentIncludeParam = 'includeIncident';
const srIncludeParam = 'includeSR';
const memoIncludeParam = 'includeMemo';
const queryHierarchyVisitParentClassName = 'ChildVisit';
const queryHierarchyVisitChildClassName = 'VisitDetails';
const queryHierarchyEmployeeParentClassName = 'Employee';
const queryHierarchyEmployeeChildClassName = 'Position';
const queryHierarchyCaseParentClassName = 'Case';
const queryHierarchyCaseChildClassName = 'Position';
const queryHierarchyIncidentParentClassName = 'Incident';
const queryHierarchyIncidentChildAdditionalClassName =
  'IncidentAdditionalInformation';
const queryHierarchyIncidentChildCallClassName = 'IncidentCallInformation';
const queryHierarchyIncidentChildConcernsClassName = 'IncidentConcerns';

const idMaxLength = 100;
const versionNumber = '2';
const idRegex = /^[0-9\-A-Za-z]{1,100}$/;
const multiIdRegex =
  /^(?:[0-9\-A-Za-z]{1,100},)+[0-9\-A-Za-z]{1,100}$|^[0-9\-A-Za-z]{1,100}$/;
const emojiRegex =
  /(?![\u0023\u002A\u0030-\u0039])[\p{Extended_Pictographic}\p{Emoji_Component}]/u;
const mimeTypeRegex = /.(jpg|jpeg|png|pdf)/;
const fileExtensionRegex =
  /(\.[pP][nN][gG]|\.[jJ][pP][eE]?[gG]|\.[pP][dD][fF])$/;
const phoneNumberRegex = /^[0-9]{10,40}$/;
const officeNamesSeparator = '{:|:}';
const idName = 'rowId';
const attachmentIdName = 'attachmentId';
const contactIdName = 'contactId';
const contactLanguageIdName = 'contactLanguageId';
const contactMedicalBehavioralIdName = 'contactMedicalBehavioralId';
const contactEducationIdName = 'contactEducationId';
const supportNetworkIdName = 'supportNetworkId';
const visitIdName = 'visitId';
const safetyAssessmentIdName = 'safetyAssessmentId';
const responseNarrativeIdName = 'responseNarrativeId';
const callInformationIdName = 'callInformationId';
const additionalInformationIdName = 'additionalInformationId';
const caseNotesIdName = 'caseNoteId';
const incidentConcernIdName = 'incidentConcernId';

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
  checkIdsReturnHeaderName,
  inlineAttachmentParamName,
  excludeEmptyFieldsParamName,
  checkIdsParamName,
  afterParamName,
  caseIncludeParam,
  incidentIncludeParam,
  srIncludeParam,
  memoIncludeParam,
  queryHierarchyVisitParentClassName,
  queryHierarchyVisitChildClassName,
  queryHierarchyEmployeeParentClassName,
  queryHierarchyEmployeeChildClassName,
  queryHierarchyCaseParentClassName,
  queryHierarchyCaseChildClassName,
  queryHierarchyIncidentParentClassName,
  queryHierarchyIncidentChildAdditionalClassName,
  queryHierarchyIncidentChildCallClassName,
  queryHierarchyIncidentChildConcernsClassName,
  idMaxLength,
  versionNumber,
  idRegex,
  multiIdRegex,
  emojiRegex,
  mimeTypeRegex,
  fileExtensionRegex,
  phoneNumberRegex,
  officeNamesSeparator,
  idName,
  attachmentIdName,
  contactIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  contactEducationIdName,
  supportNetworkIdName,
  visitIdName,
  safetyAssessmentIdName,
  responseNarrativeIdName,
  callInformationIdName,
  additionalInformationIdName,
  caseNotesIdName,
  incidentConcernIdName,
  casesAttachmentsFieldName,
  incidentsAttachmentsFieldName,
  srAttachmentsFieldName,
  memoAttachmentsFieldName,
  attachmentIdFieldName,
};
