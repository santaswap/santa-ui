import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme/theme.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ProgressService } from '../progress/progress.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title: string = 'SANTA SWAP';
  isDarkTheme: Observable<boolean>;
  isInProgress: Observable<boolean>;

  constructor(private theme: ThemeService, private auth: AuthService, private progress: ProgressService) {}

  ngOnInit() {
    this.isDarkTheme = this.theme.isDarkTheme;
    this.isInProgress = this.progress.isInProgress;
  }

  enableDarkTheme() {
    this.theme.setDarkTheme(true);
  }

  enableLightTheme() {
    this.theme.setDarkTheme(false);
  }

  enableSpinner() {
    this.progress.setInProgress();
  }

  disableSpinner() {
    this.progress.setResolved();
  }
}
