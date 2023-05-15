from django.db import router
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('products',views.ProductView,basename='products') 
router.register('customers',views.CustomerView,basename='customers') 
router.register('orders',views.OrderView,basename='orders') 
router.register('order_detail',views.OrderDetailView,basename='order_detail') 
 

urlpatterns = [ 
    path('api/',include(router.urls)),    
]    