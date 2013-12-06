from django.forms import ModelForm
from todo.models import ToDoItem

class ToDoItemForm(ModelForm):
	class Meta:
		model = ToDoItem
		fields = ['title', 'priority', 'due_date', 'notes']