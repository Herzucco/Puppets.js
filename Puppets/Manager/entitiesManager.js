var Entities =
{
	"list" : {},
	"collections" : {},
	"length" : 0,

	hasComponent : function(entity, component, undefined)
	{
		if(entity[component] !== undefined && entity[component] !== null)
			return true;

		return false
	},

	count : function()
	{
		var count = 0;
		for (var entity in this.list) 
		{
		    if (this.list.hasOwnProperty(entity)) 
		       ++count;
	    }

	   return count;
	},
	createEntity : function(model, constructor, undefined)
	{
		var entity = {};
		var argument = {};
		for (var i = 0; i < model.components.length; i++)
		{
			var component = model.components[i];
			var id = Components.addComponent(component);
			entity[component] = id;
			argument[component] = Components.list[component][id];
		}
		id = this.length;
		this.list[id] = entity;
		this.length++;
		model.instructions(argument, constructor);

		return this.list[id];
	},
	addComponent : function(entity, component, settings, method, undefined)
	{
		if(this.list[entity][component] === null || this.list[entity][component] === undefined)
		{
			var id = Components.addComponent(component);
			this.list[entity][component] = id;
			if(settings !== null && method !== null)
				method(Components.list[component][id], settings);
		}

		return this.list[entity];
	},
	removeComponent : function(entity, component, settings, method, undefined)
	{
		if(this.list[entity][component] !== null && this.list[entity][component] !== undefined)
		{
			var id = this.list[entity][component];
			Components.removeComponent(id, component);
			delete this.list[entity][component];
		}

		return this.list[entity];
	}
}