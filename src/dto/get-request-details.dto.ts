export class GetRequestDetails {
  url: string;
  headers;
  params?;
  type?;
  baseSearchSpec?;

  constructor(object) {
    Object.assign(this, object);
  }
}
