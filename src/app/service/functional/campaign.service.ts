import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment as env } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private http:HttpClient) { }
  
  getCampaign(){
    return this.http.get(`${env.BASE_URL}Country/GetAll`);
  }

  getCampaignList() {
    return this.http.get(`${env.BASE_URL}Country/GetCampaigns`);
  }

  postData(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Country/AddCampaignDetails`, data, { headers });
  }

  getEditCampaign(campaignId: number){
    return this.http.get(`${env.BASE_URL}Country/GetCampaignDetails?campaignId=${campaignId}`);
  }

  postEditData(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Country/EditCampaignDetails`, data, { headers });
  }

  getCampaignMembers(campaignId: number) {
    return this.http.get(`${env.BASE_URL}Country/GetTargets?campaignId=${campaignId}`);
  }

  getCampaignMemberdetails(data: any): Observable<any> {
    return this.http.get(`${env.BASE_URL}Country/GetCampaignMemberDetails?CampaignId=${data.campaignId}&MemberName=${data.firstName}`);

  }

  postGenerateData(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Country/GenerateCampaignResults`, data, { headers });
  }


  getGroupCategoryOfGroupCampaign(groupId: number){
    return this.http.get(`${env.BASE_URL}Country/GetgroupCategoryByGroupId?groupId=${groupId}`);
  }


  getCampaignGraphicalData(campaignId: number,blastId:number){
    return this.http.get(`${env.BASE_URL}Country/viewResults?campaignId=${campaignId}&blastId=${blastId}`);
  }


  getCampaignBlastData(campaignId: number){
    return this.http.get(`${env.BASE_URL}Country/GetEmailBlastDetails?campaignId=${campaignId}`);
  }


  //pin Members
  postTargetList(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Country/EditTargetList`, data, { headers });
  }


  postTargetDatabyEmailFilter(data : any): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Country/TargetDatabyEmailFilter`,data, { headers });
  }

  GetTargetsByEmailFilter(data : any): Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${env.BASE_URL}Country/GetTargetsByEmailFilter`,data, { headers });
  }





}
