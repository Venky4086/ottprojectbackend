import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';  

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  InfiniteScrollModule
} from 'ngx-infinite-scroll';

import {
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';

import {
  ToastrModule
} from 'ngx-toastr';
import {
  NgxSpinnerModule
} from 'ngx-spinner';
import {
  NgxPaginationModule
} from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';

import {
  FooterComponent
} from './layout/footer/footer.component';
import {
  HeaderComponent
} from './layout/header/header.component';
import {
  SidebarComponent
} from './layout/sidebar/sidebar.component';

import {
  AppRoutingModule,
  routerComponents
} from './app-routing.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEditVideoComponent } from './container/model/add-edit-video/add-edit-video.component';
import {ProgressBarModule} from "angular-progress-bar";
import { VideoDetailComponent } from './container/model/video-detail/video-detail.component';
import { DeleteRecordComponent } from './container/delete-record/delete-record.component';
import { ActiveInActiveComponent } from './container/model/active-in-active/active-in-active.component';
import { AddEditEpisodeComponent } from './container/model/add-edit-episode/add-edit-episode.component';
// import { DragDropModule } from '@angular/cdk/drag-drop/drag-drop-module';
import {DragDropModule} from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    routerComponents,
    AddEditVideoComponent,
    VideoDetailComponent,
    DeleteRecordComponent,
    ActiveInActiveComponent,
    AddEditEpisodeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgSelect2Module,
    ProgressBarModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    NgbModule,
    DragDropModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteRecordComponent,
    ActiveInActiveComponent
  ]
})
export class AppModule { }

