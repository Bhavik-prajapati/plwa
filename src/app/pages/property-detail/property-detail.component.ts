import { Component, Inject, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyDetailService } from './property-detail.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../payment-gateway/payment.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { ProfileService } from '../profile/profile.service';
// import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

declare var bootstrap: any;
declare var Razorpay: any;

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent implements OnInit{

  router=inject(Router);

  goBack() {
    window.history.back(); 
    this.router.navigateByUrl("home") ;
  }

  http=inject(HttpClient);
  profileservice=inject(ProfileService);
  paymentService=inject(PaymentService);
  propertylimit:any=0;
  decodedtoken:any='';
  constructor(private route: ActivatedRoute,private propertyservice:PropertyDetailService) {
    const token = localStorage.getItem("token") || "";
    this.decodedtoken = jwtDecode(token);
  }
  property:any={};
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    Swal.fire({
      title: 'Loading...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.propertyservice.getpropertybyid(id).subscribe((res:any)=>{
      this.property=res;
      Swal.close();
    },error=>{
      console.log(error)
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: 'Could not load property data.',
        icon: 'error'
      });
    })

    this.profileservice.getprofiledata(this.decodedtoken.user.id).subscribe(
      (res:any) => {
        console.log(res)
        this.propertylimit=res.propertyLimit;
      },
      (err:any) => console.log(err)
    );

  }

  prevSlide(id: string) {
    const element = document.getElementById(`propertyCarousel${id}`);
    if (element) {
      const carousel = new bootstrap.Carousel(element);
      carousel.prev();
    }
  }

  nextSlide(id: string) {
    const element = document.getElementById(`propertyCarousel${id}`);
    if (element) {
      const carousel = new bootstrap.Carousel(element);
      carousel.next();
    }
  }
  viewphone(mobile: string, propertyid: string) {
    this.propertyservice.addPropertyVisited(propertyid).subscribe(
      (res: any) => {
        Swal.fire({
          title: `Note Number: ${mobile}`,
          html: `<button id="emailButton" class="mt-2 p-1" style="border: none;outline: none;">
                   <img src="gmail.png" alt="Gmail Icon" style="width: 24px; height: 24px;"> Contact via Mail
                 </button>`,
          didRender: () => {
            const emailButton = document.getElementById('emailButton');
            if (emailButton) {
              emailButton.addEventListener('click', () => {
                this.connectMail();  // Llama a la función directamente
              });
            }
          }
        });
      },
      (err: HttpErrorResponse) => {
        if (err.status === 400) { 
          this.router.navigateByUrl('plans');
        }
      }
    );
  }
  

  usermail:string='';
  connectMail() {
    console.log("called connect mail............")

    this.propertyservice.getemailbyid(this.property.ownerId).subscribe((res:any)=>{
      console.log(res)
      this.usermail=res.email;
    },err=>console.log(err))
    
    const email = this.usermail;
    const subject = 'Hello';
    const body = 'I wanted to reach out to you!';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }


  // connectmail()
  // {

  //   this.propertyservice.getemailbyid(this.property.ownerId).subscribe((res:any)=>{
  //     console.log(res)
  //   },err=>console.log(err))

  //   // this.http.get('http://localhost:5000/users').subscribe
  //   // window.location.href = 'http://localhost:5000/auth';
  // }
}
