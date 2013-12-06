from django.db import models

class ToDoItem(models.Model):
	PRIORITY_CHOICES = (
		('1', 'Highest'),
		('2', 'High'),
		('3', 'Medium'),
		('4', 'Low'),
		('5', 'Lowest'),
	)
	title = models.CharField(max_length=255)
	date_added = models.DateTimeField(auto_now_add=True)
	due_date = models.DateTimeField()
	priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='3')
	completed = models.BooleanField(default=False)
	notes = models.TextField(blank=True)
	
	def __unicode__(self):
		return self.title
