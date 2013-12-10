from django.contrib.auth.models import User
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.authentication import ApiKeyAuthentication
from todo.authorization import PerUserAuthorization
from todo.models import ToDoItem


class ToDoItemResource(ModelResource):
	class Meta:
		queryset = ToDoItem.objects.all()
		resource_name = 'todoitem'
		authorization = PerUserAuthorization()
		authentication = ApiKeyAuthentication()
		max_limit = None
		always_return_data = True
	
	def dehydrate_due_date(self, bundle):
		try:
			return bundle.data['due_date'].date()
		except AttributeError:
			return bundle.data['due_date']
	
	def hydrate_due_date(self, bundle):
		if bundle.data['due_date'] == '':
			bundle.data['due_date'] = None
		return bundle
	
	def hydrate(self, bundle):
		bundle.obj.user = bundle.request.user
		return bundle
