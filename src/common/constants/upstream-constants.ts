const baseUrlEnvVarName = 'UPSTREAM_BASE_URL';
const supportNetworkEndpointEnvVarName = 'SUPPORT_NETWORK_ENDPOINT';
const inPersonVisitsEndpointEnvVarName = 'IN_PERSON_VISITS_ENDPOINT';
const postInPersonVisitsEndpointEnvVarName = 'IN_PERSON_VISITS_POST_ENDPOINT';
const attachmentsEndpointEnvVarName = 'ATTACHMENTS_ENDPOINT';
const idirUsernameHeaderField = 'x-idir-username';
const upstreamDateFormat = 'MM/dd/yyyy HH:mm:ss';
const childVisitType = 'In Person Child Youth';
const childVisitIdirFieldName = 'Login Name';
const childVisitEntityIdFieldName = 'Parent Id';
const startRowNumParamName = 'StartRowNum';
const recordCountNeededParamName = 'recordcountneeded';
const pageSizeParamName = 'PageSize';
const pageSizeMin = 1;
const pageSizeMax = 100;
const pageSizeDefault = 10;
const startRowNumMin = 0;
const startRowNumDefault = 0;
const visitDetailsMax = 100;
const visitDescriptionMax = 4000;

export {
  baseUrlEnvVarName,
  supportNetworkEndpointEnvVarName,
  inPersonVisitsEndpointEnvVarName,
  postInPersonVisitsEndpointEnvVarName,
  attachmentsEndpointEnvVarName,
  idirUsernameHeaderField,
  upstreamDateFormat,
  childVisitType,
  childVisitIdirFieldName,
  childVisitEntityIdFieldName,
  startRowNumParamName,
  recordCountNeededParamName,
  pageSizeParamName,
  pageSizeMin,
  pageSizeMax,
  pageSizeDefault,
  startRowNumMin,
  startRowNumDefault,
  visitDetailsMax,
  visitDescriptionMax,
};
