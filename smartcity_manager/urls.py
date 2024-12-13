from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),
    path('profile', views.profile, name='profile'),
    path('profile/update', views.profile_view, name='profile_view'),
    path('profile/upload-pic', views.upload_profile_picture, name='profile_pic'),
    path('support', views.support, name='support'),
    path('documentation', views.documentation, name='documentation'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)