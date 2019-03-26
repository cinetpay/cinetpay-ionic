import { Component } from '@angular/core';
import { CinetpayService } from '../services/cinetpay.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  amount : number;

  constructor(private cinetpay : CinetpayService) {}

  private async pay(){
      var result = await this.cinetpay.seamless(this.amount);
      console.log(result);
  }
}
