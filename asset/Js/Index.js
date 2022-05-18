import {ProductsData} from '../db/ProductsData.js';

// 1.Get Products
class Products{
    //Get From Api End Point!
    getProduct(){
        return ProductsData;
    }
}

// 2.Display Products
class UI{
    displayProducts(products){
        
    }
}

// 3.Storage
class Storage{

}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const  productsData = products.getProduct();
})