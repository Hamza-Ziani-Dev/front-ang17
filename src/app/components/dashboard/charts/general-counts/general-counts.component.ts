import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { DasboardService } from 'app/components/services/dasboard.service';

@Component({
  selector: 'app-general-counts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-counts.component.html',
  styleUrl: './general-counts.component.scss'
})
export class GeneralCountsComponent implements OnInit{
 isLoading: number = 1;

  sum = 0;
  late = 0;
  normal = 0;
  constructor(
    private dashboardService: DasboardService,
    public config : ConfigService) { }

  ngOnInit(): void {
    this.dashboardService.getInProgressFlowCount().subscribe(res => {
      console.log(res);
      this.normal = res.normal
      this.sum = res.total
      this.late = res.late
      this.isLoading = 0;

    })
  }
}
