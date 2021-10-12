import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SeriesService } from 'src/app/services/series.service';

import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-series-edit',
  templateUrl: './series-edit.component.html',
  styleUrls: ['./series-edit.component.css']
})
export class SeriesEditComponent implements OnInit {

  @ViewChild('myform', { static: false }) myform: NgForm;
  
  public seriesData: FormGroup;
  public seriesList = [];
  
  private imageObj: File;
  private coverImageObj: File;
  private trailerObj: File;
  selectProfileImg = 0;
  selectProfileImgName='';
  selectCoverImg = 0;
  selectCoverImgName='';
  fileMsg = '';
  type = 'SE';

  selectTrailer = 0;
  trailerFileMsg = '';
  selectTrailerName='';
  public series_id = '';
  
  constructor(
    private _seriesService: SeriesService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const MAIN = this;
    this.route.params.subscribe(params => {
      MAIN.series_id = params['id'];
    });

    this.seriesData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      director: ['', [Validators.required]],
      starring: ['', [Validators.required]],
      for_home:[false]
    });
    
    MAIN.spinner.show();
    MAIN._seriesService.show(MAIN.series_id).subscribe(res => {
      MAIN.spinner.hide();
      if(res && res.code == 200){
        var detail = res.result;
        MAIN.seriesData.setValue({
          name: detail.name,
          description: detail.description,
          director: detail.director,
          starring: detail.starring,
          for_home: detail.for_home
        });
        MAIN.selectProfileImgName = detail.thumbnail.split('/').pop();
        MAIN.selectProfileImg = 2;
        MAIN.selectCoverImgName = detail.cover.split('/').pop();
        MAIN.selectCoverImg = 2;
        MAIN.selectTrailerName = detail.trailer.split('/').pop();
        MAIN.selectTrailer = 2;
        MAIN.type = detail.type;
      }
    },
    err => MAIN.spinner.hide())
  }

  setType(event){
    if(event){
      this.type = 'SE';
    }else{
      this.type = 'SH';
    }
  }

  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'png' || type == 'jpeg' || type == 'jpg'){
      this.imageObj = FILE;
      this.selectProfileImg = 1;
      this.selectProfileImgName = FILE.name
    }else{
      this.selectProfileImg = -1;
      this.selectProfileImgName = '';
      this.fileMsg = "Only Image Accepted";
    }
  }
  
  onCoverImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'png' || type == 'jpeg' || type == 'jpg'){
      this.coverImageObj = FILE;
      this.selectCoverImg = 1;
      this.selectCoverImgName = FILE.name
    }else{
      this.selectCoverImg = -1;
      this.selectCoverImgName = '';
      this.fileMsg = "Only Image Accepted";
    }
  }
  
  onTrailerPicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'mp4' || type == 'mov' || type == 'wmv' || type == 'flv' || type == 'avi'){
      this.trailerObj = FILE;
      this.selectTrailer = 1;
      this.selectTrailerName = FILE.name
    }else{
      this.selectTrailer = -1;
      this.selectTrailerName = '';
      this.trailerFileMsg = "Only video Accepted";
    }
  }

  get f() { return this.seriesData.controls; }

  async submitSeriesAddForm(){
    var error = 0;
    const MAIN = this;

    this.fileMsg = '';
    this.trailerFileMsg = '';

    if (this.seriesData.invalid ) {
      error = 1;
    }

    if(this.selectProfileImg != 1 && this.selectProfileImg != 2){
      return;
    }

    if(this.selectCoverImg != 1 && this.selectCoverImg != 2){
      return;
    }

    if(this.selectTrailer != 1 && this.selectTrailer != 2){
      return;
    }

    if(error == 1){
      return
    }
    
    MAIN.spinner.show();
    
    var otherData = {id: this.series_id, type:this.type, thumbnail:'', cover:'', trailer:''};
    const bucket = new S3(
      {
        accessKeyId: environment.AWS_ACCESS_KEY_ID,
            secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
            region: environment.AWS_DEFAULT_REGION
        }
    );
    const currentTimeStamp = Date.now();

    if(this.selectProfileImg != 2){
      const contentType = this.imageObj.type;
      const params = {
        Bucket: environment.AWS_BUCKET,
          Key: 'series/thumbnail/'+this.imageObj.name,
          Body: this.imageObj,
          ACL: 'public-read',
          ContentType: contentType
        };
      var thumbnail = await bucket.upload(params).promise();
      otherData.thumbnail = thumbnail.Location;
    }
    if(this.selectCoverImg != 2){
      const contentType1 = this.coverImageObj.type;
      const params1 = {
        Bucket: environment.AWS_BUCKET,
          Key: 'series/cover/'+ currentTimeStamp + '-' +this.coverImageObj.name,
          Body: this.coverImageObj,
          ACL: 'public-read',
          ContentType: contentType1
        };
      var cover = await bucket.upload(params1).promise();
      otherData.cover = cover.Location;
    }
    if(this.selectTrailer != 2){
      const contentType2 = this.trailerObj.type;
      const params2 = {
          Bucket: environment.AWS_BUCKET,
          Key: 'series/trailer/'+ currentTimeStamp + '-'+this.trailerObj.name,
          Body: this.trailerObj,
          ACL: 'public-read',
          ContentType: contentType2
      };
      var trailer = await bucket.upload(params2).promise();
      otherData.trailer = trailer.Location;
    } 
    this._seriesService.updateSeries(this.f, otherData).subscribe(res => {
      MAIN.spinner.hide()
      if (res && res.code === 200) {
        MAIN.toastr.success('Details Updated Successfully');
        MAIN.myform.resetForm();
        MAIN.selectProfileImg = 0;
        MAIN.selectProfileImgName = ''
        MAIN.selectCoverImg = 0;
        MAIN.selectCoverImgName = ''
        MAIN.selectTrailer = 0;
        MAIN.selectTrailerName = ''
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
