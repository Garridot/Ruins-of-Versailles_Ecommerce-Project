from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from core.models import Product, Order, OrderDetail,Customer

from .serializers import *
from .actions import *




# Create your views here.


def get_exchange_rate():
    url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales'
    response = requests.get(url)
    data = response.json()
    for item in data:
        if item['casa']['nombre'] == 'Dolar Blue':
            return float(item['casa']['venta'].replace(',', '.'))
            


class ProductView(ModelViewSet):
    
    serializer_class   = ProductSerializer
    queryset           = Product.objects.all()

    def list(self, request):

        queryset   = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)


class CustomerView(ModelViewSet):
    
    serializer_class   = CustomerSerializer
    queryset           = Customer.objects.all()

    def list(self, request):

        queryset   = Customer.objects.all()
        serializer = CustomerSerializer(queryset, many=True)
        return Response(serializer.data)


   



class OrderView(ModelViewSet):   

    serializer_class   = OrderSerializer
    queryset           = Order.objects.all()

    def list(self, request):

        queryset   = Order.objects.all()
        serializer = OrderSerializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        data = self.get_object()
        
        actions = OrderActions(data)
        actions.return_stock()
        return super().destroy(request, *args, **kwargs)    



class OrderDetailView(ModelViewSet):

    serializer_class   = OrderDetailSerializer
    queryset           = OrderDetail.objects.all()

    def list(self, request):

        queryset   = OrderDetail.objects.all()
        serializer = OrderDetailSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, validated_data):
        data = validated_data.data     

        serializer = self.get_serializer(data=data)

        if serializer.is_valid(raise_exception=True):
            action = OrderDetailActions(data['product'],data['order'],data['quantity']) 
            action.get_stock()  
            self.perform_create(serializer)




            # get total order 
            get_order   = Order.objects.get(id=data['order'])
            get_product = Product.objects.get(id=data['product'])

            get_order.total += (get_product.price * int(data['quantity']))
            get_order.save()
            

            # get total USD
            dolar  = get_exchange_rate()
            get_order.total_USD =  get_order.total / dolar

            get_order.save()
    
            return Response(serializer.data, status=status.HTTP_201_CREATED, ) 


    

    def destroy(self, request, *args, **kwargs):
        data = self.get_object()

        action = OrderDetailActions(data.product.id,data.order,data.cuantity) 
        action.return_stock()

        return super().destroy(request, *args, **kwargs)    
            

    
