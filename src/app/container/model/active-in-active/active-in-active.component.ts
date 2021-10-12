
import { Component, Output , OnInit , Input, EventEmitter, Injectable} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanService } from 'src/app/services/plan.service';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-active-in-active',
  templateUrl: './active-in-active.component.html'
})
export class ActiveInActiveComponent implements OnInit {
  @Input() id: String;
  @Input() action;
  @Input() actionFor: String;
  @Input() msg: String = "";

  constructor(
    private spinner: NgxSpinnerService,
    public modal: NgbActiveModal,
    private _planService: PlanService,
    private _userService: UserManagementService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
  }

  goAHead() {
    this.spinner.show();
    if (this.actionFor === "plan") {
      this.action = this.action == 'D' ? "false" : "true";
      this._planService.statusChange(this.id, this.action).subscribe(
        res => {
          if (res && res.code === 200) {
            this.modal.close({ msg: "success" });
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
          }
        },
        err => this.toastr.error(err),
        () => this.spinner.hide()
      );
    }else if (this.actionFor === "user") {
      this._userService.statusChange(this.id, this.action).subscribe(
        res => {
          if (res && res.code === 200) {
            this.modal.close({ msg: "success" });
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
          }
        },
        err => this.toastr.error(err),
        () => this.spinner.hide()
      );
    }
  }
}
