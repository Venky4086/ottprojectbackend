import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-main-category',
  templateUrl: './edit-main-category.component.html',
})
export class EditMainCategoryComponent implements OnInit {
  constructor(
      private _categoryService: CategoryService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute
    ) { }
  public categoryData: FormGroup;
  public categoryDetail =  {_id:''};
  public id = '';
  @ViewChild('myform', { static: false }) myform: NgForm;
  
  ngOnInit(): void {
    const MAIN = this
    this.route.params.subscribe(params => {
      MAIN.id = params['id'];
    });
    this._categoryService.mainShow(this.id).subscribe(async res => {
      if(res && res.code == 200){
        var detail = res.result;
        MAIN.categoryDetail = detail;
         
        MAIN.categoryData.setValue({
          name: detail.name
        });

      }else{
        alert('Category Not found in this url');
      }
    },
    err => console.log('e'))
    this.categoryData = this.formBuilder.group({
      name: ['', [Validators.required]],
     });
  }

  get f() { return this.categoryData.controls; }

  async submitCategoryUpdateForm(){
    if (this.categoryData.invalid) {
      return;
    }
    const MAIN = this;
    console.log(MAIN.f.name.value)
    this._categoryService.updateMainCategory(MAIN.id, MAIN.f).subscribe(res => {
      if (res && res.code === 200) {
        MAIN.toastr.success('Category Updated');
      } else {
        MAIN.toastr.error('Someting Went Wrong. Please Try again later');
      }
    }, err => {
      console.error(err);
    },
      () =>
      MAIN.spinner.hide()
    );
    MAIN.spinner.show();
  }

}
