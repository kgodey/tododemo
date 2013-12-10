from django.shortcuts import render
from todo.models import ToDoItem
from tastypie.models import ApiKey
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
	if request.user.is_authenticated():
		api_key = ApiKey.objects.get_or_create(user=request.user)
		context = {'username': request.user.username, 'api_key': api_key[0].key}
	else:
		context = {}
	return render(request, 'todo/index.html', context)