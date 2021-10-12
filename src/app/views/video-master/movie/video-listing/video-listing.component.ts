import { Component, OnInit } from '@angular/core';
import { VideoMasterService } from '../../../../services/video-master.service';
import { NgxSpinnerService } from "ngx-spinner";
import {
  VideoDetailComponent
} from 'src/app/container/model/video-detail/video-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';

@Component({
  selector: 'app-video-listing',
  templateUrl: './video-listing.component.html',
  styleUrls: ['./video-listing.component.css']
})
export class VideoListingComponent implements OnInit {

  public movieDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;

  constructor(
    private _videoService: VideoMasterService,
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
    this.pageNo = page;

    this.spinner.show();
    this._videoService.listMovie({page_no:this.pageNo, search}).subscribe(res => {
      this.spinner.hide();
      if(res && res.code == 200){
        this.movieDetails = res.result.movie_list;
        this.totalRecords = parseInt(res.result.total_movie);
      }
    },
    err => this.spinner.hide())
  }

  openVideoDetailModel(data) {
    const modalRef = this.modalService.open(VideoDetailComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.video_detail = data;
    modalRef.result.then((result) => {
    }, err => console.log('error', err));
  }

  async deleteMovie(movie_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = movie_id;
    modalRef.componentInstance.msg = 'Are You Realy Want to Delete This Movie?';
    modalRef.componentInstance.actionFor = 'movie';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }


}
