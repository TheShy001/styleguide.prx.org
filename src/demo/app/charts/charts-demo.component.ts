import { Component } from '@angular/core';
import { IndexedChartModel } from 'ngx-prx-styleguide';

@Component({
  selector: 'charts-demo',
  template: `
    <h1>Charts Module</h1>
    <section>
      <h2>Indexed Chart</h2>
      <ul>
        <li>whatev</li>
      </ul>
      <prx-line-indexed-chart [datasets]="datasets" [secondaryDatasets]="secondaryDatasets"
        (toggleDataSet)="onToggleDataSet($event)" (onLabelClick)="singleLine($event)"></prx-line-indexed-chart>
    </section>
  `,
})
export class ChartsDemoComponent {

  datasets: IndexedChartModel[] = [
    { data: [5, 7, 9, 12, 18, 3], color: '#f00', label: 'red' },
    { data: [8, 9, 2, 18, 14, 7], color: '#ff5', label: 'yellow' },
    { data: [10, 4, 7, 5, 13, 10], color: '#0f0', label: 'green' },
    { data: [3, 8, 6, 15, 9, 13], color: '#00f', label: 'blue' }
  ];
  secondaryDatasets: IndexedChartModel[];
  options: string[];

  constructor() {
    this.secondaryDatasets = [{data: [], color: '#000', label: 'average'}];
    for (let i = 0; i < this.datasets[0].data.length; i++) {
      this.secondaryDatasets[0].data.push(
        (this.datasets[0].data[i] +
         this.datasets[1].data[i] +
         this.datasets[2].data[i] +
         this.datasets[3].data[i]) / 4
      );
    }
  }

}