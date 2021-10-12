
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-edit-language',
  templateUrl: './edit-language.component.html',
  styleUrls: ['./edit-language.component.css']
})
export class EditLanguageComponent implements OnInit {
  @ViewChild('myform', { static: false }) myform: NgForm;

  constructor(        
      private _languageService: LanguageService,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute
    ) { }
  public languageData: FormGroup;
  public languageDetail =  {_id:''};
  public id = '';

  ngOnInit(): void {

    const MAIN = this
    this.route.params.subscribe(params => {
      MAIN.id = params['id'];
    });
    this._languageService.show(this.id).subscribe(async res => {
      if(res && res.code == 200){
        var detail = res.result;
        MAIN.languageDetail = detail;
         
        MAIN.languageData.setValue({
          name: detail.name
        });

      }else{
        alert('Language Not found in this url');
      }
    },
    err => console.log('e'))

    this.languageData = this.formBuilder.group({
      name: ['', [Validators.required]],
     });
  }

  get f() { return this.languageData.controls; }

  async submitLanguageUpdateForm(){
    if (this.languageData.invalid) {
      return;
    }
    const MAIN = this;
    this._languageService.update(MAIN.id, this.f).subscribe(res => {
      if (res && res.code === 200) {
        MAIN.toastr.success('Language Update');
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
