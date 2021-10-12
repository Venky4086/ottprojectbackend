import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import {
  AddEditEpisodeComponent
} from 'src/app/container/model/add-edit-episode/add-edit-episode.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SeriesService } from 'src/app/services/series.service';
import { ActivatedRoute } from '@angular/router';
import { AddEditVideoComponent } from 'src/app/container/model/add-edit-video/add-edit-video.component';
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';


@Component({
  selector: 'app-episode-edit',
  templateUrl: './episode-edit.component.html',
  styleUrls: ['./episode-edit.component.css']
})
export class EpisodeEditComponent implements OnInit {
  
  @ViewChild('myform', { static: false }) myform: NgForm;
  
  public videoData: FormGroup;
  public videoList = [];
  public season_id = '';
  public series_id = '';
  public id='';
  public episodeDetail = {
    _id:'',
    sub_category:[],
    video:[]
  };

  constructor(
    private _seriesService: SeriesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const MAIN = this;
    this.route.params.subscribe(params => {
      MAIN.id = params['episode_id'];
      MAIN.series_id = params['series_id'];
      MAIN.season_id = params['season_id'];
    });

    this.videoData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    MAIN.spinner.show()
    this._seriesService.singleEpisode(this.id).subscribe(async res => {
      if(res && res.code == 200){
        var detail = res.result.detail;
        MAIN.episodeDetail = detail;
        MAIN.spinner.hide()
         
        MAIN.videoData.setValue({
          name: detail.name,
          description: detail.description
        });
      }else{
        alert('Episode Not found in this url');
      }
    },
    err => console.log('e'))
    
  }

  async deleteVideo(category_id) {
    if(this.episodeDetail.video.length == 1){
      this.toastr.warning("You Can't delete all the video's, 1 should be needed");
      return 1
    }
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    var MAIN = this;
    modalRef.componentInstance.id = category_id;
    modalRef.componentInstance.master = this.episodeDetail._id;
    modalRef.componentInstance.msg = "Are You Realy Want to Delete This Video? This Action Can't be undo!";
    modalRef.componentInstance.actionFor = 'video-language';
    modalRef.result.then((result) => {
        MAIN.ngOnInit();
    }, () => {
      console.log('Backdrop click')
    })
  }

  openVideoModel(type = 'A', data={_id:''}) {
    var MAIN = this;
    const modalRef = this.modalService.open(AddEditEpisodeComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    if (type == 'E') {
      modalRef.componentInstance.openFor = 'edit';
      console.log(data);
      modalRef.componentInstance.editData = data;
    } else {
      modalRef.componentInstance.openFor = 'add';
    }
    modalRef.result.then((result) => {
      result.id = MAIN.episodeDetail._id;
      MAIN.spinner.show()
      if(type=='A'){
        this._seriesService.addEpisodeWithNewLanguage(result).subscribe(res => {
          MAIN.spinner.hide()
          if (res && res.code === 200) {
            MAIN.toastr.success('Video Added Successfully');
            MAIN.ngOnInit();
          } else {
            var msg = res.message ? res.message : 'Someting Went Wrong. Please Try again later';  
            MAIN.toastr.error(msg);
          }
        }, err => {
          MAIN.spinner.hide()
        },() =>
          MAIN.spinner.hide()
        );
      }else{
        result.video_id = MAIN.episodeDetail._id;
        result.id = data._id;

        this._seriesService.editEpisodeWithNewLanguage(result).subscribe(res => {
          MAIN.spinner.hide()
          if (res && res.code === 200) {
            MAIN.toastr.success('Video Update Successfully');
            MAIN.ngOnInit();
          } else {
            var msg = res.message ? res.message : 'Someting Went Wrong. Please Try again later';  
            MAIN.toastr.error(msg);
          }
        }, err => {
          MAIN.spinner.hide()
        },() =>
          MAIN.spinner.hide()
        );
      }
    }, err => console.log('error', err));
  }
 
  get f() { return this.videoData.controls; }

  async submitVideoAddForm(){
    var error = 0;
    const MAIN = this;
    if (this.videoData.invalid ) {
      error = 1;
    }
    if(error == 1){
      return
    }
    var extraData = {
      id:this.id
    }
    MAIN.spinner.show()
    this._seriesService.editEpisode(this.f, extraData).subscribe(res => {
      MAIN.spinner.hide()
      if (res && res.code === 200) {
        MAIN.toastr.success('Episode Edit Successfully');
        MAIN.myform.resetForm();
        MAIN.videoList = [];
        MAIN.ngOnInit();
      } else {
        MAIN.toastr.error('Someting Went Wrong. Please Try again later');
      }
    }, err => {
      MAIN.spinner.hide()
    },
      () =>
      MAIN.spinner.hide()
    );

  }
}
