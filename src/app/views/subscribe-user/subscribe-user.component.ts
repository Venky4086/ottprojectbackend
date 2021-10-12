
import { Component, OnInit } from '@angular/core';

import { UserManagementService } from '../../services/user-management.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subscribe-user',
  templateUrl: './subscribe-user.component.html',
  styleUrls: ['./subscribe-user.component.css']
})
export class SubscribeUserComponent implements OnInit {

  public subscriptionDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;

  constructor(
    private _userService: UserManagementService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getPageData(this.pageNo);
  }

  async search(text){
    this.pageNo = 1;
    this.getPageData(this.pageNo, text);
  }

  async getPageData(page_no, search=''){
    const main = this;
    main.spinner.show();
    this._userService.subscribeList({page_no, search}).subscribe(res => {
      main.spinner.hide();
      if(res && res.code == 200){
        main.subscriptionDetails = res.result.list;
        main.totalRecords = res.result.total_subscription;
      }
    },
    err => main.spinner.hide())
  }
}
