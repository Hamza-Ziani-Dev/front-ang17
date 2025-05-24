import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DasboardService } from 'app/components/services/dasboard.service';
import { ConfigService } from 'app/components/services/config.service';

@Component({
  selector: 'app-done-general-counts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './done-general-counts.component.html',
  styleUrl: './done-general-counts.component.scss'
})
export class DoneGeneralCountsComponent implements OnInit {
isLoading: number = 1;

  sum = 0;
  late = 0;
  normal = 0;
  constructor(private dashboardService: DasboardService,public config : ConfigService) { }

  ngOnInit(): void {

    console.log("DoneGeneralCountsComponent");

    this.dashboardService.getDoneFlowCount().subscribe(res => {

      console.log(res);

      this.normal = res.normal
      this.sum = res.total
      this.late = res.late

      this.isLoading = 0;

    })
  }
}
