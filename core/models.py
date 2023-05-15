from django.db import models
from django.db.models.signals import post_delete,pre_save
from django.dispatch import receiver

from django_countries.fields import CountryField

import os
import requests




# Create your models here.


class Customer(models.Model):
    email  = models.EmailField()
    contry = CountryField()
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=100) 


    def __str__(self):
        return self.email 







def local_media(instance,filename):
    return f"Products/{filename}" 

status_choice   = (('stock','Stock'),('out-of-stock','Out-of-stock')) 
class Product(models.Model):
    name   = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100,blank=True,null=True)
    picture = models.ImageField(blank=True,null=True, upload_to=local_media) 
    price   = models.FloatField()
    stock   = models.IntegerField()     
    status  = models.CharField(max_length=100, default='stock', choices=status_choice,) 
    
    def __str__(self):
        return self.name

@receiver(post_delete, sender=Product)
def post_save_image(sender, instance, *args, **kwargs):
    """ Clean Old Image file """
    try:
        instance.picture.delete(save=False)
    except:
        pass

@receiver(pre_save, sender=Product)
def pre_save_image(sender, instance, *args, **kwargs):
    """ instance old image file will delete from os """
    try:
        old_img = instance.__class__.objects.get(id=instance.id).picture.path
        try:
            new_img = instance.picture.path
        except:
            new_img = None
        if new_img != old_img:
            import os
            if os.path.exists(old_img):
                os.remove(old_img)
    except:
        pass







class Order(models.Model):
    customer  = models.ForeignKey(Customer,on_delete=models.CASCADE,null=True,blank=True,default=None)
    date_time = models.DateTimeField(auto_now_add=True,)
    total     = models.FloatField(default=0)
    total_USD = models.FloatField(default=0)

    def __str__(self):
        return f"{self.id}"     
 



class OrderDetail(models.Model): 

    order    = models.ForeignKey(Order,on_delete=models.CASCADE)  
    quantity = models.IntegerField()
    product  = models.ForeignKey(Product,on_delete=models.CASCADE) 

    @property
    def get_total_product(self):        
        total = self.product.price * self.cuantity
        return total 





