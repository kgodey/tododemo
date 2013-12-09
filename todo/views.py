from django.shortcuts import render
from todo.models import ToDoItem
from django.http import HttpResponseForbidden

def index(request):
	if request.user.is_authenticated():
		todo_list = ToDoItem.objects.order_by('-date_added')
		context = {'todo_list': todo_list, 'username': request.user.username, 'api_key': request.user.api_key.key}
		return render(request, 'todo/index.html', context)
	else:
		return HttpResponseForbidden('YOU SHALL NOT PASS!')
