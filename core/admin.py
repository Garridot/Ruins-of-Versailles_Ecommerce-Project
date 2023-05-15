from django.contrib import admin
from .models import *

# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'price', 'stock')    


admin.site.register(Product,ProductAdmin)  
admin.site.register(Order)
