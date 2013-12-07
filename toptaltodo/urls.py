from django.conf.urls import patterns, include, url
from tastypie.api import Api
from todo.api import ToDoItemResource

from django.contrib import admin
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(ToDoItemResource())

urlpatterns = patterns('',
	url(r'^$', include('todo.urls')),
	url(r'^admin/', include(admin.site.urls)),
	url(r'^api/', include(v1_api.urls)),
)
