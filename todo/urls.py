from django.conf.urls import patterns, url
from todo import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index')
)