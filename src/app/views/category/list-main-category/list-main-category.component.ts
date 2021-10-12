
import { Component, OnInit } from '@angular/core';

import { CategoryService } from '../../../services/category.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-main-category',
  templateUrl: './list-main-category.component.html'
})
export class ListMainCategoryComponent implements OnInit {

  public categoryDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;

  constructor(
    private _categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getPageData(this.pageNo);
  }

  async getPageData(page_no){
    const MAIN = this
    MAIN.spinner.show();
    this._categoryService.mainCategorylist({page_no}).subscribe(res => {
      MAIN.spinner.hide();
      if(res && res.code == 200){
        MAIN.categoryDetails = res.result.category_list;
        MAIN.totalRecords = res.result.total_category;
      }
    },
    err => MAIN.spinner.hide())
  }
  async deleteMainCategory(category_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = category_id;
    modalRef.componentInstance.msg = 'Are You Realy Want to Delete This Category?';
    modalRef.componentInstance.actionFor = 'category';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }

}
