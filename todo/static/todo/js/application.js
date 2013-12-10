var app = app || {};

$(function() {
	
	app.TodoItem = Backbone.Model.extend({
		defaults: {
			title: "",
			completed: false,
			priority: "3",
			notes: "",
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
		url: "/api/v1/todoitem/",
		sortField: 'date_added',
		sortAscending: false,
		
		parse: function(response) {
			this.meta = response.meta;
			return response.objects;
		},
		
		sortTodos: function(field) {
			if (field == this.sortField) {
				this.sortAscending = !this.sortAscending;
			} else {
				this.sortAscending = true;
				this.sortField = field;
			}
			this.sort();
		},
		
		comparator: function(todo1, todo2) {
			var todo1 = todo1.get(this.sortField) || '';
			var todo2 = todo2.get(this.sortField) || '';
			
			if (this.sortField == 'title') {
				todo1 = todo1.toLowerCase();
				todo2 = todo2.toLowerCase();
			}
		
			if (todo1 == todo2) return 0;
			if (this.sortAscending == 1) {
				return todo1 > todo2 ? 1 : -1;
			} else {
				return todo1 < todo2 ? 1 : -1;
			}
		},
	});
	
	app.Todos = new TodoList();
	
	app.TodoView = Backbone.View.extend({
		tagName: "tr",
		className: "todoitem",
		template: _.template($("#todoitem-template").html()),
		
		events: {
			'focus .title': 'editTitle',
			'focus .priority': 'editPriority',
			'focus .duedate': 'editDueDate',
			'change .title': 'saveTitle',
			'change .priority': 'savePriority',
			'change .duedate': 'saveDueDate',
			'click .removeitem': 'removeItem',
			'change .completed input': 'toggleComplete',
			'keypress .title input': 'updateTitleOnEnter',
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
			this.$title = this.$(".title input");
			this.$priority = this.$(".priority select");
			this.$due_date = this.$(".duedate input");
			
			this.$( ".datepicker" ).datepicker({dateFormat:"yy-mm-dd"});
			return this;
		},
		
		removeItem: function() {
			console.log(this);
			this.model.destroy();
		},
		
		toggleComplete: function() {
			this.model.toggleComplete();
		},
		
		editTitle: function() {
			this.$title.removeClass("view");
		},
		
		editPriority: function() {
			this.$priority.removeClass("view");
		},
		
		editDueDate: function() {
			this.$due_date.removeClass("view");
		},
		
		updateTitleOnEnter: function(event) {
			var keyCode = event.keyCode || event.which;
			if (keyCode != 13) return;
			this.closeTitle();
		},
		
		closeTitle: function() {
			this.$title.addClass("view");
		},
		
		closeDueDate: function() {
			this.$due_date.addClass("view");
		},
		
		closePriority: function() {
			this.$priority.addClass("view");
		},
		
		saveTitle: function() {
			var title = this.$title.val().trim();
			this.model.save({title: title});
		},
		
		savePriority: function() {
			var priority = this.$priority.val().trim();
			this.model.save({priority: priority});
		},
		
		saveDueDate: function() {
			var due_date = this.$due_date.val().trim();
			this.model.save({due_date: due_date});
		},
		
	});
	
	app.AppView = Backbone.View.extend({
		el: "#todolist",
		
		events: {
			'click .addbutton button': 'createItem',
			'keyup #newtitle': 'createItemOnEnter',
			'click button#sortduedate': 'sortByDueDate',
			'click button#sortpriority': 'sortByPriority',
			'click button#sorttitle': 'sortByTitle',
			'click button#sortcompleted': 'sortByCompleted',
		},
		
		initialize: function() {
			$.ajaxPrefilter(function(options) {
				_.extend(options, {
					headers: {
						'Authorization': 'ApiKey ' + TODOS_USERNAME + ':' + TODOS_APIKEY,
					}
				});
			});
			
			this.listenTo(app.Todos, "add", this.addOne);
			this.listenTo(app.Todos, "reset", this.addAll);
			this.listenTo(app.Todos, "change", this.resort);
			this.listenTo(app.Todos, "sort", this.addAll);
			
			app.Todos.fetch();
			this.sortByCompleted();
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
		
		createItemOnEnter: function(event) {
			if (event.keyCode == 13) {
				event.preventDefault();
				$(".addbutton button").click();
			}
		},
		
		sortByDueDate: function() {
			app.Todos.sortTodos('due_date');
			this.addAll();
		},
		
		sortByPriority: function() {
			app.Todos.sortTodos('priority');
			this.addAll();
		},
		
		sortByTitle: function() {
			app.Todos.sortTodos('title');
			this.addAll();
		},
		
		sortByCompleted: function() {
			app.Todos.sortTodos('completed');
			this.addAll();
		},
		
		resort: function() {
			app.Todos.sort();
		},
		
		addOne: function(todo) {
			var view = new app.TodoView({model: todo});
			$("#todotable tbody#todotbody").append(view.render().el);
		},
		
		addAll: function() {
			this.$("#todotable tbody#todotbody").html("");
			app.Todos.each(this.addOne, this);
		},
	});
	
	new app.AppView();
});