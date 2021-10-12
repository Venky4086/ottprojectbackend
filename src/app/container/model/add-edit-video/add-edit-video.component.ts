import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as S3 from 'aws-sdk/clients/s3';
import { LanguageService } from 'src/app/services/language.service';
import { Select2OptionData } from 'ng-select2';
import { NgSelectComponent, Options } from 'select2';

@Component({
  selector: 'app-add-edit-video',
  templateUrl: './add-edit-video.component.html',
  styleUrls: ['./add-edit-video.component.css']
})
export class AddEditVideoComponent implements OnInit {
  @Input() editData = {thumbnail:'', poster:'', _id:'', trailer:[{url:''}], main:[{url:''}], language:{_id:''}};
  @Input() openFor: String = '';

  duration: string;
  file: any;
  selectVideoName = '';
  langValue='';
  public languageOptions: Options;
  selectTrailerName = '';
  selectThumbnailName = '';
  selectPosterName = '';
  selectLanguage = 0;
  selectVideo = 0
  selectTrailer = 0
  selectThumbnail = 0;
  selectPoster = 0;
  videoProgress = 0;
  thumbnailProgress = 0;
  posterProgress = 0;
  trailerProgress = 0;
  selectLanguageData = {id:'', language_name:''};

  private thumbnailObj: File;
  private posterObj: File;
  private trailerObj: File;
  private videoObj: File;
  public languageList: Array<Select2OptionData> = [];
  fileMsg = '';
  public trackData: FormGroup;
  public languageData = [];

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private _languageService: LanguageService,
  ) { }

  ngOnInit() {
    this.languageOptions = {
      multiple: false,
      width: '100%'
    };
    const MAIN = this
    this._languageService.list({}).subscribe(res => {
      if(res && res.code == 200){
        res.result.language_list.forEach((item)=>{
          MAIN.languageData.push({
            id: item._id,
            text: item.name
          });
        });
        this.languageList = MAIN.languageData;
      }
    },
    err => console.log('e'))

    if(MAIN.openFor == 'edit'){
      this.selectThumbnailName = MAIN.editData.thumbnail;
      this.selectPosterName = MAIN.editData.poster;
      if(MAIN.editData.trailer.length > 0){
        this.selectTrailerName = MAIN.editData.trailer[0].url;
        this.selectTrailer = 2;
      }
      this.selectVideoName = MAIN.editData.main[0].url;
      this.selectVideo = 2;
      this.selectPoster = 2;
      this.selectThumbnail = 2;
      this.langValue = MAIN.editData.language._id;
    }

  }
  onPosterPicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'png' || type == 'jpeg' || type == 'jpg') {
      this.posterObj = FILE;
      this.selectPoster = 1;
      this.fileMsg = '';
      this.selectPosterName = FILE.name;
    } else {
      this.selectPoster = -1;
      this.selectPosterName = '';
      this.fileMsg = "Only Image Accepted";
    }
  }
 
  onThumbnailPicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'png' || type == 'jpeg' || type == 'jpg') {
      this.thumbnailObj = FILE;
      this.selectThumbnail = 1;
      this.fileMsg = '';
      this.selectThumbnailName = FILE.name;
    } else {
      this.selectThumbnail = -1;
      this.selectThumbnailName = '';
      this.fileMsg = "Only Image Accepted";
    }
  }

  onTrailerPicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'mp4' || type == 'flv' || type == 'wmv' || type == 'webm') {
      this.trailerObj = FILE;
      this.selectTrailer = 1;
      this.fileMsg = '';
      this.selectTrailerName = FILE.name;
    } else {
      this.selectTrailer = -1;
      this.selectTrailerName = '';
      this.fileMsg = "Only Video Accepted";
    }
  }

  onVideoPicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'mp4' || type == 'flv' || type == 'wmv' || type == 'webm') {
      this.videoObj = FILE;
      this.selectVideo = 1;
      this.fileMsg = '';
      this.selectVideoName = FILE.name;
    } else {
      this.selectVideo = -1;
      this.selectVideoName = '';
      this.fileMsg = "Only Video Accepted";
    }
  }


  get f() { return this.trackData.controls; }
  checkSelectBox(event) {
    this.selectLanguageData.id = event
    this.languageData.forEach((item)=>{
      if(item.id == event){
        this.selectLanguageData.language_name = item.text;
      }
    });
    if(event == '' || event == null){
      this.selectLanguage = -1;
    }else{
      this.selectLanguage = 1;
    }
  }
  async submitEditTrack() {
    const MAIN = this;
    MAIN.fileMsg = '';
    if (MAIN.selectLanguage != 1) {
      return;
    }
    if ((MAIN.selectPoster != 1 && MAIN.selectPoster != 2) || (MAIN.selectThumbnail != 2 && MAIN.selectThumbnail != 1) || (MAIN.selectVideo != 2 && MAIN.selectVideo != 1)) {
      return;
    }

    const bucket = new S3(
      {
        accessKeyId: environment.AWS_ACCESS_KEY_ID,
        secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
        region: environment.AWS_DEFAULT_REGION
      }
    );
    const currentTimeStamp = Date.now();

    // Turn off the timeout
    bucket.config.httpOptions.timeout = 0;

    var thumbnailLocation = '';
    if(MAIN.selectThumbnail == 1){
      var params = {
        Bucket: environment.AWS_BUCKET,
        Key: 'thumbnail/' + currentTimeStamp + '-' + this.thumbnailObj.name,
        Body: this.thumbnailObj,
        ACL: 'public-read',
        ContentType: this.thumbnailObj.type
      };
      bucket.upload(params).on('httpUploadProgress', function(evt) {
        var uploaded = Math.round(evt.loaded / evt.total * 100);
        MAIN.thumbnailProgress = uploaded
      }).send(function(err, data) {
          if (err){
              return;
          }
          MAIN.thumbnailProgress = 100
          thumbnailLocation = data.Location;
      });
    }
    var posterLocation = '';
    if(MAIN.selectPoster == 1){
      params = {
        Bucket: environment.AWS_BUCKET,
        Key: 'poster/' + currentTimeStamp + '-' + this.posterObj.name,
        Body: this.posterObj,
        ACL: 'public-read',
        ContentType: this.posterObj.type
      };
      bucket.upload(params).on('httpUploadProgress', function(evt) {
        var uploaded = Math.round(evt.loaded / evt.total * 100);
        MAIN.posterProgress = uploaded
      }).send(function(err, data) {
          if (err){
              return;
          }
          MAIN.posterProgress = 100
          posterLocation = data.Location;
      });
    }

    var trailerLocation = '';
    if(MAIN.selectTrailer == 1){
      params = {
        Bucket: environment.AWS_BUCKET,
        Key: 'trailer/size-1080/'+this.selectLanguageData.language_name+'/'+currentTimeStamp + '-' + this.trailerObj.name,
        Body: this.trailerObj,
        ACL: 'public-read',
        ContentType: this.trailerObj.type
      };
      bucket.upload(params).on('httpUploadProgress', function(evt) {
        var uploaded = Math.round(evt.loaded / evt.total * 100);
        MAIN.trailerProgress = uploaded
      }).send(function(err, data) {
          if (err){
              console.log(err, err.stack);
              return;
          }
          MAIN.trailerProgress = 100
          trailerLocation = data.Location;
      });

    }

    var videoLocation = '';
    if(MAIN.selectVideo == 1){
      params = {
        Bucket: environment.AWS_BUCKET,
        Key: 'video/size-1080/'+this.selectLanguageData.language_name+'/'+ currentTimeStamp + '-' + this.videoObj.name,
        Body: this.videoObj,
        ACL: 'public-read',
        ContentType: this.videoObj.type
      };

      bucket.upload(params).on('httpUploadProgress', function(evt) {
        var uploaded = Math.round(evt.loaded / evt.total * 100);
        MAIN.videoProgress = uploaded
      }).send(function(err, data) {
          if (err){
              console.log(err, err.stack);
              return;
          }
          MAIN.videoProgress = 100
          videoLocation = data.Location;
          var checkAllFileUploaded = setInterval(()=>{
            if((MAIN.selectThumbnail == 2 || (MAIN.selectThumbnail == 1 && thumbnailLocation !='')) && (MAIN.selectPoster == 2 || (MAIN.selectPoster == 1 && posterLocation !='')) && (MAIN.selectTrailer == 2 || MAIN.selectTrailer == 0 || (MAIN.selectTrailer==1 && trailerLocation !=''))
            ){
              const trackInfo = { 
                  _id: currentTimeStamp, 
                  poster: posterLocation,
                  thumbnail: thumbnailLocation, 
                  trailer: trailerLocation, 
                  video: videoLocation,
                  language_id: MAIN.selectLanguageData.id,
                  language_name: MAIN.selectLanguageData.language_name,
                };
              MAIN.modal.close(trackInfo);
              clearInterval(checkAllFileUploaded)
            }
          }, 1000);
      })
    }else{
      var checkAllFileUploaded = setInterval(()=>{
        if((MAIN.selectThumbnail == 2 || (MAIN.selectThumbnail == 1 && thumbnailLocation !='')) && (MAIN.selectPoster == 2 || (MAIN.selectPoster == 1 && posterLocation !='')) && (MAIN.selectTrailer == 2 || MAIN.selectTrailer == 0 || (MAIN.selectTrailer==1 && trailerLocation !=''))
        ){
          const trackInfo = { 
              poster: posterLocation,
              thumbnail: thumbnailLocation, 
              trailer: trailerLocation, 
              video: videoLocation,
              language_id: MAIN.selectLanguageData.id,
              language_name: MAIN.selectLanguageData.language_name,
            };
          MAIN.modal.close(trackInfo);
          clearInterval(checkAllFileUploaded)
        }
      }, 1000);
    }
  }

  async submitNewVideo() {
    const MAIN = this;
    MAIN.fileMsg = '';
    if (MAIN.selectLanguage != 1) {
      return;
    }
    if (MAIN.selectPoster != 1 || MAIN.selectThumbnail != 1 || MAIN.selectVideo != 1) {
      return;
    }

    const bucket = new S3(
      {
        accessKeyId: environment.AWS_ACCESS_KEY_ID,
        secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
        region: environment.AWS_DEFAULT_REGION
      }
    );
    const currentTimeStamp = Date.now();

    var params = {
      Bucket: environment.AWS_BUCKET,
      Key: 'thumbnail/' + currentTimeStamp + '-' + this.thumbnailObj.name,
      Body: this.thumbnailObj,
      ACL: 'public-read',
      ContentType: this.thumbnailObj.type
    };

    // Turn off the timeout
    bucket.config.httpOptions.timeout = 0;

    var thumbnailLocation = '';
    bucket.upload(params).on('httpUploadProgress', function(evt) {
      var uploaded = Math.round(evt.loaded / evt.total * 100);
      MAIN.thumbnailProgress = uploaded
    }).send(function(err, data) {
        if (err){
            console.log(err, err.stack);
            return;
        }
        MAIN.thumbnailProgress = 100
        thumbnailLocation = data.Location;
    });

    var posterLocation = '';
    params = {
      Bucket: environment.AWS_BUCKET,
      Key: 'poster/' + currentTimeStamp + '-' + this.posterObj.name,
      Body: this.posterObj,
      ACL: 'public-read',
      ContentType: this.posterObj.type
    };
    bucket.upload(params).on('httpUploadProgress', function(evt) {
      var uploaded = Math.round(evt.loaded / evt.total * 100);
      MAIN.posterProgress = uploaded
    }).send(function(err, data) {
        if (err){
            return;
        }
        MAIN.posterProgress = 100
        posterLocation = data.Location;
    });

    var trailerLocation = '';
    if(MAIN.selectTrailer == 1){
      params = {
        Bucket: environment.AWS_BUCKET,
        Key: 'trailer/size-1080/'+this.selectLanguageData.language_name+'/'+currentTimeStamp + '-' + this.trailerObj.name,
        Body: this.trailerObj,
        ACL: 'public-read',
        ContentType: this.trailerObj.type
      };
      bucket.upload(params).on('httpUploadProgress', function(evt) {
        var uploaded = Math.round(evt.loaded / evt.total * 100);
        MAIN.trailerProgress = uploaded
      }).send(function(err, data) {
          if (err){
              console.log(err, err.stack);
              return;
          }
          MAIN.trailerProgress = 100
          trailerLocation = data.Location;
      });

    }
    params = {
      Bucket: environment.AWS_BUCKET,
      Key: 'video/size-1080/'+this.selectLanguageData.language_name+'/'+ currentTimeStamp + '-' + this.videoObj.name,
      Body: this.videoObj,
      ACL: 'public-read',
      ContentType: this.videoObj.type
    };

    var videoLocation = '';
    bucket.upload(params).on('httpUploadProgress', function(evt) {
      var uploaded = Math.round(evt.loaded / evt.total * 100);
      MAIN.videoProgress = uploaded
    }).send(function(err, data) {
        if (err){
            console.log(err, err.stack);
            return;
        }
        MAIN.videoProgress = 100
        videoLocation = data.Location;
        var checkAllFileUploaded = setInterval(()=>{
          if(thumbnailLocation !='' && posterLocation !='' && 
            (MAIN.selectTrailer == 0 || (MAIN.selectTrailer==1 && trailerLocation !=''))
          ){
            const trackInfo = { 
                _id: currentTimeStamp, 
                poster: posterLocation,
                thumbnail: thumbnailLocation, 
                trailer: trailerLocation, 
                video: videoLocation,
                language_id: MAIN.selectLanguageData.id,
                language_name: MAIN.selectLanguageData.language_name,
              };
            MAIN.modal.close(trackInfo);
            clearInterval(checkAllFileUploaded)
          }
        }, 1000);
    })

  }
}