Puppets = function (systemList)
{
	this.Systems =
	{
		COMPONENTS : [],
		list : systemList,

		launchSystems : function()
		{
			var nbSystems = this.list.length;
			for(var element in Puppets.Entities.list)
			{
			    for(var i = 0; i < nbSystems; i++)
			    {
			       var system = window[this.list[i]];
			       this.callSystem(element, system.components, system.method); 
			    }
			}
		},
		callSystem : function(id, listOfComponents, method) 
		{
			var entity = Puppets.Entities.list[id];
			var components = this.COMPONENTS;
			for(var i = 0; i < listOfComponents.length; i++)
			{
				var component = listOfComponents[i];
				if(entity[component] === null || entity[component] === undefined || !Puppets.Components.list[component][entity[component]].enabled) 
				{
					this.COMPONENTS.length = 0;
					return;
				}

				components.push(Puppets.Components.list[component][entity[component]]);
			}
			components.push(entity);
			method.apply(null, components);
			this.COMPONENTS.length = 0;
		}
	}

	this.Entities =
	{
		list : {},
		collections : {},
		length : 0,

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
		createEntity : function(model, constructor, enabled, undefined)
		{
			var entity = {};
			var argument = {};
			var lengthComponents = model.components.length;
			for (var i = 0; i < lengthComponents; i++)
			{
				if(typeof model.components[i] === "object")
				{
					var component = Object.keys(model.components[i])[0];
					for (var o in model.components[i][component])
					{
						if(constructor[component][o] !== undefined && constructor[component][o] !== null)
							model.components[i][component][o] = constructor[component][o];
					}
					constructor[component][o] = model.components[i][component][o];
				}
				else
					var component = model.components[i];

				var id = Puppets.Components.addComponent(component, constructor[component], enabled);
				entity[component] = id;
				argument[component] = Puppets.Components.list[component][id];
			}
			id = this.length;
			this.list[id] = entity;
			this.length++;

			return this.list[id];
		},
		addComponent : function(entity, component, settings, enabled, undefined)
		{
			if(this.list[entity][component] === null || this.list[entity][component] === undefined)
			{
				var id = Puppets.Components.addComponent(component, settings, enabled);
				this.list[entity][component] = id;
			}

			return this.list[entity];
		},
		removeComponent : function(entity, component, settings, method, undefined)
		{
			if(this.list[entity][component] !== null && this.list[entity][component] !== undefined)
			{
				var id = this.list[entity][component];
				Puppets.Components.removeComponent(id, component);
				delete this.list[entity][component];
			}

			return this.list[entity];
		}
	}

	this.Components =
	{
		list : {},
		length : {},

		count : function(component)
		{
			var count = 0;
			for (var element in this.list[component]) 
			{
			    if (this.list[component].hasOwnProperty(element)) 
			       ++count;
		    }

		   return count;
		},
		addComponent : function(component, constructor, enabled)
		{
			if(this.list[component] === null || this.list[component] === undefined)
			{
				this.list[component] = {};
				this.length[component] = 0;
			}

			var id = this.length[component];
			if(constructor === null || constructor === undefined)
				this.list[component][id] = Function("datas", componentsModels[component])({});
			else
				this.list[component][id] = Function("datas", componentsModels[component])(constructor);

			if(enabled !== undefined)
				this.list[component][id].enabled = enabled;
			else
				this.list[component][id].enabled = true;

			this.length[component]++;

			return id;
		},
		removeComponent : function(id, component, undefined)
		{
			if(this.list[component][id] !== null && this.list[component][id] !== undefined)
			{
				delete this.list[component][id];
			}
		}
	}
	window.Puppets = this;
	return this;
}

Puppets.prototype.run = function()
{
	this.Systems.launchSystems();
}