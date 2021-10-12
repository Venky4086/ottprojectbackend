import { Component, OnInit } from '@angular/core';
import { CastService } from '../../../services/cast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-list-cast',
  templateUrl: './list-cast.component.html',
  styleUrls: ['./list-cast.component.css']
})

export class ListCastComponent implements OnInit {

  public castDetails: any;
  pageNo: number = 1;
  totalRecords: number = 10;
  count: number = 10;

  constructor(
    private _castService: CastService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getPageData(this.pageNo);
  }

  async getPageData(page){

    this.spinner.show();
    this._castService.list(page).subscribe(res => {
      this.spinner.hide();
      if(res && res.code == 200){
        this.castDetails = res.result.cast_list;
        this.totalRecords = res.result.total_cast;
      }
    },
    err => this.spinner.hide())
  }

}
