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
