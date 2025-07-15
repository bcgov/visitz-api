export class ParallelResponse {
  responses?: Array<any>;
  overallError?: any;
  orderedTypes?: Array<any>;

  constructor(object) {
    Object.assign(this, object);
  }
}
