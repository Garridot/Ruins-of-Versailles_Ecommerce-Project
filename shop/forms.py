from django import forms

from core.models import Customer


class customerForm(forms.ModelForm):
    
    class Meta:
        model  = Customer
        fields =  ('__all__')