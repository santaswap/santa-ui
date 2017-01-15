import { Component, OnInit } from '@angular/core';

/*------ models ------*/
import { UserProfile } from '../shared/user-profile';

/*------ injectable services ------*/
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  //instantiate UserProfile as an emtpy type UserProfile
  user: UserProfile = <UserProfile>{};
  submitted: Boolean = false;


  constructor( 
    private userService: UserService 
  ) { }

  ngOnInit() {
    // this.user = this.userService.getUserProfile();
  }

   onSubmit() { 
    this.submitted = true; 
  }

}