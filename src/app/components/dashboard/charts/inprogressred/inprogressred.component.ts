import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions, ChartType } from 'chart.js';
import { DasboardService } from 'app/components/services/dasboard.service';
import colorLib from '@kurkle/color';

@Component({
  selector: 'app-inprogressred',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inprogressred.component.html',
  styleUrl: './inprogressred.component.scss'
})
export class InprogressredComponent implements OnInit {

  public pieChartLabels = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData = {};
  public pieChartType: ChartType = 'radar';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartBackground = [];
  public legend = { postion: 'bottom' };

  isLoading = 1;
  constructor(private dashboardService : DasboardService) { }

  ngOnInit(): void {

    this.dashboardService.getInProgressFlowRed().subscribe(res=>{
      let bg = []
      res.counts.forEach(e => {
        // console.log(this.generateTransparentize() )
        // bg.push(this.generateTransparentize())

      });



      this.pieChartData = [
        { data: [...res.counts], label: 'Flux en retard',backgroundColor: "#40DFEF70" , borderColor: "#40DFEF70"},{ data: [...res.countsRelance], label: 'Flux en retard relancés',backgroundColor: "#E78EA970" , borderColor: "#E78EA970" },
      ];


      this.pieChartLabels = [...res.names]

      this.isLoading = 0;

    })


  }

  activePopover: 'filter' | 'default' | null = null;

togglePopover(name: 'filter' | 'default') {
  this.activePopover = this.activePopover === name ? null : name;
}

  generateTransparentize() {
    var alpha = 0.5;
    return colorLib("#"+Math.floor(Math.random()*16777215).toString(16)).alpha(alpha).rgbString();
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,


  };


}
