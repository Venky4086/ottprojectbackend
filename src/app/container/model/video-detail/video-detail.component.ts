import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit {

  @Input() video_detail = {language:{name:''}, poster:'', trailer:'',  main:'', thumbnail:''};

  constructor(
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}
