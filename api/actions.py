from rest_framework.response import Response
from rest_framework import status
from core.models import Order, Product,OrderDetail

class OrderActions:
    def __init__(self,order):
        self.order = order

    def return_stock(self):
       
        products = OrderDetail.objects.filter(order=self.order)        

        for i in products:
            product = Product.objects.get(name=i.product)                      
            product.stock=product.stock + int(i.quantity)
            product.save()    


class OrderDetailActions:
    def __init__(self,product,order,quantity):
        self.product  = product
        self.order    = order
        self.quantity = quantity 
    
    def get_stock(self):
        
        if Product.objects.filter(id=self.product).exists():

            prod_ = Product.objects.get(id=self.product)            
            prod_.stock = prod_.stock - int(self.quantity)
            prod_.save()

    def return_stock(self):
        if Product.objects.filter(id=self.product).exists():

            prod_ = Product.objects.get(id=self.product)            
            prod_.stock = prod_.stock + int(self.quantity)
            prod_.save()       
            
            
            

     

