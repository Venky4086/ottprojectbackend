
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-create-main-category',
  templateUrl: './create-main-category.component.html'
})

export class CreateMainCategoryComponent implements OnInit {
  constructor(
      private _categoryService: CategoryService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder
    ) { }
  public categoryData: FormGroup;
  @ViewChild('myform', { static: false }) myform: NgForm;
  
  ngOnInit(): void {
    this.categoryData = this.formBuilder.group({
      name: ['', [Validators.required]],
     });
  }

  get f() { return this.categoryData.controls; }

  async submitCategoryCreateForm(){
    if (this.categoryData.invalid) {
      return;
    }
    const main = this;
    this._categoryService.createMainCategory(this.f).subscribe(res => {
      if (res && res.code === 200) {
        this.toastr.success('Category Added');
        main.myform.resetForm();
        main.ngOnInit();
      } else {
        this.toastr.error('Someting Went Wrong. Please Try again later');
      }
    }, err => {
      console.error(err);
    },
      () =>
        this.spinner.hide()
    );
    this.spinner.show();
  }

}
