import { Component, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import * as WC from 'woocommerce-api';

import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	WooCommerce: any;
	products: any[];

	constructor(public navCtrl: NavController, private ngZone: NgZone, private storage: Storage, public modalCtrl: ModalController, public toastCtrl: ToastController) {

		this.WooCommerce = WC({

			url: "http://localhost:8888/wordpress/",
			consumerKey: 'ck_08710020672c3f1d97b5ea5f2b1802b3b551cffb', // Dev
			consumerSecret: 'cs_eb4c0f6b1e95170fa969972b661d62859e467486', // Dev

			// url: "https://roseandabbot.mystagingwebsite.com/",
			// consumerKey: 'ck_1226ba40e8cbcf18d8e7802060cb21b4a25c9a38', // Production
			// consumerSecret: 'cs_cc647e8b0f9496a752370049f2ee4ef5651c608e', // Production

			wpAPI: true,
			version: 'wc/v2'
			
		});
		
		this.WooCommerce.getAsync("products").then( (data) => {
			
			console.log(JSON.parse(data.body));
			
			this.ngZone.run(() => {
	          this.products = JSON.parse(data.body); 
	        });

		}, (err) => {
			console.log(err);
		});

	}


	addToCart(product){

		this.storage.get("cart").then( (data) => {

			// console.log(data);

			if ( data == null || data.length == 0 ){

				data = [];
				
				data.push({
					"product": 	product,
					"qty":	1,
					"amount": parseFloat(product.price)
				});

			} else {

				let added = 0;

				for (let i = 0; i < data.length; i++) {
					
					if ( product.id == data[i].product.id ) {

						console.log("Product exists in cart");
						let qty = data[i].qty;
						data[i].qty = qty + 1;
						data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
						added = 1;

					}
				}

				if ( added == 0 ){
					data.push({
						"product": 	product,
						"qty":	1,
						"amount": parseFloat(product.price)
					});
				}

			}

			this.storage.set( "cart", data ).then( () => {

				console.log("Cart Updated");
				console.log(data);

				let toast = this.toastCtrl.create({
		            message: 'Added to cart!',
		            duration: 3000,
		            position: 'bottom',
		            showCloseButton: true
		        });

		        toast.present();
				 
			});
		});
	}


	
	openCart(){

		this.modalCtrl.create(CartPage).present();

	}

}
