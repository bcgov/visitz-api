export class GetRequestDetails {
  type: string;
  requests: Array<IndividualRequest>;

  constructor(object) {
    Object.assign(this, object);
  }
}

class IndividualRequest {
  url: string;
  headers;
  params?;

  constructor(object) {
    Object.assign(this, object);
  }
}
