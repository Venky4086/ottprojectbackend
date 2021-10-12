import { Component, OnInit, ViewChild } from '@angular/core';

import { PlanService } from '../../../services/plan.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';
import { ActiveInActiveComponent } from 'src/app/container/model/active-in-active/active-in-active.component';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-plan',
  templateUrl: './list-plan.component.html'
})
export class ListPlanComponent implements OnInit {
  @ViewChild('myform', { static: false }) myform: NgForm;

  public planDetails: any;
  pageNo: number = 1;
  public planData: FormGroup;
  totalRecords: number = 0;
  count: number = 10;
  public currentEditId ='';
  private modalReference: NgbModalRef;

  constructor(
    private _planService: PlanService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getPageData(this.pageNo);
    
    this.planData = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      month: ['', [Validators.required]],
      one_month_price: ['', [Validators.required]]
    });
  }

  async getPageData(page_no){
    const main = this;
    main.spinner.show();
    this._planService.list({page_no}).subscribe(res => {
      main.spinner.hide();
      if(res && res.code == 200){
        main.planDetails = res.result.plan_list;
        main.totalRecords = res.result.total_plan;
      }
    },
    err => main.spinner.hide())
  }

  async activeInActive(plan_id, action) {
    const modalRef = this.modalService.open(ActiveInActiveComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = plan_id;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.actionFor = 'plan';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }

  get f() { return this.planData.controls; }
  
  async submitEditPlanForm() {
    if (this.planData.invalid) {
      return;
    }
    const MAIN = this;
    // this.spinner.show();
    this._planService.update(this.f, this.currentEditId).subscribe(res => {
      if (res && res.code == 200) {
        MAIN.toastr.success('Plan Edited');
        MAIN.currentEditId = '';
        MAIN.planData.reset();
        MAIN.modalReference.close('close');
        MAIN.ngOnInit();
      }
    }, err => {
      console.error(err);
    },
      () => this.spinner.hide());
  }

  openEditModal(content,id) {
    this.currentEditId = id;
    this._planService.show(id).subscribe(res => {
      if (res && res.code === 200) {
        const singlePlan = res.result;
        this.planData.setValue({
          name: singlePlan.name,
          price: singlePlan.price,
          month: singlePlan.month,
          one_month_price: singlePlan.one_month_price
        });
      }
    }, err => console.error(err),
      () => this.spinner.hide()
    );

    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }
}
