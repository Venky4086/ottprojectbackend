import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';

import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  constructor(
      private _adminService: AdminService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder
    ) { }
  @ViewChild('myform', { static: false }) myform: NgForm;
  public notificationData: FormGroup;
  private imageObj: File;
  selectProfileImg = 0;
  fileMsg = '';
  selectProfileImgName='';
  ngOnInit(): void {
    this.notificationData = this.formBuilder.group({
      text: ['', [Validators.required]],
     });
  }

  get f() { return this.notificationData.controls; }

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

  async submitNotification(){
    this.fileMsg = '';
    if (this.notificationData.invalid) {
      return;
    }

    var data = {
      text:'',
      image:''
    };

    data.text = this.f.text.value

    const main = this;    
    main.spinner.show();
    if(this.selectProfileImg == 1){
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
          Key: 'notification/'+this.imageObj.name,
          Body: this.imageObj,
          ACL: 'public-read',
          ContentType: contentType
      };
      var s3Upload = await bucket.upload(params).promise();
      data.image = s3Upload.Location
    }

    this._adminService.sendNotification(data).subscribe(res => {
      if (res && res.code === 200) {
        main.toastr.success('Notification Send Successfully');
        main.myform.resetForm();
        main.selectProfileImg = 0;
        main.selectProfileImgName = ''
        main.ngOnInit();
      } else {
        main.toastr.error('Someting Went Wrong. Please Try again later');
      }
    }, err => {
      main.spinner.hide()
    },
      () =>
      main.spinner.hide()
    );
    main.spinner.hide()
  }

}
