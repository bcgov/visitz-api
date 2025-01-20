// export class GetRequestDetails {
//   type: string;
//   requests: Array<IndividualRequest>;

//   constructor(object) {
//     Object.assign(this, object);
//   }
// }

export class GetRequestDetails {
  url: string;
  headers;
  params?;

  constructor(object) {
    Object.assign(this, object);
  }
}
