import { Component, Output , OnInit , Input, EventEmitter, Injectable} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { VideoMasterService } from 'src/app/services/video-master.service';
import { BannerService } from 'src/app/services/banner.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-delete-record',
  templateUrl: './delete-record.component.html'
})
export class DeleteRecordComponent implements OnInit {

  @Input() id: String;
  @Input() series_id: String;
  @Input() season_id: String;
  @Input() master: String = '';
  @Input() actionFor: String;
  @Input() msg: String = "";

  constructor(
    private spinner: NgxSpinnerService,
    public modal: NgbActiveModal,
    private _categoryService: CategoryService,
    private _languageService: LanguageService,
    private _seriesService: SeriesService,
    private _userService: UserManagementService,
    private _bannerService: BannerService,
    private _videoService: VideoMasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  goAHead() {
    this.spinner.show();
    if (this.actionFor === "category") {
      this._categoryService.mainDelete(this.id).subscribe(
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
    } else if (this.actionFor === "subcategory") {
      this._categoryService.subDelete(this.id).subscribe(
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
    } else if (this.actionFor === "language") {
      this._languageService.destroy(this.id).subscribe(
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
    } else if (this.actionFor === "movie") {
      this._videoService.movieDestroy(this.id).subscribe(
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
    } else if (this.actionFor === "banner") {
      this._bannerService.destroy(this.id).subscribe(
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
    } else if (this.actionFor === "user") {
      this._userService.destroy(this.id).subscribe(
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
    } else if (this.actionFor === "series") {
      this._seriesService.destroy(this.id).subscribe(
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
    } else if (this.actionFor === "series-season") {
      this._seriesService.destroySeason(this.series_id,this.id).subscribe(
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
    } else if (this.actionFor === "series-episode") {
      this._seriesService.destroyEpisode(this.series_id,this.season_id,this.id).subscribe(
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
    } else if (this.actionFor === "video-language") {
      this._videoService.videoDestroy(this.master, this.id).subscribe(
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

