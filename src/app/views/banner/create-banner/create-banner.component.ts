import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BannerService } from 'src/app/services/banner.service';

import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../../../environments/environment';
import { Select2OptionData } from 'ng-select2';
import { NgSelectComponent, Options } from 'select2';
import { CastService } from 'src/app/services/cast.service';
import { CategoryService } from 'src/app/services/category.service';
import { VideoMasterService } from 'src/app/services/video-master.service';
import { SeriesService } from 'src/app/services/series.service';


@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html'
})

export class CreateBannerComponent implements OnInit {
    constructor(
      private _bannerService: BannerService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder,
      private _categoryService: CategoryService,
      private _videoService: VideoMasterService,
      private _seriesService: SeriesService,
    ) { }

  @ViewChild('myform', { static: false }) myform: NgForm;
  @ViewChild('takeInput', {static: false}) InputVar: ElementRef; 

  public categoryOptions: Options; 
  public subCategoryOptions: Options;
  public videoOptions: Options;
  public seriesOptions: Options;
  public masterCategoryList: Array<Select2OptionData> = [];
  public subCategoryList: Array<Select2OptionData> = [];
  public videoList: Array<Select2OptionData> = [];
  public seriesList: Array<Select2OptionData> = [];
  public categoryId = ''
  public subCategoryId = '';
  public videoId = '';
  public seriesId = '';

  private imageObj: File;
  selectProfileImg = 0;
  fileMsg = '';
  selectProfileImgName='';
  ngOnInit(): void {
    this.selectProfileImg = 0;
    this.fileMsg = '';
    this.selectProfileImgName='';
  
    this.seriesOptions = this.videoOptions = this.categoryOptions = this.subCategoryOptions = {
      multiple: false,
      width: '100%'
    }

    this.getVideo();
    this.getSeriesShow();
    this.getMainCategory();
  }

  checkSelectBox (event, type) {
    if(event){
        switch (type) {
        case 'SE':
          this.seriesId = event; 
          this.categoryId = ''; 
          this.subCategoryId = ''; 
          this.videoId = ''; 
          this.getVideo();
          this.getMainCategory();
          break;
        case 'C':
          this.categoryId = event; 
          this.seriesId = ''; 
          this.videoId = ''; 
          this.getVideo();
          this.getSeriesShow();
          this.refreshSubCategory();
          break;
        case 'S':
          this.subCategoryId = event; 
          break;
        case 'V':
          this.videoId = event; 
          this.categoryId = ''; 
          this.seriesId = ''; 
          this.subCategoryId = ''; 
          this.getSeriesShow();
          this.getMainCategory();
          break;
        default:
          break;
      }
    }
  }

  getMainCategory() {
    this.subCategoryList = [];
    this.masterCategoryList = [];

    this._categoryService.mainCategorylist({}).subscribe(res => {
      if(res && res.code == 200){
        const masterCategory = [];
        res.result.category_list.forEach((item)=>{
          masterCategory.push({
            id: item._id,
            text: item.name
          });
        });
        this.masterCategoryList = masterCategory;
        this.categoryId = '';
      }
    },
    err => console.log('e'))
  }

  getVideo() {
    this.videoList = [];
    this._videoService.listMovie({}).subscribe(res => {
      if(res && res.code == 200){
        const videoCategory = [];
        res.result.movie_list.forEach((item)=>{
          videoCategory.push({
            id: item._id,
            text: item.name
          });
        });
        this.videoList = videoCategory;
      }
    },
    err => console.log('e'))
  }

  getSeriesShow() {
    this.seriesList = [];
    this._seriesService.list({}).subscribe(res => {
      if(res && res.code == 200){
        const seriesCategory = [];
        res.result.series_list.forEach((item)=>{
          seriesCategory.push({
            id: item._id,
            text: item.name
          });
        });
        this.seriesList = seriesCategory;
      }
    },
    err => console.log('e'))
  }
  refreshSubCategory() {
    this.subCategoryList = [];
    this._categoryService.subCategorylist({
      category_ids:this.categoryId
    }).subscribe(res => {
      if(res && res.code == 200){
        const subCategory = [];
        res.result.category_list.forEach((item)=>{
          subCategory.push({
            id: item._id,
            text: item.name
          });
        });
        this.subCategoryList = subCategory;
        this.subCategoryId = '';
      }
    },
    err => console.log('e'))
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

  async submitBannerAddForm(){
    var error = 0;
    if(this.selectProfileImg != 1){
      return;
    }
    if(this.videoId == ''){
      if(this.seriesId == ''){
        if(this.categoryId == ''){
          error = 1;
        }
        if(this.subCategoryId == ''){
          error = 1;
        }
      }
    }
    if(error == 1){
      return
    }
    const MAIN = this;

    const currentTimeStamp = Date.now();

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
        Key: 'banner/'+ currentTimeStamp + '-' +this.imageObj.name,
        Body: this.imageObj,
        ACL: 'public-read',
        ContentType: contentType
    };
    var s3Upload = await bucket.upload(params).promise();

    this._bannerService.create({category_id:MAIN.categoryId, sub_category_id:MAIN.subCategoryId, video_id:MAIN.videoId, series_id:MAIN.seriesId, url:s3Upload.Location}).subscribe(res => {
      if (res && res.code === 200) {
        MAIN.toastr.success('Banner Added');
        MAIN.myform.resetForm();

        MAIN.categoryId = '';
        MAIN.subCategoryId = '';
        MAIN.videoId = '';
        MAIN.selectProfileImg = 0;
        MAIN.fileMsg = '';
        MAIN.InputVar.nativeElement.value = ""; 
        MAIN.selectProfileImgName='';

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
    MAIN.spinner.hide()
  }
}
