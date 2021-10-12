import { Component, OnInit } from '@angular/core';

import { LanguageService } from '../../../services/language.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-language',
  templateUrl: './list-language.component.html'
})
export class ListLanguageComponent implements OnInit {

  public languageDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;

  constructor(
    private _languageService: LanguageService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getPageData(this.pageNo);
  }

  async getPageData(page_no){
    const main = this;
    main.spinner.show();
    this._languageService.list({page_no}).subscribe(res => {
      main.spinner.hide();
      if(res && res.code == 200){
        main.languageDetails = res.result.language_list;
        main.totalRecords = res.result.total_language;
      }
    },
    err => main.spinner.hide())
  }

  async deleteLanguage(category_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = category_id;
    modalRef.componentInstance.msg = 'Are You Realy Want to Delete This Language?';
    modalRef.componentInstance.actionFor = 'language';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }

}
