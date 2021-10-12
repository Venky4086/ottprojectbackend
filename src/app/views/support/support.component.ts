import { Component, OnInit } from '@angular/core';

import { SupportService } from '../../services/support.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  public supportDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;

  constructor(
    private _supportService: SupportService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getPageData(this.pageNo);
  }

  async getPageData(page_no){
    const main = this;
    main.spinner.show();
    this._supportService.list({page_no}).subscribe(res => {
      main.spinner.hide();
      if(res && res.code == 200){
        main.supportDetails = res.result.support_list;
        main.totalRecords = res.result.total_support;
      }
    },
    err => main.spinner.hide())
  }
}
