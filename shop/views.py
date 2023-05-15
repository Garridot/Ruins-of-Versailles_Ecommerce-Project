from django.shortcuts import render
import json


from .forms import customerForm

# Create your views here.


def home(request):
    if request.method == 'POST':
        # Retrieve the data sent via fetch request
        data = json.loads(request.body)       
        cartList = data
        # Return the JSON response

    return render(request,'home.html')



def checkout_order(request):    
    form = customerForm() 

    return render(request,'checkout.html',{"form":form})


def shipping_successful(request,customer,order): 
    return render(request,'successful.html')    