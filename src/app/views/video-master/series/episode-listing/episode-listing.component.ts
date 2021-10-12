import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../../../services/series.service';

import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';
import { VideoDetailComponent } from 'src/app/container/model/video-detail/video-detail.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-episode-listing',
  templateUrl: './episode-listing.component.html',
  styleUrls: ['./episode-listing.component.css']
})
export class EpisodeListingComponent implements OnInit {

  public episodeDetails: any;
  pageNo: number = 1;
  totalRecords: number = 0;
  count: number = 10;
  public series_id = '';
  public season_id = '';
  constructor(
    private _seriesService: SeriesService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const MAIN = this;
    this.route.params.subscribe(params => {
      MAIN.series_id = params['series_id'];
      MAIN.season_id = params['season_id'];
    });

    this.getPageData(this.pageNo);
  }

  async search(text){
    this.pageNo = 1;
    this.getPageData(this.pageNo, text);
  }

  async getPageData(page, search=''){

    this.spinner.show();
    this._seriesService.listEpisode({series_id:this.series_id, season_id:this.season_id, page:page, search}).subscribe(res => {
      this.spinner.hide();
      if(res && res.code == 200){
        this.episodeDetails = res.result.episode_list;
        this.totalRecords = parseInt(res.result.total_episode);
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

  async deleteEpisode(episode_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = episode_id;
    modalRef.componentInstance.season_id = this.season_id;
    modalRef.componentInstance.series_id = this.series_id;

    modalRef.componentInstance.msg = 'Are You Realy Want to Delete This Episode?';
    modalRef.componentInstance.actionFor = 'series-episode';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }


}
