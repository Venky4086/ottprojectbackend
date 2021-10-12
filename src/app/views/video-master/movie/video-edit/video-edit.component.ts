
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { VideoMasterService } from 'src/app/services/video-master.service';
import { CategoryService } from 'src/app/services/category.service';
import { Select2OptionData } from 'ng-Select2';
import { NgSelectComponent, Options } from 'select2';
import {
  AddEditVideoComponent
} from 'src/app/container/model/add-edit-video/add-edit-video.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.css']
})
export class VideoEditComponent implements OnInit {
  @ViewChild('myform', { static: false }) myform: NgForm;
  
  public categoryOptions: Options; 
  public subCategoryOptions: Options;
  public languageOptions: Options;
  public videoData: FormGroup;
  public masterCategoryList: Array<Select2OptionData> = [];
  public subCategoryList: Array<Select2OptionData> = [];
  public videoList = [];
  public categoryValues = [];
  public videoDetail = {
    _id:'',
    sub_category:[],
    video:[]
  };

  public subCategoryValues = [];
  public id = '';

  
  private _value= [];

  constructor(
    private _videoService: VideoMasterService,
    private _categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const MAIN = this
    this.route.params.subscribe(params => {
      MAIN.id = params['id'];
    });
    
    this.videoData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      director: ['', [Validators.required]],
      starring: ['', [Validators.required]]
    });
    this.categoryOptions = {
      multiple: true,
      width: '100%'
    };
    this.subCategoryOptions = {
      multiple: true,
      width: '100%'
    }
 
    MAIN.spinner.show()
    this._videoService.singleMovie(this.id).subscribe(async res => {
      if(res && res.code == 200){
        var detail = res.result.detail;
        MAIN.videoDetail = detail;
        MAIN.spinner.hide()
         
        MAIN.videoData.setValue({
          name: detail.name,
          description: detail.description,
          director: detail.director,
          starring: detail.starring
        });

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
            detail.category.forEach((item)=>{
              MAIN.categoryValues.push(item.id._id);
            });
          }
        },
        err => console.log('e'))

      }else{
        alert('Movie Not found in this url');
      }
    },
    err => console.log('e'))
  }
  refreshSubCategory() {
    this.subCategoryValues = [];

    this._categoryService.subCategorylist({
      category_ids:this.categoryValues
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
      }
      if(this.videoDetail.sub_category.length > 0){
        this.videoDetail.sub_category.forEach((item)=>{
          this.subCategoryValues.push(item.id._id);
        });
        this.videoDetail.sub_category = [];
      }
    },
    err => console.log('e'))
  }
  checkSelectBox (event, type) {
    if(event){
        switch (type) {
          case 'C':
            setTimeout(() => {
              this.refreshSubCategory()
            }, 100);
            break;
          default:
            break;
      }
    }
  }

  async deleteVideo(category_id) {
    if(this.videoDetail.video.length == 1){
      this.toastr.warning("You Can't delete all the video's, 1 should be needed");
      return 1
    }
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    var MAIN = this;
    modalRef.componentInstance.id = category_id;
    modalRef.componentInstance.master = this.videoDetail._id;
    modalRef.componentInstance.msg = "Are You Realy Want to Delete This Video? This Action Can't be undo!";
    modalRef.componentInstance.actionFor = 'video-language';
    modalRef.result.then((result) => {
        MAIN.ngOnInit();
    }, () => {
      console.log('Backdrop click')
    })
  }

  openVideoModel(type = 'A', record = {_id:''}) {
    var MAIN = this;
    const modalRef = this.modalService.open(AddEditVideoComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    if (type == 'E') {
      modalRef.componentInstance.openFor = 'edit';
      modalRef.componentInstance.editData = record;
    } else {
      modalRef.componentInstance.openFor = 'add';
    }
    modalRef.result.then((result) => {
      if(type == 'A'){
        result.id = MAIN.videoDetail._id;
        MAIN.spinner.show()
        this._videoService.addMovieWithNewLanguage(result).subscribe(res => {
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
        },
          () =>
          MAIN.spinner.hide()
        );
      }else{
        result.video_id = MAIN.videoDetail._id;
        result.id = record._id;
        MAIN.spinner.show()
        this._videoService.editMovieWithNewLanguage(result).subscribe(res => {
          MAIN.spinner.hide()
          if (res && res.code === 200) {
            MAIN.toastr.success('Video Edit Successfully');
            MAIN.ngOnInit();
          } else {
            var msg = res.message ? res.message : 'Someting Went Wrong. Please Try again later';  
            MAIN.toastr.error(msg);
          }
        }, err => {
          MAIN.spinner.hide()
        },
          () =>
          MAIN.spinner.hide()
        );

      }
    }, err => console.log('error', err));

  }

  get f() { return this.videoData.controls; }

  async submitVideoUpdateForm(){
    var error = 0;
    const MAIN = this;
 
    if(this.categoryValues.length == 0){
      error = 1;
    }

    if(this.subCategoryValues.length == 0){
      error = 1;
    }
  
    if (this.videoData.invalid ) {
      error = 1;
    }
    if(error == 1){
      return
    }
    var extraData = {
      id:MAIN.videoDetail._id,
      category:this.categoryValues,
      sub_category:this.subCategoryValues
    }
    MAIN.spinner.show()
    this._videoService.updateMovie(this.f, extraData).subscribe(res => {
      MAIN.spinner.hide()
      if (res && res.code === 200) {
        MAIN.toastr.success('Movie Updated Successfully');
        MAIN.myform.resetForm();
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
