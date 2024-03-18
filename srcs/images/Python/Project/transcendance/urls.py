"""
URL configuration for transcendance project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from game import views as vues
from django.views.static import serve

from transcendance.router import router
from rest_framework.authtoken import views
from django.conf import settings
from django.conf.urls.static import static
from game import utils
from rest_framework_simplejwt.views import (
	TokenObtainPairView,
	TokenRefreshView,
	TokenVerifyView,
)
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# from rest_framework.authtoken import views

urlpatterns = [
    path("", vues.home, name="game"),
	path('authenticate_42/', vues.authenticate_42, name='authenticate_42'),
    path('callback/', vues.callback, name='callback'),

    path('api/', include(router.urls)),
	path('api-token-auth/', views.obtain_auth_token, name='api-tokn-auth'),

	path('login/', vues.Login, name ='login'),
	path('logout_user/', vues.logout_user, name='logout_user'),
	path('register/', vues.register, name ='register'),
    path('changeLanguage/', utils.changeLanguage, name ='changeLanguage'),
    path('get-csrf-token/', vues.get_csrf_token, name = 'get_csrf_token'),
    path('', include ('friend.urls')),
	path('', include ('accounts.urls')),
	path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

	path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
	re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}), 
	re_path(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT}),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
#urlpatterns += staticfiles_urlpatterns()

