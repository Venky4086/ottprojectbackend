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
  selector: 'app-add-edit-episode',
  templateUrl: './add-edit-episode.component.html',
  styleUrls: ['./add-edit-episode.component.css']
})
export class AddEditEpisodeComponent implements OnInit {
  @Input() editData = {thumbnail:'', _id:'', main:[{url:''}], language:{_id:''}};
  @Input() openFor: String = '';

  duration: string;
  file: any;
  selectVideoName = '';
  langValue='';
  public languageOptions: Options;
  selectThumbnailName = '';
  selectLanguage = 0;
  selectVideo = 0
  selectThumbnail = 0;
  videoProgress = 0;
  thumbnailProgress = 0;
  trailerProgress = 0;
  selectLanguageData = {id:'', language_name:''};
  videofileMsg = '';
  thumbnailfileMsg = '';

  private thumbnailObj: File;
  private videoObj: File;
  public languageList: Array<Select2OptionData> = [];
  public trackData: FormGroup;
  public languageData = [];

  constructor(
    public modal: NgbActiveModal,
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
      this.selectVideoName = MAIN.editData.main[0].url;
      this.selectVideo = 2;
      this.selectThumbnail = 2;
      this.langValue = MAIN.editData.language._id;
    }
  }
 
  onThumbnailPicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'png' || type == 'jpeg' || type == 'jpg') {
      this.thumbnailObj = FILE;
      this.selectThumbnail = 1;
      this.thumbnailfileMsg = '';
      this.selectThumbnailName = FILE.name;
    } else {
      this.selectThumbnail = -1;
      this.selectThumbnailName = '';
      this.thumbnailfileMsg = "Only Image Accepted";
    }
  }

  onVideoPicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    let type = FILE.type;
    type = type.split('/')[1];
    if (type == 'mp4' || type == 'flv' || type == 'wmv' || type == 'webm') {
      this.videoObj = FILE;
      this.selectVideo = 1;
      this.videofileMsg = '';
      this.selectVideoName = FILE.name;
    } else {
      this.selectVideo = -1;
      this.selectVideoName = '';
      this.videofileMsg = "Only Video Accepted";
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
    MAIN.thumbnailfileMsg = '';
    MAIN.videofileMsg = '';
    if (MAIN.selectLanguage != 1 && MAIN.selectLanguage != 2) {
      return;
    }
    if (MAIN.selectVideo != 1 && MAIN.selectVideo != 2) {
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

    var thumbnailLocation = '';
    if(MAIN.selectThumbnail == 1){
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
            if(MAIN.selectThumbnail == 2 || MAIN.selectThumbnail == 0 || (MAIN.selectThumbnail==1 && thumbnailLocation !='')){
              const trackInfo = { 
                  thumbnail: thumbnailLocation,
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
        if(MAIN.selectThumbnail == 2 || MAIN.selectThumbnail == 0 || (MAIN.selectThumbnail==1 && thumbnailLocation !='')){
          const trackInfo = { 
              thumbnail: thumbnailLocation,
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
    MAIN.thumbnailfileMsg = '';
    MAIN.videofileMsg = '';
    if (MAIN.selectLanguage != 1) {
      return;
    }
    if (MAIN.selectVideo != 1) {
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

    var thumbnailLocation = '';
    if(MAIN.selectThumbnail == 1){
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
          if(MAIN.selectThumbnail == 0 || (MAIN.selectThumbnail==1 && thumbnailLocation !='')){
            const trackInfo = { 
                _id: currentTimeStamp, 
                thumbnail: thumbnailLocation,
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