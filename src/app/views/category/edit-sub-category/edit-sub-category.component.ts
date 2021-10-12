import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { Select2OptionData } from 'ng-Select2';
import { NgSelectComponent, Options } from 'select2';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-sub-category',
  templateUrl: './edit-sub-category.component.html',
})

export class EditSubCategoryComponent implements OnInit {

  constructor(
      private _categoryService: CategoryService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute
    ) { }
  public categoryData: FormGroup;
  public masterCategoryList: Array<Select2OptionData> = [];
  public categoryValues = '';
  public options: Options;
  @ViewChild('myform', { static: false }) myform: NgForm;
  @ViewChild('choseCategory') ngSelectComponent: NgSelectComponent;
  public id = '';
  public subCategoryDetail =  {_id:''};

  public value: string[] = [];
  public selectCategoryError = false;
  ngOnInit(): void {
    this.selectCategoryError = false
    const MAIN = this
    this.route.params.subscribe(params => {
      MAIN.id = params['id'];
    });


    this._categoryService.subShow(this.id).subscribe(async res => {
      if(res && res.code == 200){
        var detail = res.result;
        MAIN.subCategoryDetail = detail;
 
        MAIN.categoryData.setValue({
          name: detail.name
        });
        MAIN.categoryValues = detail.category;
      }else{
        alert('Category Not found in this url');
      }
    },
    err => console.log('e'))

    this.spinner.show();
    this._categoryService.mainCategorylist({}).subscribe(res => {
      this.spinner.hide();
      if(res && res.code == 200){
        const masterCategory = [];
        const selectValue = [];
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
      multiple: false,
      width: '100%'
    };

    this.categoryData = this.formBuilder.group({
      name: ['', [Validators.required]],
     });
     
  }

  get f() { return this.categoryData.controls; }
  
  checkMainCatergorySelectedOrNot(event){
    this.value = event
  }

  async submitCategoryEditForm(){
    if (this.categoryData.invalid) {
      return;
    }
    const MAIN =this;

    MAIN.spinner.show();
    this._categoryService.updateSubCategory(MAIN.id, MAIN.f, MAIN.categoryValues).subscribe(res => {
      MAIN.toastr.clear();
      MAIN.spinner.hide()
      if (res && res.code === 200) {
        var msg  = res.message ? res.message : 'Someting Went Wrong. Please Try again later'
        MAIN.toastr.success(msg);
        MAIN.ngSelectComponent.clearModel();
        MAIN.myform.resetForm();
        MAIN.ngOnInit();
      } else {
        var msg  = res.message ? res.message : 'Someting Went Wrong. Please Try again later'
        this.toastr.error(msg);
      }
    }, err => {
      MAIN.spinner.hide()
      console.error(err);
    },
      () =>{}
    );
  }

}
