export class QueryHierarchyComponent {
  classExample: any;
  name: string;
  exclude?: Array<string>;
  searchspec?: string;
  childComponents?: Array<QueryHierarchyComponent>;
  constructor(object) {
    Object.assign(this, object);
  }
}
