import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SeriesService } from 'src/app/services/series.service';

import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-series-create',
  templateUrl: './series-create.component.html',
  styleUrls: ['./series-create.component.css']
})
export class SeriesCreateComponent implements OnInit {

  @ViewChild('myform', { static: false }) myform: NgForm;
  
  public seriesData: FormGroup;
  public seriesList = [];
  
  private imageObj: File;
  private coverImageObj: File;
  private trailerObj: File;
  selectProfileImg = 0;
  selectCoverImg = 0;
  fileMsg = '';
  type = 'SE';
  selectProfileImgName='';
  selectCoverImgName='';
  public release_date = "";
  public release_time = "";
  selectTrailer = 0;
  trailerFileMsg = '';
  selectTrailerName='';
  
  constructor(
    private _seriesService: SeriesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.seriesData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      director: ['', [Validators.required]],
      starring: ['', [Validators.required]],
      release_date: ['', [Validators.required]],
      release_time: ['', [Validators.required]],
      for_home:[false]
    });
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
  
  onConverImagePicked(event: Event): void {
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

  async submitSeriesAddForm(release_date:any,release_time:any){
    var error = 0;
    const MAIN = this;

    this.fileMsg = '';
    this.trailerFileMsg = '';

    if (this.seriesData.invalid ) {
      error = 1;
    }

    if(this.selectCoverImg != 1){
      return;
    }

    if(this.selectProfileImg != 1){
      return;
    }

    if(this.selectTrailer != 1){
      return;
    }

    if(error == 1){
      return
    }
    
    MAIN.spinner.show();
    
    const contentType = this.imageObj.type;
    const bucket = new S3(
      {
        accessKeyId: environment.AWS_ACCESS_KEY_ID,
            secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
            region: environment.AWS_DEFAULT_REGION
        }
    );
    const params = {
      Bucket: environment.AWS_BUCKET,
        Key: 'series/thumbnail/'+this.imageObj.name,
        Body: this.imageObj,
        ACL: 'public-read',
        ContentType: contentType
      };
    var thumbnail = await bucket.upload(params).promise();
    
    const currentTimeStamp = Date.now();
    
    const contentType1 = this.coverImageObj.type;
    const params1 = {
      Bucket: environment.AWS_BUCKET,
        Key: 'series/conver/'+ currentTimeStamp + '-'+this.coverImageObj.name,
        Body: this.coverImageObj,
        ACL: 'public-read',
        ContentType: contentType1
      };
    var cover = await bucket.upload(params1).promise();
    
    const contentType2 = this.trailerObj.type;
    const params2 = {
        Bucket: environment.AWS_BUCKET,
        Key: 'series/trailer/'+ currentTimeStamp + '-'+this.trailerObj.name,
        Body: this.trailerObj,
        ACL: 'public-read',
        ContentType: contentType2
    };
    var trailer = await bucket.upload(params2).promise();

    this._seriesService.create(this.f, thumbnail.Location, trailer.Location, cover.Location, this.type).subscribe(res => {
      MAIN.spinner.hide()
      if (res && res.code === 200) {
        MAIN.toastr.success('Series Added Successfully');
        MAIN.myform.resetForm();
        MAIN.selectProfileImg = 0;
        MAIN.selectProfileImgName = ''
        MAIN.selectCoverImg = 0;
        MAIN.selectCoverImgName = ''
        MAIN.selectTrailer = 0;
        MAIN.selectTrailerName = ''
        MAIN.type = "SE";
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
