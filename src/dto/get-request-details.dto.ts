export class GetRequestDetails {
  url: string;
  headers;
  params?;
  type?;

  constructor(object) {
    Object.assign(this, object);
  }
}
