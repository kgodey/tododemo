from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized
from django.contrib.auth.models import User


class PerUserAuthorization(Authorization):
	def read_list(self, object_list, bundle):
		return object_list.filter(user=bundle.request.user)
	
	def read_detail(self, object_list, bundle):
		if bundle.obj.user_id is not None:
			return bundle.obj.user == bundle.request.user
		return True
	
	def create_detail(self, object_list, bundle):
		return bundle.obj.user == bundle.request.user
	
	def update_list(self, object_list, bundle):
		allowed = []
		
		for obj in object_list:
			if obj.user == bundle.request.user:
				allowed.append(obj)
		
		return allowed
	
	def update_detail(self, object_list, bundle):
		return bundle.obj.user == bundle.request.user
	
	def delete_list(self, object_list, bundle):
		return object_list.filter(user=bundle.request.user)
	
	def delete_detail(self, object_list, bundle):
		return bundle.obj.user == bundle.request.user