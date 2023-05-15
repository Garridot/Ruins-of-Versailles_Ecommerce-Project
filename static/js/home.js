
// Header //

var header     = document.querySelector("header")
var barmenu    = document.querySelector(".bar-menu");
var iconmenu   = document.querySelector(".icon-menu");
var iconcancel = document.querySelector(".icon-menu-cancel");
var nav        = document.querySelector("nav"); 


iconmenu.onclick = ()=>{
    if (document.querySelector(".viewpainting").classList.contains("click")){
        nav.classList.toggle("nav-click"); 
        iconmenu.classList.add("click");
        iconcancel.classList.add("click");   
    }else{
        header.querySelectorAll("p").forEach(i=>{
            i.classList.add("nav-click");
        })
        iconmenu.classList.add("click");
        iconcancel.classList.add("click");    
        nav.classList.add("nav-click");  
    }    
}

iconcancel.onclick = ()=>{
    if (document.querySelector(".viewpainting").classList.contains("click")){
        nav.classList.toggle("nav-click"); 
        iconmenu.classList.remove("click");
        iconcancel.classList.remove("click"); 
    }else{
        header.querySelectorAll("p").forEach(i=>{
            i.classList.remove("nav-click");
        })
        iconmenu.classList.remove("click");
        iconcancel.classList.remove("click");    
        nav.classList.remove("nav-click");  
    }    
}





// Carousel //

let cartList = JSON.parse(localStorage.getItem('cartList')) || [];


window.onload = async () => {
    const response = await fetch("/api/products/")
    const data = await response.json()
    renderItems(data); 
}

var carousel = document.querySelector(".carousel");

const renderItems =(data)=>{

    for (let i = 0; i < data.length; i++) {     
        var span = document.createElement("span");
        span.innerHTML = `
            <div class="card" onclick="viewPainting(${data[i].id})">
                <div class="card-img">
                    <img class="card-img-top" src="${data[i].picture}">
                </div>
                <div class="card-data">
                    <h5>${data[i].name}</h5>
                    <p>${data[i].price}$</p>
                </div>
            </div>
        `
        carousel.appendChild(span);    
    }
}

var bottonPrev = document.querySelector(".prev");
var bottonNext = document.querySelector(".next");

bottonPrev.classList.add("disabled");

var limit     = 49.800000000000004;

if (matchMedia('(max-width: 1200px)').matches){
    var limit = 66.4;
}
if (matchMedia('(max-width: 800px)').matches){
    var limit = 83;
}

let translate = 0;

const slideRight = ()=>{
    translate = translate + 16.6;    
    carousel.style.transform = "translateX(-"+ (translate) +"%)";    
    disabledBtn()
}

const slideLeft = ()=>{          
    translate = translate - 16.6;    
    carousel.style.transform = "translateX(-"+ (translate)  +"%)"; 
    disabledBtn()
}

const disabledBtn = ()=>{     

    if(limit == translate){
        bottonNext.disabled = true;  
        bottonNext.classList.add("disabled");          
    }
    if(limit > translate){        
        bottonNext.disabled = false; 
        bottonNext.classList.remove("disabled"); 
    }  
    
    if(translate == 0){
        bottonPrev.disabled = true;
        bottonPrev.classList.add("disabled");        
    }else{        
        bottonPrev.disabled = false;
        bottonPrev.classList.remove("disabled");       
    }     
}



// Painting //

var view = document.querySelector(".viewpainting");

const viewPainting = (id)=>{  
    header.querySelectorAll("p").forEach(i=>{
        i.classList.add("nav-click");
    })
    iconmenu.querySelector("svg").classList.add("click"); 

    view.classList.add("click");
    
    fetch( `/api/products/${id}/` ,{             
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },                     
    })    
    .then(response => response.json()) 
    .then(result => {       
        var data = result;
        renderItem(data);        
    })

}

