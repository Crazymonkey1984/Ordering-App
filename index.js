import {menuArray} from './data.js';

// render data.js to page
const menuContainer = document.getElementById('menu'); 
menuContainer.innerHTML = menuArray.map(item => {
    return `
    <div class="menu-item">
        <div class="menu-emoji">${item.emoji}</div>
        <div class="menu-details">
            <h2 class="name">${item.name}</h2>
            <p class="ingredients">${item.ingredients}</p>
            <p class="price">${item.price}</p>
        </div>
        <button class="add-btn" id="add-btn" data-id="${item.id}">+</button>
    </div>`
}).join(' ')

let order =[];
let orderSectionEl = null; 
let orderItemsContainer = null;
let totalPriceEl = null;

document.addEventListener('click', e=>{
    if(e.target.classList.contains('add-btn')){
        const itemId = parseInt(e.target.dataset.id);
        // console.log(itemId)
        handleAddBtnClick(itemId);
    }
    
    if(e.target.classList.contains('remove-btn')){
        const itemId = parseInt(e.target.dataset.id);
        handleRemoveBtnClick(itemId);
    }
})

function handleAddBtnClick(itemId){
    const targetItemObj = menuArray.filter(function(item){
        return item.id === itemId
    })[0]
    if (!targetItemObj) return; 
    
    const existingItem = order.find(item => item.id === itemId);
    
    if(existingItem){
        existingItem.quantity += 1;
    }else{
        order.push({ ...targetItemObj, quantity: 1 })
    }
    
    renderOrder()
    // if(targetItemObj.id){
    //     targetItemObj.quantity += 1;
    // } 
    
    // console.log(order)
    
    // console.log(`Added ${targetItemObj.name}, quantity now ${targetItemObj.quantity}`)
}

function handleRemoveBtnClick(itemId){
    const targetRemoveObj = order.filter(function(item){
        return item.id === itemId
    })[0]
    
    if (!targetRemoveObj) return; 
    
    if (targetRemoveObj){ 
        if (targetRemoveObj.quantity>1) {
            targetRemoveObj.quantity -=1;
        }else{
            order = order.filter(item => itemId !== item.id)
        }
        
    }
    
    renderOrder()
}

function renderOrder(){
    if (order.length === 0 && orderSectionEl){
        orderSectionEl.remove();
        orderSectionEl = null; 
        return
    }; 
    
    if(order.length>0 && !orderSectionEl){
        createOrderSection()
    }
    
    orderItemsContainer.innerHTML = order.map(item => {
        return `
        <div class="order-item">
            <div class ="item-info">
                <span>${item.name} x${item.quantity}</span>
                <button class ="remove-btn"" data-id="${item.id}"> remove </button>
            </div>
            <span>${item.price * item.quantity}</span>
        </div>`
    }).join(' '); 
    
    const total = order.reduce((sum, item) => sum + item.price*item.quantity, 0)
    totalPriceEl.textContent = `$${total}`
}


function createOrderSection(){
    if (order.length === 0) return; 
    
        orderSectionEl = document.createElement("order-section");
        orderSectionEl.id = "order-section"
        orderSectionEl.innerHTML = `
        <h3>Your order</h3>
        <div id="order-items"></div>
        <div class="order-total">
            <span>Total price: </span>
            <span id="total-price">$0</span>
        </div>
        <button class="complete-btn">Complete order</button>
        `; 
        
        document.querySelector('.app-container').appendChild(orderSectionEl);
        
        orderItemsContainer = orderSectionEl.querySelector('#order-items')
        totalPriceEl = orderSectionEl.querySelector('#total-price')
}


// modal section 
const modal = document.getElementById("modal")
const form = document.getElementById("checkout-form")
const confirmationEl = document.getElementById('confirmation-message')
const orderSection = document.getElementById('order-section')

document.addEventListener('click', e=> {
    if (e.target.classList.contains('complete-btn')){
        modal.classList.remove("hidden")
    }
})

modal.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// handle modal pay btn 
form.addEventListener('submit', e => {
    e.preventDefault()
    const name = document.getElementById("name").value;
    
    modal.classList.add("hidden");
    
    order=[]
    renderOrder()
    
    confirmationEl.textContent = `Thanks, ${name}! Your order is completed!`; 
    confirmationEl.classList.remove("hidden")
    
})

