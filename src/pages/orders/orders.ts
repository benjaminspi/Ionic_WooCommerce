import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  	WooCommerce: any;
	orders_data: any;
	orders: any[];

	constructor(public navCtrl: NavController, public ngZone: NgZone) {

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

		this.orders = [];

		this.WooCommerce.getAsync("orders").then((data) =>{
			
			// console.log(JSON.parse(data.body));

			this.ngZone.run( () => {

				this.orders_data = JSON.parse(data.body);

				for (let order of this.orders_data) {

					order.quiz = order.meta_data[0].value;

					var containsSlashes = true;

					while ( containsSlashes ) {

						if ( order.quiz.match(/\\/g) ) {  
							order.quiz = this.stripSlashes( order.quiz );
						} else { 
							containsSlashes = false;
						}
					}

					order.quiz = JSON.parse( order.quiz );
					this.orders.push( order );

				}

				console.log(this.orders);

			});

		}, (err) => {
			console.log(err);
		});



	}

	stripSlashes(quiz: string){
	    return quiz.replace(/\\(.)/mg, "$1");
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
