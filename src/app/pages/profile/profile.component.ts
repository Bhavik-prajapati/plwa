import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, CommonModule,FormsModule], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isDisabled = true; 

  token = localStorage.getItem('token');
  userdata = {
    name: '',
    email: '',
    phone: '',
    userType: '',
    planType: '',
    propertyLimit: '',
    // propertiesListed: '',
  };
  decodedToken:any=""

  constructor(private profileService: ProfileService,private http:HttpClient) {}

  ngOnInit(): void {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwtDecode(token);
    this.decodedToken=decodedToken.user.id;


    Swal.fire({
      title: 'Loading...',
      html: 'Fetching your profile data...',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading();
      }
  });

    // console.log(decodedToken.user.id)
    // Fetch the profile data using the decoded token
    this.profileService.getprofiledata(decodedToken.user.id).subscribe(
      (res:any) => {
        console.log(decodedToken.user.id,"decoded.......")
        this.userdata = res; 
        console.log(this.userdata)
        Swal.close();
      },
      (err:any) => console.log(err)
    );
  }

  onSubmit() {
    // Handle form submission if needed
    this.isDisabled=false;
    console.log('Form submitted');
    if(this.isDisabled==false){
      console.log(this.userdata)  

      Swal.fire({
        title: 'Loading...',
        html: 'Fetching your profile data...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

      this.profileService.updateprofiledata(this.userdata).subscribe((res)=>
        {
          Swal.close();
        },
      err=>console.log(err))
    }
  }

}
