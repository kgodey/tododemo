from django.conf.urls import patterns, include, url
from todo import views
from tastypie.api import Api
from todo.api import ToDoItemResource

v1_api = Api(api_name='v1')
v1_api.register(ToDoItemResource())

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^api/', include(v1_api.urls)),
	url(r'^login/', 'django.contrib.auth.views.login', {'template_name': 'todo/login.html'}, name='login'),
	url(r'^logout/', 'django.contrib.auth.views.logout_then_login', name='logout'),
	url(r'^signup/', views.signup, name='signup'),
)