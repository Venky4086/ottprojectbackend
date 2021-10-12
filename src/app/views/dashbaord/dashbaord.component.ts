import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.css']
})
export class DashbaordComponent implements OnInit {

  public supportDetails: any;
  total_user = 0;
  total_subscribe_user = 0;
  total_video = 0;
  total_shows = 0;
  total_series = 0;
  trending: any = [];
  most_watching:any = [];

  constructor(
    private _adminService: AdminService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    const MAIN = this;
    MAIN.spinner.show();
    this._adminService.dashboard().subscribe(res => {
      MAIN.spinner.hide();
      if(res && res.code == 200){
        const result = res.result;
        MAIN.total_user = result.total_user ? result.total_user : 0;
        MAIN.total_subscribe_user = result.total_subscribe_user ? result.total_subscribe_user : 0;
        MAIN.total_video = result.total_video ? result.total_video : 0;
        MAIN.total_shows = result.total_shows ? result.total_shows : 0;
        MAIN.total_series = result.total_series ? result.total_series : 0;
      }
    },
    err => MAIN.spinner.hide())

    this._adminService.trending().subscribe(res => {
      if(res && res.code == 200){
        const result = res.result;
        MAIN.trending = result;
      }
    },
    err => MAIN.spinner.hide())
  
    this._adminService.mostWatching().subscribe(res => {
      if(res && res.code == 200){
        const result = res.result;
        MAIN.most_watching = result;
      }
    },
    err => MAIN.spinner.hide())

  }

}
