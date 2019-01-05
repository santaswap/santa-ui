import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth0UserProfile } from 'auth0-js';
import * as auth0 from 'auth0-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from './user';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class AuthService {
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  user: User;

  auth0 = new auth0.WebAuth({
    clientID: 'e0VgaUxRSIvPUVOy5Sx5rkgAdeN5rzja',
    domain: 'santaswap.auth0.com',
    responseType: 'token id_token',
    redirectUri: `${window.location.origin}/callback`,
    scope: 'openid'
  });

  constructor(public router: Router, private http: HttpClient, private progress: ProgressService) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public getProfile(): void {
    if (!this._accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }
    const self = this;
    this.auth0.client.userInfo(this._accessToken, (err, profile: Auth0UserProfile) => {
      if (profile) {
        self.user = new User(profile);
        this.saveUser().subscribe(data => {
          this.router.navigate(['/groups']);
          this.progress.setResolved();
        });
      } else {
        console.log(err);
      }
    });
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.progress.setInProgress();
        window.location.hash = '';
        this.localLogin(authResult);
        this.getProfile();
      } else if (err) {
        this.router.navigate(['']);
        console.log(err);
      }
    });
  }

  private saveUser(): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/users`, this.user);
  }

  private localLogin(authResult): void {
    // Set isLoggedIn flag in localStorage
    console.log('setting logged in local storage');
    localStorage.setItem('isLoggedIn', 'true');
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
  }

  public renewTokens(): void {
    console.log('renewing the tokens');
    this.auth0.checkSession({}, (err, authResult) => {
      console.log('check session response');
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.progress.setInProgress();
        console.log('Got a new token');
        this.localLogin(authResult);
        this.getProfile();
      } else if (err) {
        console.log(`Could not get a new token (${err.error}: ${err.errorDescription})`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    // Go back to the home route
    this.router.navigate(['']);
  }

  public isAuthenticated(): boolean {
    return new Date().getTime() < this._expiresAt;
  }
}
