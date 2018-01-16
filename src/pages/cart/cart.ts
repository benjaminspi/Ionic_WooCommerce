import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

	cartItems: any[] = [];
	total: any;
	hideEmptyCartMessage: boolean = true;

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage) {
	
		this.total = 0.0;

		this.storage.ready().then( () => {

			this.storage.get("cart").then( (data) => {

				this.cartItems = data;
				// console.log(data);

				if ( this.cartItems.length > 0 ){

					this.cartItems.forEach( (item, index) => {

						this.total = this.total + (item.product.price * item.qty);

					});

				} else {

					this.hideEmptyCartMessage = false;

				}

			});

		});

	}

	removeFromCart(item, i){

		let price = item.product.price;
		let qty = item.qty;

		this.cartItems.splice(i, 1);

		this.storage.set("cart", this.cartItems).then(()=>{

			this.total = this.total - ( price * qty);

			if ( this.cartItems.length == 0 ){

				this.hideEmptyCartMessage = false;

			}

		});

	}

	closeModal(){

		this.viewCtrl.dismiss();

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CartPage');
	}

}
