import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

	newUser: any = {};
	WooCommerce: any;
	billing_shipping_different: boolean = false;
	

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public ngZone: NgZone, public alertCtrl: AlertController) {

		this.newUser.billing_address = {};
		this.newUser.shipping_address = {};

		this.WooCommerce = WC({

			url: "http://localhost:8888/wordpress/",
			consumerKey: 'ck_08710020672c3f1d97b5ea5f2b1802b3b551cffb', // Dev
			consumerSecret: 'cs_eb4c0f6b1e95170fa969972b661d62859e467486', // Dev
			// url: "https://roseandabbot.mystagingwebsite.com/",
			// consumerKey: 'ck_1226ba40e8cbcf18d8e7802060cb21b4a25c9a38', // Production
			// consumerSecret: 'cs_cc647e8b0f9496a752370049f2ee4ef5651c608e', // Production


			// v2 has to be turned off, otherwise signup does not work
			// wpAPI: true,
			// version: 'wc/v2'

			// .HTACCESS in PRODUCTION for pressable
			// Header set Access-Control-Allow-Origin "*"
			// Header set Access-Control-Allow-Headers "origin, user-agent, accept, x-r$
			// Header set Access-Control-Allow-Methods "PUT, GET, POST, DELETE, OPTIONS"
			// RewriteEngine On
			// RewriteCond %{REQUEST_METHOD} OPTIONS
			// RewriteRule ^(.*)$ $1 [R=200,L]
			
		});


	}

	setBillingToShipping(){
		this.billing_shipping_different = !this.billing_shipping_different;
	}

	checkEmail(){
		
		let validEmail = false;
		let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (reg.test(this.newUser.email)){

			this.WooCommerce.getAsync('customers/email/' + this.newUser.email ).then( (data) => {

				let res = (JSON.parse(data.body));
				
				if ( res.errors){ 

					validEmail = true;

				}  else {

					validEmail = false;

					this.toastCtrl.create({
			            message: 'Email is already registered!',
			            duration: 3000,
			            position: 'top',
			            showCloseButton: true
				    }).present();
				}

				console.log(data);

			});

		} else {

			validEmail = false;

			this.toastCtrl.create({
	            message: 'invalid Email!',
	            duration: 3000,
	            position: 'top',
	            showCloseButton: true
		    }).present();

		}
	}

	signup(){

		let customerData = {

			customer : {}

		}

		customerData.customer = {
		  "email": this.newUser.email,
		  "first_name": 'John',
		  "last_name": 'Doe',
		  "username": this.newUser.username,
		  "password": "0123+ofnA",
		  "billing_address": {
		    "first_name": 'John',
		    "last_name": 'Doe',
		    "company": '',
		    "address_1": '969 Market',
		    "address_2": '',
		    "city": 'San Francisco',
		    "state": 'CA',
		    "postcode": '94103',
		    "country": 'US',
		    "email": this.newUser.email,
		    "phone": '(555) 555-5555'
		  },
		  "shipping_address": {
		    "first_name": 'John',
		    "last_name": 'Doe',
		    "company": '',
		    "address_1": '969 Market',
		    "address_2": '',
		    "city": 'San Francisco',
		    "state": 'CA',
		    "postcode": '94103',
		    "country": 'US'
		  }
		};

		// {

		//   first_name: this.newUser.first_name,
		//   last_name: this.newUser.last_name,
		//   billing: {
		//     first_name: this.newUser.first_name,
		//     last_name: this.newUser.last_name,
		//     company: '',
		//     address_1: this.newUser.billing_address.address_1,
		//     address_2: this.newUser.billing_address.address_2,
		//     city: this.newUser.billing_address.city,
		//     state: this.newUser.billing_address.state,
		//     postcode: this.newUser.billing_address.zip,
		//     country: this.newUser.billing_address.country,

		//     phone: this.newUser.billing_address.phone
		//   },
		//   shipping: {
		//     first_name: this.newUser.first_name,
		//     last_name: this.newUser.first_name,
		//     company: '',
		//     address_1: this.newUser.shipping_address.address_1,
		//     address_2: this.newUser.shipping_address.address_2,
		//     city: this.newUser.shipping_address.city,
		//     state: this.newUser.shipping_address.state,
		//     postcode: this.newUser.shipping_address.zip,
		//     country: this.newUser.shipping_address.country
		//   }
		// };

		// if ( !this.billing_shipping_different ){
		// 	this.newUser.shipping_address = this.newUser.billing_address;
		// }


		this.WooCommerce.postAsync('customers', customerData).then((data) => {

			let response = JSON.parse(data.body);

			if ( response.customer ){

				this.alertCtrl.create({
				    title: 'Account Successfully Created',
				    // message: 'Do you want to buy this book?',
				    buttons: [
				      {
				        text: 'Login',
				        // role: 'cancel',
				        handler: () => {
				          console.log('Login clicked');
				        }
				      }
				    ]
			  	}).present();

			} else if ( response.errors ) {

				this.toastCtrl.create({

					message: response.errors[0].message, 
					showCloseButton: true

				}).present();

			}

		});		

	}
}
