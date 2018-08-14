import { Injectable } from '@angular/core';

declare var CinetPay;


@Injectable()
export class CinetpayProvider {

  private CinetPay: any;

  private apikey: string = '5579980505863a3f6aabd82.89189525';
  private site_id: number = 659913;
  private notify_url: string = 'https://YOUR_NOTIFY_URL';

  private trans_id: any;
  private cpm_custom: any;
  private designation: any;
  private currency: string = 'CFA';

  private amount: any;

  constructor() {}

  seamless(payData){
    return new Promise(resolve => {
      CinetPay.setConfig({
        apikey: this.apikey,
        site_id: this.site_id,
        notify_url: this.notify_url
      });
      //Lorsque la signature est généré
      CinetPay.on('signatureCreated', function (token) {
        console.log('Tocken généré: ' + token);
      });
      CinetPay.on('paymentPending', function (e) {
        
      });
      CinetPay.on('paymentSuccessfull', function (paymentInfo) {
        resolve(paymentInfo);
        /*
          //if payment is successfull paymentInfo.cpm_result == '00'
            if (typeof paymentInfo.lastTime != 'undefined') {
              if (paymentInfo.cpm_result == '00') {

              }
            }
        */ 

      });

      CinetPay.setSignatureData({
        amount: parseInt(payData.amount),
        trans_id: window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now(),
        currency: this.currency,
        designation: this.designation,
        custom: this.cpm_custom
      });

      CinetPay.getSignature();  

    });
  }

}
