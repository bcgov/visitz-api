const baseUrlEnvVarName = 'UPSTREAM_BASE_URL';
const supportNetworkEndpointEnvVarName = 'SUPPORT_NETWORK_ENDPOINT';
const inPersonVisitsEndpointEnvVarName = 'IN_PERSON_VISITS_ENDPOINT';
const postInPersonVisitsEndpointEnvVarName = 'IN_PERSON_VISITS_POST_ENDPOINT';
const attachmentsEndpointEnvVarName = 'ATTACHMENTS_ENDPOINT';
const upstreamAttachmentConstraintNull = 'NULL';
const idirUsernameHeaderField = 'x-idir-username';
const upstreamDateFormat = 'MM/dd/yyyy HH:mm:ss';
const dummyCreatedDate = '01/01/1970 00:00:00';
const caseChildServices = 'Child Services';
const childVisitType = 'In Person Child Youth';
const childVisitIdirFieldName = 'Login Name';
const childVisitEntityIdFieldName = 'Parent Id';
const startRowNumParamName = 'StartRowNum';
const recordCountNeededParamName = 'recordcountneeded';
const pageSizeParamName = 'PageSize';
const getChildrenParamName = 'getChildren';
const createdByFieldName = 'Created By';
const createdByIdFieldName = 'Created By Id';
const createdDateFieldName = 'Created Date';
const updatedByFieldName = 'Updated By';
const updatedByIdFieldName = 'Updated By Id';
const updatedDateFieldName = 'Updated Date';
const trustedIdirHeaderName = 'X-ICM-TrustedUsername';
const pageSizeMin = 1;
const pageSizeMax = 100;
const pageSizeDefault = 10;
const startRowNumMin = 0;
const startRowNumDefault = 0;
const visitDetailsMax = 100;
const visitDescriptionMax = 4000;
const attachmentFormDescriptionMax = 250;
const attachmentCategoryMax = 30;
const attachmentTemplateMax = 1000;
const attachmentStatusMax = 30;

export {
  baseUrlEnvVarName,
  supportNetworkEndpointEnvVarName,
  inPersonVisitsEndpointEnvVarName,
  postInPersonVisitsEndpointEnvVarName,
  attachmentsEndpointEnvVarName,
  upstreamAttachmentConstraintNull,
  idirUsernameHeaderField,
  upstreamDateFormat,
  dummyCreatedDate,
  caseChildServices,
  childVisitType,
  childVisitIdirFieldName,
  childVisitEntityIdFieldName,
  startRowNumParamName,
  recordCountNeededParamName,
  pageSizeParamName,
  getChildrenParamName,
  createdByFieldName,
  createdByIdFieldName,
  createdDateFieldName,
  updatedByFieldName,
  updatedByIdFieldName,
  updatedDateFieldName,
  trustedIdirHeaderName,
  pageSizeMin,
  pageSizeMax,
  pageSizeDefault,
  startRowNumMin,
  startRowNumDefault,
  visitDetailsMax,
  visitDescriptionMax,
  attachmentFormDescriptionMax,
  attachmentCategoryMax,
  attachmentTemplateMax,
  attachmentStatusMax,
};
