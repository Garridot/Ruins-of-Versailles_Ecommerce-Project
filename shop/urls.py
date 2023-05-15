from django.urls import path
from .views import *


urlpatterns = [
    path('',home,name='home'),   
    path('checkout_order/',checkout_order,name='checkout_order'),  
    path('shipping_successful/<str:customer>/order=<str:order>/',shipping_successful,name='checkout_order'),   
]