const renderItem = (data)=>{
    view.querySelector(".painting-res").innerHTML = `
    <div class="background-paint" style='background: url("${data.picture}");background-position: center;background-size: cover;'></div>
        <div class="paint">
            <img src="${data.picture}" alt="">
        </div>
        <div class="pain-data" value="${data.id}">
            <div class="pain-title">
                <h1>${data.name}</h1>
                <p>${data.author}</p>
                <h5>${data.price} $</h5>
            </div>
        
            <label for="Quantity">Quantity</label>
            <div class="paint-cart">  
                <div class="botton-cart">
                    <button class="adjust adjust-minus" id="substract">-</button>
                </div>
                <div class="input-cart">
                    <input type="text" disabled class="quantity" value="1" min="1" pattern="[0-9]*" max="${data.stock}" name="quantity">
                </div>
                <div class="botton-cart">
                    <button class="adjust adjust-minus" id="add">+</button>
                </div>
                <div class="botton-cart-submit">
                    <button type="submit" name="add" onclick="AddToCart()" id="AddToCart-product-template" class="button solid">
                        <span id="AddToCartText-product-template">
                            Add to Cart
                        </span>
                    </button>
                </div>                             
            </div>
            <div class="pain-text">
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                    Laborum sequi error fuga illum voluptas mollitia, nisi 
                    expedita quos impedit quia magni earum placeat, explicabo, 
                    vel temporibus voluptatem porro accusamus eos?
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                    Laborum sequi error fuga illum voluptas mollitia, nisi 
                    expedita quos impedit quia magni earum placeat, explicabo, 
                    vel temporibus voluptatem porro accusamus eos?
                </p>
            </div>
        </div>
    `; 

    checkStock(data);

    var btncartSubstract = document.querySelector("#substract");
    var btncartAdd       = document.querySelector("#add");
    var cartQuantity     = document.querySelector(".quantity");

    if(btncartSubstract){
        btncartSubstract.addEventListener("click",()=>{
            if(cartQuantity.value > 1){
                cartQuantity.value = parseInt(cartQuantity.value) - 1;
            }
        })
    }

    if(btncartAdd){
        btncartAdd.addEventListener("click",()=>{
            if(cartQuantity.value < data.stock){
                cartQuantity.value = parseInt(cartQuantity.value) + 1;
            }
        })
    }
}


const checkStock = (data)=>{

    if(data.status == "out-of-stock"){
        document.querySelector(".viewpainting .paint-cart").innerHTML = " ";
        document.querySelector(".viewpainting .paint-cart").innerHTML = `<li class="message-alert">out-of-stock</li>`;
    }
}

var productBtn = document.querySelector(".viewpainting .bar-menu");

productBtn.onclick = ()=>{
    view.classList.remove("click");
    iconmenu.querySelector("svg").classList.remove("click");
    header.querySelectorAll("p").forEach(i=>{
        i.classList.remove("nav-click");
    });    
}


    


const AddToCart = ()=>{ 

    var productid        = document.querySelector(".pain-data").getAttribute("value");
    var productName      = document.querySelector(".pain-title h1").textContent;
    var productPrice     = document.querySelector(".pain-title h5").textContent;
    var productQuantity  = document.querySelector(".quantity").value; 
    
    for (let i = 0; i < cartList.length; i++) {
        if(cartList[i].id == productid){
            cartList.splice(cartList.indexOf(cartList.find(e => e.id == productid)),1)
        }
    }

    var productData = {
        "id"      : productid, 
        "name"    : productName,
        "price"   : productPrice,
        "quantity": productQuantity,
        "stock"   : parseInt(document.querySelector(".quantity").getAttribute("max")),
        "total"   : parseFloat(productPrice) * parseFloat(productQuantity),
    }

    cartList.push(productData);
    cartNotification(productData,cartList);
    saveLocalStorage();



    getTotal();    
    shopingCart();
}

const getTotal = ()=>{    
    
    let total = 0;
    for (let i = 0; i < cartList.length; i++) {
        total += cartList[i].total;
    }
    document.querySelector("header .herder-icon p").innerHTML = total+" $";  
}

