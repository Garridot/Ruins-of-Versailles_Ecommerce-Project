from rest_framework import serializers
from rest_framework import status
from core.models import *

import datetime

def is_lower(value):
    if value < 0:
        raise serializers.ValidationError('Value cannot be lower than 0.',code=status.HTTP_400_BAD_REQUEST)      

def required(value):
    if value is None:
        raise serializers.ValidationError('This field is required',code=status.HTTP_400_BAD_REQUEST)      



class ProductSerializer(serializers.ModelSerializer): 
    name   = serializers.CharField(validators=[required])
    author = serializers.CharField(validators=[required])
    category = serializers.CharField(allow_null=True)
    price  = serializers.FloatField(validators=[required,is_lower])
    stock  = serializers.IntegerField(validators=[required,is_lower]) 
    picture= serializers.ImageField(allow_null=True, use_url=True)    

    class Meta:
        model  = Product
        fields =  ('__all__')

    def validate(self, attrs): 
                 
        return super().validate(attrs) 

    def update(self, instance, validated_data):        
        if validated_data.get('picture') == None:
            validated_data.pop('picture', None)
        return super().update(instance, validated_data)       





class CustomerSerializer(serializers.ModelSerializer): 
    # email       = serializers.EmailField(validators=[required])
    # author      = serializers.CharField(validators=[required])
    # first_name  = serializers.CharField(validators=[required])
    # last_name   = serializers.CharField(validators=[required])
    # address     = serializers.CharField(validators=[required]) 
    # postal_code = serializers.CharField(validators=[required])    

    class Meta:
        model  = Customer
        fields =  ('__all__')

    def validate(self, attrs): 
                 
        return super().validate(attrs) 

    
     




class OrderSerializer(serializers.ModelSerializer):    

    date_time     = serializers.ReadOnlyField()
    total     = serializers.ReadOnlyField()
    total_USD = serializers.ReadOnlyField()    

    class Meta:
        model  = Order        
        fields =  ('id','customer','date_time','total','total_USD')




class OrderDetailSerializer(serializers.ModelSerializer):

    quantity = serializers.IntegerField(validators=[required,is_lower])

    class Meta:
        model  = OrderDetail       
        fields =  ('__all__')

    def validate(self, attrs):
        order    = attrs['order']
        product  = attrs['product']
        quantity = attrs['quantity'] 
        
        if OrderDetail.objects.filter(order=order,product=product).exists():
            data   = {'Error':'The product has already been requested in this order.'}
            raise serializers.ValidationError(data)

        get_prod  = Product.objects.get(name=product)     

        if get_prod.status == 'out-of-stock': 
            data   = {'Error':'This product is out-of-stock.'}
            raise serializers.ValidationError(data)     

        if get_prod.stock < quantity: 
            data   = {'Error':f'There is not enough stock left to add this product to the order. Stock available: {get_prod.stock}'}
            raise serializers.ValidationError(data) 

        return super().validate(attrs)

      

    

      