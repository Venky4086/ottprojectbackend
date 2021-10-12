import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CastService } from 'src/app/services/cast.service';

import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-cast',
  templateUrl: './create-cast.component.html',
  styleUrls: ['./create-cast.component.css']
})

export class CreateCastComponent implements OnInit {
  constructor(
      private _castService: CastService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder
    ) { }
  @ViewChild('myform', { static: false }) myform: NgForm;
  public castData: FormGroup;
  private imageObj: File;
  selectProfileImg = 0;
  fileMsg = '';
  selectProfileImgName='';
  ngOnInit(): void {
    this.castData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
     });
  }

  get f() { return this.castData.controls; }

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

  async submitCastCreateForm(){
    this.fileMsg = '';
    if (this.castData.invalid) {
      return;
    }

    if(this.selectProfileImg != 1){
      return;
    }
    const main = this;
    
    main.spinner.show();
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
        Key: 'cast/'+this.imageObj.name,
        Body: this.imageObj,
        ACL: 'public-read',
        ContentType: contentType
    };
    var s3Upload = await bucket.upload(params).promise();

    this._castService.create(this.f, s3Upload.Location).subscribe(res => {
      if (res && res.code === 200) {
        main.toastr.success('Cast Added');
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
