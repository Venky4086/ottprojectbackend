import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { Select2OptionData } from 'ng-Select2';
import { NgSelectComponent, Options } from 'select2';

@Component({
  selector: 'app-create-sub-category',
  templateUrl: './create-sub-category.component.html'
})
export class CreateSubCategoryComponent implements OnInit {
  constructor(
      private _categoryService: CategoryService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder
    ) { }
  public categoryData: FormGroup;
  public masterCategoryList: Array<Select2OptionData> = [];
  public options: Options;
  @ViewChild('myform', { static: false }) myform: NgForm;
  @ViewChildren('choseCategory') ngSelectComponent: NgSelectComponent;

  public selectCategoryError = false;
  public subCategoryValues = [];

  ngOnInit(): void {
    this.selectCategoryError = false

    this.spinner.show();
    this._categoryService.mainCategorylist({}).subscribe(res => {
      this.spinner.hide();
      if(res && res.code == 200){
        const masterCategory = [];
        res.result.category_list.forEach((item, index)=>{
          masterCategory.push({
            id: item._id,
            text: item.name,
            selected:true
          });
        });
        this.masterCategoryList = masterCategory;
      }
    },
    err => this.spinner.hide())

    this.options = {
      multiple: true,
      width: '100%'
    };

    this.categoryData = this.formBuilder.group({
      name: ['', [Validators.required]],
     });
     
  }

  get f() { return this.categoryData.controls; }

  checkMainCatergorySelectedOrNot(event){
    this.subCategoryValues = event
    if(this.subCategoryValues && this.subCategoryValues.length > 0){
      this.selectCategoryError = false
    }
  }
  async submitCategoryCreateForm(){
    if(!this.subCategoryValues || this.subCategoryValues.length < 1){
      this.selectCategoryError = true
      return 
    }
    if (this.categoryData.invalid) {
      return;
    }
    const MAIN =this;

    MAIN.spinner.show();
    this._categoryService.createSubCategory(this.f, this.subCategoryValues).subscribe(res => {
      MAIN.toastr.clear();
      if (res && res.code === 200) {
        var msg  = res.message ? res.message : 'Someting Went Wrong. Please Try again later';
        MAIN.toastr.success(msg);
        MAIN.subCategoryValues = [];
        MAIN.myform.resetForm();
        MAIN.ngOnInit();
      } else {
        var msg  = res.message ? res.message : 'Someting Went Wrong. Please Try again later'
        this.toastr.error(msg);
      }
    }, err => {
      console.error(err);
    },
      () =>
      MAIN.spinner.hide()
    );
  }

}
