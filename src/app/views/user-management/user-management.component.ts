
import { Component, OnInit } from '@angular/core';

import { UserManagementService } from '../../services/user-management.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';
import { ActiveInActiveComponent } from 'src/app/container/model/active-in-active/active-in-active.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  public userDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;

  constructor(
    private _userService: UserManagementService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
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
    this._userService.list({page_no, search}).subscribe(res => {
      main.spinner.hide();
      if(res && res.code == 200){
        main.userDetails = res.result.user_list;
        main.totalRecords = res.result.total_user;
      }
    },
    err => main.spinner.hide())
  }

  async deleteUser(user_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = user_id;
    modalRef.componentInstance.msg = "Are You Realy Want to Delete This User? This Action Can't be Undo!";
    modalRef.componentInstance.actionFor = 'user';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }

  
  async activeInActive(user_id, action) {
    const modalRef = this.modalService.open(ActiveInActiveComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = user_id;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.actionFor = 'user';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }
}
