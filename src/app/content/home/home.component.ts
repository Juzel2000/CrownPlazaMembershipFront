import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentictionService } from 'src/app/service/auth/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  
sidebarOpen = false;
contentBodyWidth=52;
sideBarWidth=51;
sideBarOpacity=0;

constructor(private authService:AuthentictionService, private router: Router) { 

  //this.checkScreenSize();

}

@HostListener('window:resize', ['$event'])
onResize(event: Event): void {
  //this.checkScreenSize();
}

checkScreenSize(): void {
  const screenWidth = window.innerWidth;
  const thresholdScreenSize = 768; 
  this.sidebarOpen = screenWidth >= thresholdScreenSize;
  this.updateSidebarStyles();
}

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
  this.updateSidebarStyles();
}

updateSidebarStyles(): void {
  this.contentBodyWidth = this.sidebarOpen ? 230 : 52;
  this.sideBarWidth = this.sidebarOpen ? 224 : 51;
  this.sideBarOpacity = this.sidebarOpen ? 1 : 0;
}

logout(): void {
  this.authService.logout();
  this.router.navigate(['login']);
}




}
