import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../../../services/series.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2'
 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-season-listing',
  templateUrl: './season-listing.component.html',
  styleUrls: ['./season-listing.component.css']
})
export class SeasonListingComponent implements OnInit {

  public series = {
    _id:'',
    season:[]
  };
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;
  public id = '';
  constructor(
    private _seriesService: SeriesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void { 
    const MAIN = this
    this.route.params.subscribe(params => {
      MAIN.id = params['series_id'];
    });
    MAIN.spinner.show();
    MAIN._seriesService.show(MAIN.id).subscribe(res => {
      MAIN.spinner.hide();
      if(res && res.code == 200){
        MAIN.series = res.result;
      }
    },
    err => MAIN.spinner.hide())
  }
  async addnew() {
    const MAIN = this
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will really want to create new season?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        MAIN.spinner.show();
        MAIN._seriesService.addSeason(MAIN.id).subscribe(res => {
          MAIN.spinner.hide();
          if(res && res.code == 200){
            MAIN.ngOnInit();
          }else{
            var msg = res.message ? res.message :'Someting Went Wrong. Please Try again later';
            MAIN.toastr.error(msg);
          }
        },
        err => MAIN.spinner.hide())
      }
    })
  }
  async deleteSeason(season_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = season_id;
    modalRef.componentInstance.series_id = this.id;
    modalRef.componentInstance.msg = 'Are You Realy Want to Delete This Season?';
    modalRef.componentInstance.actionFor = 'series-season';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }
}
