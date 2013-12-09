var app = app || {};

$(function() {
	
	app.TodoItem = Backbone.Model.extend({
		defaults: {
			title: "",
			completed: false,
			priority: "3",
			notes: "",
		},
		
		url: function() {
			var id = this.id || '';
			return "/api/v1/todoitem/"+id;
		},
		
		toggleComplete: function() {
			this.save({
				completed: !this.get("completed")
			});
		},
		
	});
	
	TodoList = Backbone.Collection.extend({
		model: app.TodoItem,
		meta: {},
		url: "/api/v1/todoitem",
		
		parse: function(response) {
			this.meta = response.meta;
			return response.objects;
		},
	});
	
	app.Todos = new TodoList();
	
	app.TodoView = Backbone.View.extend({
		tagName: "tr",
		className: "todoitem",
		template: _.template($("#todoitem-template").html()),
		
		events: {
			'focus .title': 'editTitle',
			'click .removeitem': 'removeItem',
			'change .completed': 'toggleComplete',
			'focus .priority': 'editPriority',
			'focus .duedate': 'editDueDate',
			'keypress .edit .title input': 'updatTitleeOnEnter',
			'blur .title input': 'closeTitle',
			'blur .duedate input': 'closeDueDate',
			'blur .priority select': 'closePriority',
		},
		
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
		},
		
		render: function() {
			this.$el.attr("id", this.model.get("id"));
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass("completeditem", this.model.get("completed"));
			this.$title = this.$(".edit .title input");
			this.$priority = this.$(".edit .priority select");
			this.$due_date = this.$(".edit .duedate input");
			
			return this;
		},
		
		removeItem: function() {
			this.model.destroy();
		},
		
		toggleComplete: function() {
			this.model.toggleComplete();
		},
		
		editTitle: function() {
			this.$title.removeClass("view");
			this.$title.prop('disabled', false);
			this.$title.focus();
		},
		
		editPriority: function() {
			this.$priority.removeClass("view");
			this.$priority.focus();
		},
		
		editDueDate: function() {
			this.$due_date.removeClass("view");
			this.$due_date.focus();
		},
		
		updateTitleOnEnter: function(event) {
			var keyCode = event.keyCode || event.which;
			if (keyCode != 13) return;
			this.closeTitle();
		},
		
		closeTitle: function() {
			var title = this.$title.val().trim();
			if (!title) {
				this.clear();
			} else {
				this.model.save({title: title});
				this.$title.addClass("view");
			}
		},
		
		closeDueDate: function() {
			var due_date = this.$due_date.val().trim();
			if (!due_date) {
				this.clear();
			} else {
				this.model.save({due_date: due_date});
				this.$due_date.addClass("view");
			}
		},
		
		closePriority: function() {
			var priority = this.$priority.val().trim();
			if (!priority) {
				this.clear();
			} else {
				this.model.save({priority: priority});
				this.$priority.addClass("view");
			}
		},
		
	});
	
	app.AppView = Backbone.View.extend({
		el: "#todolist",
		
		events: {
			'click .addbutton button': 'createItem',
			// 'click .sortbyduedate': 'sortByDueDate',
			// 'click .sortbypriority': 'sortByPriority',
			// 'click .sortbydateadded': 'sortByDateAdded',
		},
		
		initialize: function() {
			$.ajaxPrefilter(function(options) {
				_.extend(options, {format: "json", username: TODOS_USERNAME, api_key: TODOS_APIKEY});
			});
			
			this.listenTo(app.Todos, "add", this.addOne);
			
			app.Todos.fetch();
		},
		
		createItem: function() {
			title = this.$("#addnewitem input#newtitle").val().trim();
			priority = this.$("#addnewitem select#newpriority").val().trim();
			due_date = this.$("#addnewitem input#newduedate").val().trim();
			app.Todos.create({title:title, completed:false, priority:priority, due_date:due_date});
			this.$("#addnewitem input#newduedate").val("");
			this.$("#addnewitem input#newtitle").val("");
			this.$("#addnewitem select#newpriority").val("3");
		},
		
		addOne: function(todo) {
			var view = new app.TodoView({model: todo});
			$("#todolist").append(view.render().el);
		},
		
		addAll: function() {
			this.$("todolist").html("");
			app.Todos.each(this.addOne, this);
		},
	});
	
	new app.AppView();
});