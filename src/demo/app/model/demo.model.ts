import { Observable } from 'rxjs/Observable';
import { BaseModel, RelatedMap, HalDoc, REQUIRED } from 'ngx-prx-styleguide';

export class DemoModel extends BaseModel {
  public foo: string;
  public complete: boolean;
  public count: number;
  public color: string;
  public colors: string[];
  public script: string;
  public arrival: Date;
  public mustProvide: string;
  public duration: number;

  SETABLE = ['foo', 'complete', 'count', 'color', 'colors', 'script', 'arrival', 'mustProvide', 'duration'];

  VALIDATORS = {
    mustProvide: [REQUIRED(true)]
  };

  constructor(parent: HalDoc, demo?: HalDoc, loadRelated = true) {
    super();
    this.init(parent, demo, loadRelated);
  }

  key(): string { return 'demo-model'; };
  related(): RelatedMap { return {}; };
  decode(): void {
    this.foo = this.doc['foo'];
    this.complete = this.doc['complete'];
    this.count = +this.doc['count'];
    this.color = this.doc['color'];
    this.colors = this.doc['colors'];
    this.script = this.doc['script'];
    this.arrival = this.doc['arrival'];
    this.mustProvide = this.doc['mustProvide'];
    this.duration = this.doc['duration'];
  };
  encode(): {} { return {}; };
  saveNew(data: {}): Observable<HalDoc> { return Observable.of(this.doc); };
}
