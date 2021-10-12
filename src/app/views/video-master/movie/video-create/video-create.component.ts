import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { VideoMasterService } from 'src/app/services/video-master.service';
import { CategoryService } from 'src/app/services/category.service';
import { LanguageService } from 'src/app/services/language.service';
import { CastService } from 'src/app/services/cast.service';
import { Select2OptionData } from 'ng-Select2';
import { NgSelectComponent, Options } from 'select2';
import {
  AddEditVideoComponent
} from 'src/app/container/model/add-edit-video/add-edit-video.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-video-create',
  templateUrl: './video-create.component.html',
  styleUrls: ['./video-create.component.css']
})
export class VideoCreateComponent implements OnInit {
  
  @ViewChild('myform', { static: false }) myform: NgForm;
  
  public castOptions: Options; 
  public categoryOptions: Options; 
  public subCategoryOptions: Options;
  public languageOptions: Options;
  public videoData: FormGroup;
  public masterCategoryList: Array<Select2OptionData> = [];
  public subCategoryList: Array<Select2OptionData> = [];
  public castList: Array<Select2OptionData> = [];
  public videoList = [];
  public castIds = [];
  public categoryIds = [];
  public subCategoryIds = [];
  public release_date = "";
  public release_time = "";
  constructor(
    private _videoService: VideoMasterService,
    private _categoryService: CategoryService,
    private _castService: CastService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.categoryIds = [];
    this.castIds = [];
    this.videoData = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      director: ['', [Validators.required]],
      starring: ['', [Validators.required]]
    });
    this.categoryOptions = this.castOptions = {
      multiple: true,
      width: '100%'
    };
    this.subCategoryOptions = {
      multiple: true,
      width: '100%'
    }
    
    this._castService.list({}).subscribe(res => {
      if(res && res.code == 200){
        const castData = [];
        res.result.cast_list.forEach((item)=>{
          castData.push({
            id: item._id,
            text: item.name
          });
        });
        this.castList = castData;
      }
    },
    err => console.log('e'))

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
        this.categoryIds = [];
      }
    },
    err => console.log('e'))
  }
  refreshSubCategory() {
    this._categoryService.subCategorylist({
      category_ids:this.categoryIds
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
        this.subCategoryIds = [];
      }
    },
    err => console.log('e'))
  }
  checkSelectBox (event, type) {
    if(event){
        switch (type) {
        case 'CA':
            this.castIds = event;
          break;
        case 'C':
          this.categoryIds = event; 
          this.refreshSubCategory()
          break;
        case 'S':
          this.subCategoryIds = event; 
          break;
        default:
          break;
      }
    }
  }

  openVideoModel(type = 'A', id = '') {
    const modalRef = this.modalService.open(AddEditVideoComponent, {
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

  async submitVideoAddForm(release_date:any,release_time:any){
    console.log(release_date)
    var error = 0;
    const MAIN = this;
    if (this.videoList.length == 0) {
      this.toastr.error('Please Add atleast 1 Video');
      error = 1;
    }
 
    if(this.categoryIds.length == 0){
      error = 1;
    }

    if(this.subCategoryIds.length == 0){
      error = 1;
    }
    // if(this.castIds.length == 0){
    //   error = 1;
    // }
    if (this.videoData.invalid ) {
      error = 1;
    }
    if(error == 1){
      return
    }
    var extraData = {
      videoList:this.videoList,
      // cast:this.castIds,
      category:this.categoryIds,
      sub_category:this.subCategoryIds,
      release_date:release_date,
      release_time:release_time
    }
    console.log(extraData)
    MAIN.spinner.show();

    this._videoService.createMovie(this.f, extraData).subscribe(res => {
      MAIN.spinner.hide()
      console.log(res)
      if (res && res.code === 200) {
        MAIN.toastr.success('Movie Added Successfully');
        MAIN.myform.resetForm();
        MAIN.videoList = [];
        
        MAIN.castList = [];
        MAIN.castIds = [];

        MAIN.categoryIds = [];
        MAIN.masterCategoryList = [];

        MAIN.subCategoryIds = [];
        MAIN.subCategoryList = [];

        MAIN.castList = [];
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
