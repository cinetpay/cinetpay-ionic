# CinetPay - Ionic

Exemple Simple d'intégration de [CinetPay](https://cinetpay.com) sur [Ionic](https://ionicframework.com).

On suppose que le nom de domaine du site est : www.mondomaine.ci

Assurez vous toujours que la classe CinetPay est bien chargée

## Etape 1 : Préparation des pages de notification, de retour et d'annulation


### Page de Notification
Dans un fichier notify.php à la racine de votre site par exemple
```php
<?php
// Verification que des données sont envoyées par CinetPay
if (isset($_POST['cpm_trans_id'])) {
    // SDK PHP de CinetPay 
    require_once __DIR__ . '/../src/cinetpay.php';
    try {
        // Initialisation de CinetPay et Identification du paiement
        $id_transaction = $_POST['cpm_trans_id'];
        //Veuillez entrer votre apiKey et site ID
        $apiKey = "21585943f75164bbc2.38014639";
        $site_id = "296911";
        $plateform = "PROD";
        $version = "V1";
        $CinetPay = new CinetPay($site_id, $apiKey, $plateform, $version);
        //Prise des données chez CinetPay correspondant à ce paiement
        $CinetPay->setTransId($id_transaction)->getPayStatus();
        $cpm_site_id = $CinetPay->_cpm_site_id;
        $signature = $CinetPay->_signature;
        $cpm_amount = $CinetPay->_cpm_amount;
        $cpm_trans_id = $CinetPay->_cpm_trans_id;
        $cpm_custom = $CinetPay->_cpm_custom;
        $cpm_currency = $CinetPay->_cpm_currency;
        $cpm_payid = $CinetPay->_cpm_payid;
        $cpm_payment_date = $CinetPay->_cpm_payment_date;
        $cpm_payment_time = $CinetPay->_cpm_payment_time;
        $cpm_error_message = $CinetPay->_cpm_error_message;
        $payment_method = $CinetPay->_payment_method;
        $cpm_phone_prefixe = $CinetPay->_cpm_phone_prefixe;
        $cel_phone_num = $CinetPay->_cel_phone_num;
        $cpm_ipn_ack = $CinetPay->_cpm_ipn_ack;
        $created_at = $CinetPay->_created_at;
        $updated_at = $CinetPay->_updated_at;
        $cpm_result = $CinetPay->_cpm_result;
        $cpm_trans_status = $CinetPay->_cpm_trans_status;
        $cpm_designation = $CinetPay->_cpm_designation;
        $buyer_name = $CinetPay->_buyer_name;

       if($cpm_result == '00'){
            //Le paiement est bon
            // Verifier que le montant correspond à la transaction dans votre système
            // Traitez dans la base de donnée et delivrez le service au client
       }else{
             //Le paiement a échoué
       }
    } catch (Exception $e) {
        echo "Erreur :" . $e->getMessage();
        // Une erreur s'est produite
    }
} else {
    // Tentative d'accès direct au lien IPN
}
?>
```


## Etape 2 : Préparation et affichage du formulaire de paiement

### Page de Notification

### Intégration:
```html
    <script charset="utf-8" src="https://www.cinetpay.com/cdn/seamless_sdk/latest/cinetpay.prod.min.js" type="text/javascript"></script> 
```

### Service CinetPay :
```bash
ionic generate service services/cinetpay     
```

Ajouter dans ionicApp/src/app/services/cinetpay.service.ts

```js

    import { Injectable } from '@angular/core';

    declare var CinetPay;
    
    @Injectable({
        providedIn: 'root'
    })   
    export class CinetpayService {

        private CinetPay: any;

        private apikey: string = 'YOUR_API_KEY';
        private site_id: number = YOUR_SITE_ID;
        private notify_url: string = 'https://YOUR_NOTIFY_URL';
      
        private trans_id: any; //Your transaction id
        private cpm_custom: any;
        private designation: any;
        private currency: string = 'CFA';

        constructor() {}

        seamless(amount : number){
          return new Promise(resolve => {

            //Generation d'une id de transaction
            this.trans_id = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();


            CinetPay.setConfig({
              apikey: this.apikey,
              site_id: this.site_id,
              notify_url: this.notify_url
            });
            //Lorsque la signature est généré
            CinetPay.on('signatureCreated', function (token) {
              //console.log('Tocken généré: ' + token);
            });
            CinetPay.on('paymentPending', function (e) {
              //console.log('code:' + e.code + 'Message::' + e.message);
            });
            CinetPay.on('error', function (e) {
              //console.log('Error code:' + e.code + 'Message::' + e.message);
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
              amount: amount,
              trans_id: this.trans_id,
              currency: this.currency,
              designation: this.designation,
              custom: this.cpm_custom
            });
      
            CinetPay.getSignature();  
      
          });
        }

    }
```
### Formulaire de paiement 

Dans la page de paiement : Ex : ionicApp/src/app/home/home.page.html :
```html
<ion-item>
    <ion-label position="floating">Montant à payer</ion-label>
    <ion-input type="number" placeholder="Ex : 200" [(ngModel)]="amount" color="success" min="100"></ion-input>
</ion-item>
<ion-button color="success" expand="block" shape="round" mode="ios" (click)="pay()">Payer</ion-button>
```

Dans la page de paiement : Ex : ionicApp/src/app/home/home.page.ts :
```js
amount : number = 5;

constructor(private cinetpay : CinetpayService) {}

private async pay(){
    var result = await this.cinetpay.seamless(this.amount);
    console.log(result);
}
```

## Compatibilité 

* iOS 8+
* Android 4.4+
* Windows 10 Universal App

## Votre Api Key et Site ID

Ces informations sont disponibles dans votre BackOffice [CinetPay](https://cinetpay.com/login).