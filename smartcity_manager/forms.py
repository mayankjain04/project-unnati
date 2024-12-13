from django import forms
from .models import Profile

class BioForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['bio']

class HobbiesForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['hobbies']

class SocialLinksForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['facebook', 'twitter', 'linkedin']
