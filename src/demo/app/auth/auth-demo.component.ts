import { Component } from '@angular/core';
import { AuthService } from 'ngx-prx-styleguide';

@Component({
  selector: 'auth-demo',
  styles: [`
    .login { width: 400px; }
    .login b { color: #f00; }
  `],
  template: `
    <section class="main demo">
      <h1>AuthModule</h1>
      <section>
        <h2>AuthService Usage:</h2>
        <ol>
          <li>Include the <code>AuthModule</code> in your app</li>
          <li>
            In your top-level component's template, include
            <code>&lt;prx-auth host="thePrxAuthHost" client="yourClientId"&gt;&lt;/prx-auth&gt;</code>.
            This is the PRX ID hostname you want to use, and your client ID issued
            to you by that host.
          </li>
          <li>
            Make sure you have a <code>some/path/callback.html</code>, as designated by your
            client ID, somewhere in your app assets
          </li>
          <li>
            Subscribe to <code>AuthService.token</code> Observable. It will emit
            null when the user is confirmed to be unauthorized, and a string token
            when the user is authorized.
          </li>
        </ol>
        <ul>
          <li>
            <prx-auth [host]="authHost" [client]="authClient"></prx-auth>
            <h3>Auth Status: {{status}}</h3>
            <button (click)="refresh()">Refresh token</button>
          </li>
        </ul>
      </section>
      <section>
        <h2>LoginComponent Usage:</h2>
        <ol>
          <li>You must have the <code>&lt;prx-auth&gt;</code> component already setup</li>
          <li>
            Add a <code>&lt;prx-login&gt;</code> component somewhere in your app.
            You probably only want to show it when the <code>AuthService.token</code>
            emits null/unauthorized.
          </li>
          <li>
            The <code>&lt;prx-login&gt;</code> component has 2 outputs: (1) a
            <code>(success)</code> when login succeeds, and (2) <code>(failure)</code>
            with a "reason" string when login fails.
          </li>
        </ol>
        <ul>
          <li>
            <b *ngIf="loggedIn">You are logged in - delete your prx session cookie to demo the login</b>
            <div *ngIf="!loggedIn" class="login">
              <h3>Login Demo</h3>
              <prx-login (success)="loginSuccess()" (failure)="loginFailure($event)">
              </prx-login>
              <b *ngIf="reason">{{reason}}</b>
            </div>
          </li>
        </ul>
      </section>
    </section>
  `,
})
export class AuthDemoComponent {

  authHost = 'id-staging.prx.tech';
  authClient = 'lVN05vLI8aCADh7lzbrL0AkDvEfPNuoEPpL2umL5';
  status = 'waiting...';
  loggedIn = false;
  reason: string;

  constructor(private auth: AuthService) {
    auth.token.subscribe((token: string) => {
      if (token) {
        this.status = 'logged in with token "' + token.substr(-6) + '"';
        this.loggedIn = true;
      } else {
        this.status = 'logged out';
        this.loggedIn = false;
      }
    });
  }

  refresh() {
    this.status = 'refreshing...';
    this.auth.refreshToken();
  }

  loginSuccess() {
    this.loggedIn = true;
    this.reason = null;
  }

  loginFailure(reason: string) {
    this.loggedIn = false;
    this.reason = reason;
  }

}
