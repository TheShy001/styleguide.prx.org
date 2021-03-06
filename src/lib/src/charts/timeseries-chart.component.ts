import { Component, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import * as C3 from 'c3';

import { TimeseriesChartModel } from './models/timeseries-chart.model';
import { ChartType } from './models/chart-type.type';
import { ChartOrder } from './models/chart-order.type';

@Component({
  moduleId: module.id,
  selector: 'prx-timeseries-chart',
  template: `<div #chart></div>`,
  styleUrls: ['./chart.css']
})

export class TimeseriesChartComponent implements OnChanges {
  @Input() type: ChartType = 'line';
  @Input() order: ChartOrder = null;
  @Input() stacked = false;
  @Input() datasets: TimeseriesChartModel[];
  @Input() formatX: ((x: number | Date) => string) | string;
  @Input() formatY: ((x: number | Date) => string);
  @Input() minY: number;
  @Input() strokeWidth = 2.5;
  @Input() showPoints = true;
  @Input() pointRadius = 3.25;
  @Input() pointRadiusOnHover = 3.75;
  @Input() paddingRight = 30;

  chart: any;
  @ViewChild('chart') el: ElementRef;

  xDateKeys: any;
  xDates: any[][];
  columnData: any[][];
  groups: string[];
  colors: string[];

  ngOnChanges() {
    if (this.datasets && this.datasets.length > 0) {
      this.xDateKeys = {};
      this.xDates = [];
      this.columnData = [];
      this.groups = [];
      this.colors = [];

      this.datasets.forEach((dataset, index) => {
        this.xDateKeys[dataset.label] = 'x' + index;
        this.xDates.push([this.xDateKeys[dataset.label],
          ...(dataset.data.map(datum => datum.date))
        ]);
        this.columnData.push([dataset.label, ...(dataset.data.map(datum => datum.value))]);
        this.colors.push(dataset.color);

        if (this.stacked) {
          this.groups.push(dataset.label);
        }
      });

      let config: C3.ChartConfiguration = {
        data: {
          type: this.type,
          xs: this.xDateKeys,
          columns: [...this.xDates , ...this.columnData],
          order: <string> this.order
        },
        legend: {
          show: false
        },
        point: {
          show: this.showPoints,
          r: this.pointRadius,
          focus: {
            expand: {
              r: this.pointRadiusOnHover
            }
          }
        },
        color: {
          pattern: this.colors
        },
        padding: {
          right: this.paddingRight
        },
        axis: {
          x: {
            tick: {
              fit: false,
              count: Math.min(20, this.datasets[0].data.length)
            }
          }
        },
        bindto: this.el.nativeElement
      };

      if (this.stacked) {
        config.data['groups'] = [this.groups];
      }

      if (this.formatX) {
        config.axis.x['type'] = 'timeseries';
        config.axis.x.tick['format'] = this.formatX;
      }

      if (this.formatY) {
        config['axis'] = {
          ...config.axis,
          y: {
            tick: {
              format: this.formatY
            }
          }
        };
      }

      if (this.minY !== undefined) {
        config['axis'] = {
          ...config['axis'],
          y: {
            ...config['axis']['y'],
            min: this.minY,
            padding: {top: 20, bottom: 20}
          }
        };
      }

      this.chart = C3.generate(config);

      if (this.strokeWidth && this.type === 'line') {
        // dynamically add style with the equivalence of a deep selector, not sure of a better way
        var collection: HTMLCollection = this.el.nativeElement.getElementsByClassName('c3-line');
        // HTMLCollection is an Array like object but not an Array
        Array.prototype.forEach.call(collection, (element: HTMLElement) => element.style['stroke-width'] = this.strokeWidth + 'px');
      }
    }
  }

  focusChartData(dataId: string) {
    if (this.chart) {
      this.chart.focus(dataId);
    }
  }
}
