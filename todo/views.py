from django.shortcuts import render, redirect
from todo.models import ToDoItem
from tastypie.models import ApiKey
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate

@login_required
def index(request):
	if request.user.is_authenticated():
		api_key = ApiKey.objects.get_or_create(user=request.user)
		context = {'username': request.user.username, 'api_key': api_key[0].key}
	else:
		context = {}
	return render(request, 'todo/index.html', context)

def signup(request):
	if request.method == 'POST':
		form = UserCreationForm(request.POST)
		if form.is_valid():
			user = form.save()
			user = authenticate(username=request.POST['username'], password = request.POST['password1'])
			login(request, user)
			return redirect('/')
	else:
		form = UserCreationForm()
	return render(request, 'todo/signup.html', {'form':form,})