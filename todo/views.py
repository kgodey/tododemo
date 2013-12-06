from django.shortcuts import render
from todo.models import ToDoItem

def index(request):
	todo_list = ToDoItem.objects.order_by('-date_added')
	context = {'todo_list': todo_list}
	return render(request, 'todo/index.html', context)
