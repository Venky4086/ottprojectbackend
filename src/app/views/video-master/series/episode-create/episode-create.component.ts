
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

@Component({
  selector: 'app-episode-create',
  templateUrl: './episode-create.component.html',
  styleUrls: ['./episode-create.component.css']
})
export class EpisodeCreateComponent implements OnInit {
  
  @ViewChild('myform', { static: false }) myform: NgForm;
  
  public videoData: FormGroup;
  public videoList = [];
  public season_id = '';
  public series_id = '';
  
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
      MAIN.series_id = params['series_id'];
      MAIN.season_id = params['season_id'];
    });

    this.videoData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
  openVideoModel(type = 'A', id = '') {
    const modalRef = this.modalService.open(AddEditEpisodeComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    if (type == 'E') {
      modalRef.componentInstance.openFor = 'edit';
      modalRef.componentInstance.id = id;
    } else {
      modalRef.componentInstance.openFor = 'add';
    }
    modalRef.result.then((result) => {
      this.videoList.push(result);
    }, err => console.log('error', err));
  }

  get f() { return this.videoData.controls; }

  async submitVideoAddForm(){
    var error = 0;
    const MAIN = this;
    if (this.videoList.length == 0) {
      this.toastr.error('Please Add atleast 1 Video');
      error = 1;
    }
    if (this.videoData.invalid ) {
      error = 1;
    }
    if(error == 1){
      return
    }
    var extraData = {
      videoList:this.videoList,
      series_id:this.series_id,
      season_id:this.season_id
    }
    MAIN.spinner.show()
    this._seriesService.createEpisode(this.f, extraData).subscribe(res => {
      MAIN.spinner.hide()
      if (res && res.code === 200) {
        MAIN.toastr.success('Episode Added Successfully');
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
