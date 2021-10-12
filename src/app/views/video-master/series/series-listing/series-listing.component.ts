import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../../../services/series.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';

@Component({
  selector: 'app-series-listing',
  templateUrl: './series-listing.component.html',
  styleUrls: ['./series-listing.component.css']
})
export class SeriesListingComponent implements OnInit {

  public seriesDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;

  constructor(
    private _seriesService: SeriesService,
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

  async getPageData(page, search=''){
    this.spinner.show();
    this._seriesService.list({page, search}).subscribe(res => {
      this.spinner.hide();
      if(res && res.code == 200){
        this.seriesDetails = res.result.series_list;
        this.totalRecords = parseInt(res.result.total_series);
      }
    },
    err => this.spinner.hide())
  }

  async deleteSeries(series_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = series_id;
    modalRef.componentInstance.msg = 'Are You Realy Want to Delete This Series?';
    modalRef.componentInstance.actionFor = 'series';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }
}
