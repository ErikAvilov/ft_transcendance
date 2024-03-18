from django.contrib import admin

# Register your models here.

from .models import *
from friend.models import *

#admin.site.register(ImprovedUser)
admin.site.register(UserModel)
admin.site.register(UserProfile)
admin.site.register(Game)
#admin.site.register(FriendRequest)
"""
class FriendListAdmin(admin.ModelAdmin):
	list_filter = ['user']
	list_display = ['user']
	search_fields = ['user']
	readonly_fields = ['user']

	class Meta:
		model = FriendsList


class FriendRequestAdmin(admin.ModelAdmin):
	list_filter = ['sender', 'receiver']
	list_display = ['sender', 'receiver']
	search_fields = ['sender__username', 'receiver__username']
	class Meta:
		model = FriendRequest
	
admin.site.register(FriendsList, FriendListAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)
"""