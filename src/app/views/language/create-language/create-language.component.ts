import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-create-language',
  templateUrl: './create-language.component.html',
  styleUrls: ['./create-language.component.css']
})
export class CreateLanguageComponent implements OnInit {

  constructor(        
      private _languageService: LanguageService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder
    ) { }
  public languageData: FormGroup;

  @ViewChild('myform', { static: false }) myform: NgForm;
  
  ngOnInit(): void {
    this.languageData = this.formBuilder.group({
      name: ['', [Validators.required]],
     });
  }

  get f() { return this.languageData.controls; }

  async submitLanguageCreateForm(){
    if (this.languageData.invalid) {
      return;
    }
    const main = this;
    this._languageService.create(this.f).subscribe(res => {
      if (res && res.code === 200) {
        this.toastr.success('Language Added');
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
