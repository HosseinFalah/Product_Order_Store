const products_card = document.querySelector("#products");
import {ProductsData} from '../../db/ProductsData.js';

const backDrop = document.querySelector("#backDrop");
const closeSidebar = document.querySelector("#btnCloseSidbar");
const openSidebar_menu = document.querySelector("#openSidebar_menu");
const Sidebar_menu = document.querySelector("#sidebar_menu");
const cardTotal = document.querySelector("#cart_total");
const totalPriceItem = document.querySelector(".totalPrice");
const cartlist = document.querySelector("#cart_list")


let cardBasket = [] //data
let buttonsDOM = []

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
        const addToCardBtn = [...document.querySelectorAll("#add_to_card")];
        buttonsDOM = addToCardBtn
        addToCardBtn.forEach((btn) => {
            const id = btn.dataset.id
            // check if this id is in card or not !
            const isInBasket = cardBasket.find(product => +product.id === +id)
            if (isInBasket) {
                btn.innerHTML = `<i class="fas fa-shopping-cart mr-3"></i> In Card`
                btn.disabled = true
                btn.className = `w-full bg-gradient-to-r from-green-300 to-green-800 transition-all delay-300 ease-in-out text-white py-3 rounded-md shadow-lg`
            }
            btn.addEventListener("click", (event) => {
                event.target.innerHTML = `<i class="fas fa-shopping-cart mr-3"></i> In Card`
                event.target.disabled = true
                event.target.className = `w-full bg-gradient-to-r from-green-300 to-green-800 transition-all delay-300 ease-in-out text-white py-3 rounded-md shadow-lg`
                // get product from products : 
                const addedProduct = {...Storage.getProduct(id), quantity: 1}
                // add to card
                cardBasket = [...cardBasket, addedProduct]
                Storage.saveCart(cardBasket)
                Swal.fire({
                    title: 'The operation was successful',
                    text: 'The operation was successful',
                    icon: 'success'
                })
                // update cart value
                this.setCartValue(cardBasket)
                // add to cart item
                this.addCartItem(addedProduct)
                //get cart from Storage
            })
        })
    }

    setCartValue(cart){
        // 1.Cart Items:
        // 2.Cart toTal Price:
        let tempCartItems = 0;
        const totalPrice = cart.reduce((acc, curr) => {
            tempCartItems += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0)
        totalPriceItem.innerHTML = `$${totalPrice.toFixed(2)}`;
        cardTotal.innerHTML = tempCartItems;
    }

    addCartItem(cartItem){
        cartlist.insertAdjacentHTML("beforeend",
        `<li class="flex py-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img src="${cartItem.imageUrl}" alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." class="h-full w-full object-cover object-center">
            </div>
            <div class="ml-4 flex flex-1 flex-col">
                <div>
                    <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3><a href="#">${cartItem.title}</a></h3>
                        <p class="ml-4">$${cartItem.price}</p>
                    </div>
                </div>
                <div class="flex flex-1 items-center justify-between text-sm">
                    <p class="text-gray-500">Qty ${cartItem.quantity}</p>
                    <div class="flex flex-col items-center justify-center">
                        <i class="fa-solid fa-chevron-up text-green-700 cursor-pointer" data-id="${cartItem.id}"></i>
                        <span class="text-white bg-neutral-500 px-2 m-2 rounded-lg flex items-center justify-center">${cartItem.quantity}</span>
                        <i class="fa-solid fa-chevron-down text-red-500 cursor-pointer" data-id="${cartItem.id}"></i>
                    </div>
                    <div class="flex">
                        <i class="fas fa-trash bg-red-500 text-white px-2 py-3 rounded" id="trashProduct" data-id="${cartItem.id}"></i>
                    </div>
                </div>
            </div>
        </li>`)
    }

    setUpApp(){
        // get cart from storeg: 
        cardBasket = Storage.getCart() || [];
        // addCartItem
        cardBasket.forEach(cartItem => this.addCartItem(cartItem))
        // setValues: price + item
        this.setCartValue(cardBasket)
    }

    clearCart(){
        // remove
        cardBasket.forEach((cartItem) => this.removeItem(cartItem.id))
        //remove cart content children: 
        while (cartlist.children.length) {
            cartlist.removeChild(cartlist.children[0])
        }
        closeSidebarHandler()
    }

    removeItem(id){
        // update Cart
        cardBasket = cardBasket.filter(cartItem => cartItem.id !== id)
        console.log(cardBasket);
        // total Price and cart Items
        this.setCartValue(cardBasket);
        // update Storage:
        Storage.saveCart(cardBasket)
        // get add to cart btns => update text and disable
        this.getSingleButton(id)
    }

    getSingleButton(id){
        const button = buttonsDOM.find(btn => +btn.dataset.id === +id)
        button.innerHTML = `<i class="fas fa-shopping-cart mr-3"></i>Add To Card`
        button.disabled = false
        button.className = `w-full bg-gradient-to-r from-purple-300 to-purple-800 text-white py-3 rounded-md shadow-lg`
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

    static getCart(){
        return JSON.parse(localStorage.getItem("cart"))
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const  productsData = products.getProduct();
    const Ui = new UI();
    // set up: get cart and set up app:
    Ui.setUpApp()
    Ui.displayProducts(ProductsData)
    Ui.getAddToCardBtns()
    Storage.saveProducts(productsData)

    const clearCart = document.querySelector("#clearCart")
    //clear cart:
    clearCart.addEventListener("click", () => Ui.clearCart())
    // cart functionality
    cartlist.addEventListener("click", (event) => {
        if (event.target.classList.contains("fa-chevron-up")) {
            const addQuantity = event.target;
            // 1.get item from cart
            const addedItem = cardBasket.find(item => +item.id == +addQuantity.dataset.id)
            addedItem.quantity++;
            console.log(cardBasket);
            // 2.update cart value
            Ui.setCartValue(cardBasket)
            // 3.save cart
            Storage.saveCart(cardBasket)
            // 4.update cart item in ui:
            addQuantity.nextElementSibling.innerText = addedItem.quantity;
        } else if (event.target.classList.contains("fa-chevron-down")) {
            const subQuantity = event.target
            // 1.get item from cart
            const subStractedItem = cardBasket.find(item => item.id == subQuantity.dataset.id)
            subStractedItem.quantity--
            // 2.update cart value
            Ui.setCartValue(cardBasket)
            // 3.save cart
            Storage.saveCart(cardBasket)
            // 4.update cart item in ui:
            subQuantity.previousElementSibling.innerText = subStractedItem.quantity;
        } else if(event.target.classList.contains("fa-trash")){
            const trash = document.querySelector("#trashProduct");
            const removeItem = event.target;
            const _removedItem = cardBasket.find(item => +item.id === +removeItem.dataset.id)
            Ui.removeItem(_removedItem.id)
            Storage.saveCart(cardBasket)
            trash.parentElement.parentElement.parentElement.parentElement.remove()
        }
    })

})


const openSidbarHandler = () => {
    backDrop.classList.remove("hidden");
    Sidebar_menu.classList.remove("hidden")
}

const closeSidebarHandler = () => {
    backDrop.classList.add("hidden");
    Sidebar_menu.classList.add("hidden")
}

backDrop.addEventListener("click", closeSidebarHandler)
closeSidebar.addEventListener("click", closeSidebarHandler)
openSidebar_menu.addEventListener("click", openSidbarHandler)