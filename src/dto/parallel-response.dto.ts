export class ParallelResponse {
  responses?: Array<any>;
  overallError?: any;

  constructor(object) {
    Object.assign(this, object);
  }
}
