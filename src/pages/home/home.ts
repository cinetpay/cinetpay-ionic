import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { CinetpayProvider } from './../../providers/cinetpay/cinetpay';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  payForm: FormGroup;
  submitted = false;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private cinetpay : CinetpayProvider) {
    this.payForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.minLength(2)]]
    });
  }



  get f() { return this.payForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.payForm.invalid) 
      return
    else 
      this.pay(this.payForm.value)
    
  }

  private async pay(payData){
    var result = await this.cinetpay.seamless(payData);
    console.log(result);
  }



}
