import { NgModule } from '@angular/core';

import {
  Routes,
  RouterModule
} from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { DashbaordComponent } from './views/dashbaord/dashbaord.component';

import { UserManagementComponent } from './views/user-management/user-management.component';
import { NotificationComponent } from './views/notification/notification.component';


import { ListMainCategoryComponent } from './views/category/list-main-category/list-main-category.component';
import { CreateMainCategoryComponent } from './views/category/create-main-category/create-main-category.component';
import { CreateSubCategoryComponent } from './views/category/create-sub-category/create-sub-category.component';
import { ListSubCategoryComponent } from './views/category/list-sub-category/list-sub-category.component';


import { SeriesListingComponent } from './views/video-master/series/series-listing/series-listing.component';
import { SeriesCreateComponent } from './views/video-master/series/series-create/series-create.component';
import { VideoCreateComponent } from './views/video-master/movie/video-create/video-create.component';
import { VideoListingComponent } from './views/video-master/movie/video-listing/video-listing.component';


import { CreateLanguageComponent } from './views/language/create-language/create-language.component';
import { ListLanguageComponent } from './views/language/list-language/list-language.component';
import { ListCastComponent } from './views/cast/list-cast/list-cast.component';
import { CreateCastComponent } from './views/cast/create-cast/create-cast.component';

import { ListBannerComponent } from './views/banner/list-banner/list-banner.component';
import { CreateBannerComponent } from './views/banner/create-banner/create-banner.component'
import { ListPlanComponent } from './views/plan/list-plan/list-plan.component';

import {
  AuthGuard
} from './auth.guard';
import { VideoEditComponent } from './views/video-master/movie/video-edit/video-edit.component';
import { EditLanguageComponent } from './views/language/edit-language/edit-language.component';
import { EditSubCategoryComponent } from './views/category/edit-sub-category/edit-sub-category.component';
import { EditMainCategoryComponent } from './views/category/edit-main-category/edit-main-category.component';
import { SeasonListingComponent } from './views/video-master/series/season-listing/season-listing.component';
import { EpisodeListingComponent } from './views/video-master/series/episode-listing/episode-listing.component';
import { EpisodeCreateComponent } from './views/video-master/series/episode-create/episode-create.component';
import { EpisodeEditComponent } from './views/video-master/series/episode-edit/episode-edit.component';
import { SeriesEditComponent } from './views/video-master/series/series-edit/series-edit.component';
import { SupportComponent } from './views/support/support.component';

import { SubscribeUserComponent } from './views/subscribe-user/subscribe-user.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: DashbaordComponent
      },
      {
        path: "cast",
        children: [
          {
            path: "",
            data: {
              title: "Cast Category"
            },
            component: ListCastComponent
          },
          {
            path: "create",
            data: {
              title: "create Category"
            },
            component: CreateCastComponent
          }
        ]
      },
      {
        path: "user-management",
        data: {
          title: "User Management"
        },
        component: UserManagementComponent
      },
      {
        path: "subscribe-user",
        data: {
          title: "User Management"
        },
        component: SubscribeUserComponent
      },
      {
        path: "category",
        children: [
          {
            path: "main",
            data: {
              title: "Main Category"
            },
            children: [
              {
                path: "",
                data: {
                  title: "Main Category list"
                },
                component: ListMainCategoryComponent
              },
              {
                path: "create",
                data: {
                  title: "Main Category"
                },
                component: CreateMainCategoryComponent
              },
              {
                path: ":id/edit",
                data: {
                  title: "create"
                },
                component: EditMainCategoryComponent
              }
            ]
          },
          {
            path: "sub",
            data: {
              title: "Sub Category"
            },
            children: [
              {
                path: "",
                data: {
                  title: "Sub Category list"
                },
                component: ListSubCategoryComponent
              },
              {
                path: "create",
                data: {
                  title: "Sub Category"
                },
                component: CreateSubCategoryComponent
              },
              {
                path: ":id/edit",
                data: {
                  title: "create"
                },
                component: EditSubCategoryComponent
              }
            ]
          }
        ]
      },
      {
        path: "language",
        children: [
          {
            path: "",
            data: {
              title: "Language"
            },
            component: ListLanguageComponent
          },
          {
            path: "create",
            data: {
              title: "create Language"
            },
            component: CreateLanguageComponent
          },
          {
            path: ":id/edit",
            data: {
              title: "create"
            },
            component: EditLanguageComponent
          }
        ]
      },
      {
        path: "video-master",
        children: [
          {
            path: "movie",
            children: [
              {
                path: "",
                data: {
                  title: "listing"
                },
                component: VideoListingComponent
              },
              {
                path: "create",
                data: {
                  title: "create"
                },
                component: VideoCreateComponent
              },
              {
                path: ":id/edit",
                data: {
                  title: "create"
                },
                component: VideoEditComponent
              }
            ]
          },
          {
            path: "series",
            children: [
              {
                path: "",
                data: {
                  title: "listing"
                },
                component: SeriesListingComponent
              },
              {
                path: "create",
                data: {
                  title: "create"
                },
                component: SeriesCreateComponent
              },
              {
                path: ":id/edit",
                data: {
                  title: "edit"
                },
                component: SeriesEditComponent
              },
              {
                path: ":series_id/season",
                children: [
                  {
                    path: "",
                    data: {
                      title: "listing"
                    },
                    component: SeasonListingComponent
                  },
                  {
                    path: ":season_id/episode",
                    children: [
                      {
                        path: "",
                        data: {
                          title: "listing"
                        },
                        component: EpisodeListingComponent
                      },
                      {
                        path: "create",
                        data: {
                          title: "create"
                        },
                        component: EpisodeCreateComponent
                      },
                      {
                        path: ":episode_id/edit",
                        data: {
                          title: "edit"
                        },
                        component: EpisodeEditComponent
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: "banner",
        children: [
          {
            path: "",
            data: {
              title: "Banner list"
            },
            component: ListBannerComponent
          },
          {
            path: "create",
            data: {
              title: "create banner"
            },
            component: CreateBannerComponent
          }
        ]
      },
      {
        path: "packages",
        data: {
          title: "Plan"
        },
        component: ListPlanComponent
      },
      {
        path: "notification",
        data: {
          title: "Notifications"
        },
        component: NotificationComponent
      },
      {
        path: "support",
        data: {
          title: "support"
        },
        component: SupportComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routerComponents = [LoginComponent, DefaultLayoutComponent, DashbaordComponent, SeriesListingComponent, SubscribeUserComponent, VideoListingComponent, SeriesCreateComponent,VideoCreateComponent, CreateMainCategoryComponent, CreateSubCategoryComponent, ListMainCategoryComponent, ListSubCategoryComponent, ListLanguageComponent, ListCastComponent, CreateCastComponent, CreateLanguageComponent, ListBannerComponent, CreateBannerComponent, ListPlanComponent, UserManagementComponent,VideoEditComponent, EditLanguageComponent, EditSubCategoryComponent, EditMainCategoryComponent, SeasonListingComponent, EpisodeListingComponent ,EpisodeCreateComponent, EpisodeEditComponent,SeriesEditComponent, SupportComponent, NotificationComponent];
