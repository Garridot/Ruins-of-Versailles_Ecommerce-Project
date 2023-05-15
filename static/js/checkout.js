let cartList = JSON.parse(localStorage.getItem('cartList')) || [];


const getTotal = () => {
    // var checkout = document.querySelector(".checkout");
    var summery  = document.querySelector(".summery .items");

    let subtotal = 0;
    for (let i = 0; i < cartList.length; i++) {
    var product = document.createElement("div");
    product.className = "item";

    product.innerHTML = `
            <div>
                <span>${cartList[i].name}</span>
                <span>${cartList[i].quantity} items</span>
            </div>
            <div>
                <span>$ ${cartList[i].total}</span>
            </div>`;
            
        summery.appendChild(product);

        subtotal += cartList[i].total;    
    }

    var total = document.createElement("div");
    total.className = "total";

    total.innerHTML = `        
                <span>Total: </span>         
                <span>$ ${subtotal}</span>`;
    document.querySelector(".summery").appendChild(total);

    getExchangeRate(subtotal)
}
const  getExchangeRate = (subtotal) => {
    fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
    .then(response => response.json())
    .then(data => {
        
        for (let i = 0; i < data.length; i++) {
            
            if (data[i].casa.nombre === "Dolar Blue") {
                var dolar = parseFloat(String(data[i].casa.venta).replace(",","."))                
            }
        }
        var totalUSD = document.createElement("div");
        totalUSD.className = "total";
        totalUSD.innerHTML = `
                <span>Total USD: </span> 
                <span>$ ${parseFloat(subtotal / dolar).toFixed(2)}</span>`;                
        document.querySelector(".summery").appendChild(totalUSD);
    })
          
}


getTotal()




function getCookie(name) {      
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {                        
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {                    
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {                        
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




const checkout = () =>{
    var form = document.querySelector("form");
    var select = form.querySelector('select');

    var data = {
        "email" : form.querySelector('input[name="email"]').value,
        "contry" : select.options[select.selectedIndex].value,
        "first_name" : form.querySelector('input[name="first_name"]').value,
        "last_name" : form.querySelector('input[name="last_name"]').value,
        "address" : form.querySelector('input[name="address"]').value,
        "postal_code" : form.querySelector('input[name="postal_code"]').value,
    }

    var url = '/api/customers/'
    fetch(url,{                
        method:'POST',
        headers:{
            'Content-Type':'application/json',                
            'X-CSRFToken' : getCookie('csrftoken')          
        },
        body : JSON.stringify(data)
    })
    .then(response => response.json()) 
    .then(result => { 
        var customer = result
        sendOrder(customer)
    }) 
   
}

const sendOrder = (customer)=>{

    var url = '/api/orders/'
    fetch(url,{                
        method:'POST',
        headers:{
            'Content-Type':'application/json',                
            'X-CSRFToken' : getCookie('csrftoken')          
        },
        body : JSON.stringify({"customer":customer.id})
    })
    .then(response => response.json()) 
    .then(result => { 
        orderDetails(result,customer)
    })    
}



const orderDetails = (result,customer) =>{
    

    for (let i = 0; i < cartList.length; i++) {
        data = {
            "quantity" : parseInt(cartList[i].quantity),
            "order"    : result.id,
            "product"  : cartList[i].id
        }
        
        var url = '/api/order_detail/'
        fetch(url,{                
            method:'POST',
            headers:{
                'Content-Type':'application/json',                
                'X-CSRFToken' : getCookie('csrftoken')          
            },
            body : JSON.stringify(data)
        })
        .then(response => response.json()) 
        .then(result => { 
            localStorage.removeItem('cartList');
            window.location.href = `/shipping_successful/${customer.id}/order=${result.id}/`;
        }) 
    } 
   
}




