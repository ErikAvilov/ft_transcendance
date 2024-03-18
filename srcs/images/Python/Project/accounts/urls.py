from django.urls import path
from . import views, requests

urlpatterns = [
    path('account/', views.accountSettings, name='account'),
    path('account_profile_page/', views.accountView, name='accountview'),

	path('game_history/', views.games_history, name='game_history'),
	path('game_details/', views.game_details, name='game_details'),
    
    path('saveProfileSettings/', requests.saveProfileSettings, name='saveProfileSettings'),

	path('userExists/', requests.userExists, name='userExists'),

	path('toggleTfa/', requests.toggleTfa, name='toggleTfa'),
	path('disableTfa/', requests.disableTfa, name='disableTfa'),
	path('validateTfa/', requests.validateTfa, name='validateTfa'),

	path('loadRegister/', views.loadRegister, name='loadRegister'),
	path('loadLogin/', views.loadLogin, name='loadLogin'),
]