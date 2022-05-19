const products_card = document.querySelector("#products");
import {ProductsData} from '../db/ProductsData.js';

let cardBasket = []

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
        products.forEach((product) => {
            products_card.insertAdjacentHTML("beforeend", 
            `<section class="flex flex-col items-center bg-[#fbfbfb] rounded-xl shadow-xl">
                <div class="w-full">
                    <img src="${product.imageUrl}" class="w-full h-[20em] object-cover rounded-lg" alt="" srcset="">
                </div>
                <div class="my-4 flex flex-col items-start px-4 space-y-2 w-full justify-between">
                    <p>Product Title: ${product.title}</p>
                    <p>Product Price: $${product.price}</p>
                    <button class="w-full bg-gradient-to-r from-purple-300 to-purple-800 text-white py-3 rounded-md shadow-lg" id="add_to_card" data-id="${product.id}"><i class="fas fa-shopping-cart mr-3"></i>Add To Card</button>
                </div>
            </section>`)
        })
    }

    getAddToCardBtns(){
        const addToCardBtn = document.querySelectorAll("#add_to_card")
        addToCardBtn.forEach((btn) => {
            const id = btn.dataset.id
            // check if this id is in card or not !
            const isInBasket = cardBasket.find(product => product.id === id)
            if (isInBasket) {
                btn.innerHTML = "In Card"
                btn.disabled = true
            }
            btn.addEventListener("click", (event) => {
                event.target.innerHTML = `<i class="fas fa-shopping-cart mr-3"></i> In Card`
                event.target.disabled = true
                event.target.className = `w-full bg-gradient-to-r from-green-300 to-green-800 transition-all delay-300 ease-in-out text-white py-3 rounded-md shadow-lg`
                // get product from products : 
                const addedProduct = Storage.getProduct(id)
                // add to card
                cardBasket = [...cardBasket, { ...addedProduct, quantity: 1}]
                Storage.saveCart(cardBasket)
            })
        })
        // update cart value
    }
}

// 3.Storage
class Storage{
    static saveProducts(product){
        localStorage.setItem("products", JSON.stringify(product))
    }

    static getProduct(id){
        const _products = JSON.parse(localStorage.getItem("products"))
        return _products.find(product => product.id === +id)
    }

    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart))
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const  productsData = products.getProduct();
    const Ui = new UI();
    Ui.displayProducts(ProductsData)
    Ui.getAddToCardBtns()
    Storage.saveProducts(productsData)
})