const cartNotification = (product)=>{ 

    let items = 0;

    let cartTotal = 0
    for (let i = 0; i < cartList.length; i++) {
        items += parseInt(cartList[i].quantity);
        cartTotal += parseInt(cartList[i].total)
    }

    var noti = document.createElement("div");    
    noti.className = "added-cart";

    noti.innerHTML = `
            <p class="--1">Added to Cart</p>
            <div class="cart-item">
                <p>${product.name} (${product.quantity})</p>
                <p>${product.total}</p>  
            </div>        
            <p>you have ${items} items in your cart.</p>
            <div class="cart-total">
                <p>Total</p><p>${cartTotal}$</p>
            </div>`;
    
    document.querySelector("body").appendChild(noti);

    setTimeout(function() {
        noti.style.opacity = 0;
        setTimeout(function(){
            document.querySelector("body").removeChild(noti);
        },100)
        
    }, 4000);            
}





// Shoping Cart //

const shopingCart = ()=>{
    var ul = document.querySelector("nav ul");

    let cartList = JSON.parse(localStorage.getItem('cartList')) || [];

    

    if (cartList.length == 0) {
        ul.innerHTML =  `<li>Your cart is currently empty.</li>`
    }
    else{
        ul.innerHTML = "";

        var tableHead = document.createElement("li");
        tableHead.innerHTML =  `<p>Product</p> <p>Price</p> <p>Quantity</p> <p>Total</p> `;
        ul.appendChild(tableHead);

        let subtotal = 0;
        
        for (let i = 0; i < cartList.length; i++) {            
            subtotal += cartList[i].total;
            var li = document.createElement("li");
            li.innerHTML = `
                <div class="items-data">
                    <p>${cartList[i].name}</p>
                    <p>${cartList[i].price}</p>                
                    <div class="paint-cart">
                        <div class="botton-cart">
                            <button class="adjust adjust-minus" id="update-substract" onclick="updateSubstract(${cartList[i].id})">-</button>
                        </div>
                        <div class="input-cart">
                            <input type="text" disabled class="total-quantity" value="${cartList[i].quantity}" min="1" pattern="[0-9]*" name="quantity">
                        </div>
                        <div class="botton-cart">
                            <button class="adjust adjust-minus" id="update-add" onclick="updateAdd(${cartList[i].id})">+</button>
                        </div>                                            
                    </div>      
                    <p>$ ${cartList[i].total}</p>  
                </div>
                    <h5 onclick="removeElement(${cartList[i].id})">remove</h5> `;
            ul.appendChild(li); 
            
            
            
        }
        
        var subtotalLi = document.createElement("li");
        subtotalLi.className = "total";
        subtotalLi.innerHTML = `<p>subtotal: </p> <p>$ ${subtotal}</p>`;
        ul.appendChild(subtotalLi);

        var checkoutLi = document.createElement("li");
        checkoutLi.className = "checkout";
        checkoutLi.innerHTML = `
                    <button type="submit" class="button solid" onclick="checkout()">
                        <span>
                            Check Out
                        </span>
                    </button>`;
        ul.appendChild(checkoutLi);
    }
}

const removeElement = (id)=>{
    
    
    cartList.splice(cartList.indexOf(cartList.find(e => e.id == id)),1);    
    
    saveLocalStorage();
    getTotal();
    shopingCart(cartList);    
}

const updateSubstract = (id)=>{
    
    
    var arr = cartList[cartList.indexOf(cartList.find(e => e.id == id))];

    if(parseFloat(arr["quantity"]) > 1){

        arr["quantity"] = parseFloat(arr["quantity"]) - 1;
        arr["total"]    = parseFloat(arr["price"]) * parseFloat(arr["quantity"]),  
        
        
        getTotal(); 
        saveLocalStorage();              
        shopingCart(cartList);
    }    
}

const updateAdd = (id)=>{    
    
    var arr = cartList[cartList.indexOf(cartList.find(e => e.id == id))];

    if(parseFloat(arr["quantity"]) < arr["stock"]){

        arr["quantity"] = parseFloat(arr["quantity"]) + 1;
        arr["total"]    = parseFloat(arr["price"]) * parseFloat(arr["quantity"]),

        saveLocalStorage();  
        getTotal();
        shopingCart(cartList);
    }    
}


getTotal();   
shopingCart();


const checkout = () => {
    window.location.href = "/checkout_order/"
}