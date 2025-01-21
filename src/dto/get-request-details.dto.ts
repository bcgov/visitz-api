export class GetRequestDetails {
  url: string;
  headers;
  params?;

  constructor(object) {
    Object.assign(this, object);
  }
}
