import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../services/banner.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DeleteRecordComponent } from 'src/app/container/delete-record/delete-record.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-list-banner',
  templateUrl: './list-banner.component.html'
})
export class ListBannerComponent implements OnInit {

  myForm: FormGroup;
  public bannerDetails: any;
  pageNo: number = 1;
  totalRecords: number = 10;
  count: number = 10;
  id: any;
  sortIndex: any;
  previousIndex: number;
  currentIndex: number;
  constructor(
    private _bannerService: BannerService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder, 
    private http:HttpClient,
    private toastr: ToastrService,
  ) { 
  }

  ngOnInit(): void {
    this.getPageData(this.pageNo);
    this.myForm = this.fb.group({
      bannerDetails: this.fb.array([
       this.fb.group({
          id:this.id,
          position: this.sortIndex
        }),
      ])
    })
  }
  get items()
  {
    return (this.myForm.get('items') as FormArray)
  }
  async getPageData(page){

    this.spinner.show();
    this._bannerService.list(page).subscribe(res => {
      this.spinner.hide();
      if(res && res.code == 200){
        this.bannerDetails = res.result.banner_list;
        //  for (let index = 0; index < this.bannerDetails.length; index++) {
        //   this.id = this.bannerDetails[index]._id
        //   this.sortIndex = this.bannerDetails[index].sortIndex
        //   console.log(this.id)
        //   console.log(this.sortIndex);
        //  }
        console.log(this.bannerDetails)
        this.totalRecords = res.result.total_banner;
      }
    },
    err => this.spinner.hide())
   }

  async deleteBanner(banner_id) {
    const modalRef = this.modalService.open(DeleteRecordComponent, {
      size: 'md',
      backdrop: 'static'
    });
    modalRef.componentInstance.id = banner_id;
    modalRef.componentInstance.msg = 'Are You Realy Want to Remove This Banner?';
    modalRef.componentInstance.actionFor = 'banner';
    modalRef.result.then((result) => {
        this.ngOnInit(); 
    }, () => {
      console.log('Backdrop click')
    })
  }
  
  // drop(event: CdkDragDrop<{_id: any,sortIndex : any}[]>,bannerDetails) {
    // console.log(banner._id)
    // console.log(event);
    // this.previousIndex = event.previousIndex
    // this.currentIndex = event.currentIndex + 1
    // console.log(this.previousIndex);
    // console.log(this.currentIndex);
    // console.log(this.bannerDetails)
    // if(typeof(this.bannerDetails[this.previousIndex])==='undefined'){
    //   console.log("not present");
    // }
    // else{
    //       this.id = this.bannerDetails[this.previousIndex]._id
          // this.sortIndex = this.bannerDetails[this.previousIndex].sortIndex
          // console.log(this.id)
          // console.log(this.bannerDetails[this.previousIndex].sortIndex);
    //       console.log("present");
    // }
    // for (let index = 0; index < bannerDetails.length; index++) {
    //   if(index === this.previousIndex){
    //     console.log(index);
    //     console.log(this.previousIndex);
    //     this.id = this.bannerDetails[index]._id
    //     this.sortIndex = this.bannerDetails[index].sortIndex
    //       console.log(this.id)
    //       console.log(this.sortIndex);
    //   }
    //  }
    // moveItemInArray( this.bannerDetails, event.previousIndex, event.currentIndex,);
    // const data = {
    //   id:this.id,
    //   sortIndex : this.currentIndex
    // }
    // const array=this.bannerDetails.value
    // moveItemInArray( this.bannerDetails, event.previousIndex, event.currentIndex);
    // array.forEach((x:any,i:number)=>x.position=i)
    // this.bannerDetails.setValue(array)
    // console.log(JSON.stringify(this.myForm.value.items));
    // console.log(JSON.stringify(this.myForm.value.bannerDetails));
    // console.log(data);
    //     this.http.post('http://3.140.12.126:3008/banner/updateOrder',data).subscribe((res)=>{
    //   console.log(res);
    // },(error)=>{
    //   console.log(error);
    // });
  //   this._bannerService.updatebanner(data).subscribe((res)=>{
  //     console.log(res);
  //   },(error)=>{
  //     console.log(error);
  //   })
  // }


  drop(event: CdkDragDrop<{_id: any,sortIndex : any}[]>,bannerDetails) {
    const main = this;    
    console.log(event);
    this.previousIndex = event.previousIndex
    this.currentIndex = event.currentIndex + 1
    console.log(this.previousIndex);
    console.log(this.currentIndex);
    console.log(this.bannerDetails)
    if(typeof(this.bannerDetails[this.previousIndex])==='undefined'){
      console.log("not present");
    }
    else{
      this.id = this.bannerDetails[this.previousIndex]._id
      console.log(this.id);  
    }
    moveItemInArray( this.bannerDetails, event.previousIndex, event.currentIndex,);
    const data = {
      id:this.id,
      sortIndex : this.currentIndex
    }
    console.log(data);
    this._bannerService.updatebanner(data).subscribe((res)=>{
      console.log(res);
     main.toastr.success(res.message);
    },(error)=>{
      console.log(error);
    })
  }

}
