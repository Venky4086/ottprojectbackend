
import {
  HttpHeaders
} from '@angular/common/http';

const userdata = JSON.parse(localStorage.getItem('currentUser'));
// const token = userdata.token ? userdata.token: "";
const token = userdata && userdata.token ? userdata.token: "";

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': "Bearer " + token
});

export const environment = {
  production: false,
  apiUrl: 'http://3.140.12.126:3008',
  //apiUrl: 'http://3.140.12.126:3009',
  headers: headers,
  AWS_ACCESS_KEY_ID:"AKIAIJWTVNRZI5FCM6XQ", 
  AWS_SECRET_ACCESS_KEY:"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",
  AWS_DEFAULT_REGION:"us-east-2",
  AWS_BUCKET:"film-app-ott"
};


