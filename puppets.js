Puppets = function (systemList)
{
	this.ARRAY = [];
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
			if(entity !== null && entity !== undefined)
			{
				for(var i = 0; i < listOfComponents.length; i++)
				{
					var component = listOfComponents[i];
					if(entity[component] === null || entity[component] === undefined ||
					 Puppets.Components.list=== null || Puppets.Components.list === undefined ||
					  !Puppets.Components.list[component][entity[component]].enabled) 
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

				var id = Puppets.Components.addComponent(this.length, component, constructor[component], enabled);
				entity[component] = id;
				argument[component] = Puppets.Components.list[component][id];
			}
			id = this.length;
			this.list[id] = entity;
			this.length++;

			return this.length-1;
		},
		addComponent : function(entity, component, settings, enabled, undefined)
		{
			if(!Array.isArray(entity))
				entity = [entity];

			for(var puppy = 0; puppy < entity.length; puppy++)
			{
				if(!this.list[entity[puppy]].hasOwnProperty(component))
				{
					var id = Puppets.Components.addComponent(component, settings, enabled);
					this.list[entity[puppy]][component] = id;
				}
				else
					return false;
			}

			return true;
		},
		removeComponent : function(entity, component, undefined)
		{
			if(!Array.isArray(entity))
				entity = [entity];

			for(var puppy = 0; puppy < entity.length; puppy++)
			{
				if(this.list[entity[puppy]].hasOwnProperty(component))
				{
					var id = this.list[entity[puppy]][component];
					Puppets.Components.removeComponent(id, component);
					delete this.list[entity[puppy]][component];
				}
				else
					return false;
			}

			return true;
		},
		removeEntity : function(entity)
		{
			if(typeof entity == "string")
				entity = entity.split('.');

			if(Array.isArray(entity))
			{
				var nb = entity.length;
				for(var puppy = 0; puppy < nb; puppy++)
				{
					var e = entity[puppy];
					if(this.list[e] !== null && this.list[e] !== undefined)
						delete this.list[e];
				}
				return true;
			}
			else
			{
				if(this.list[entity] !== null && this.list[entity] !== undefined)
					return delete this.list[entity];
			}
			
			return false;
		},
		find : function(clue)
		{
			clue = this._analyseString(clue);
			var list = this.list;
			var results = [];
			if(typeof clue == "object")
			{
				for(var puppy in list)
				{
					if(list[puppy].hasOwnProperty(clue["clue"]) && Function("object", clue["compare"])(Puppets.Components.list[clue["clue"]][list[puppy][clue["clue"]]]))
						results.push(puppy);	
				}	
			}
			else
				for(var puppy in list)
				{
					if(list[puppy].hasOwnProperty(clue))
						results.push(puppy);
				}

			return results;
		},

		_analyseString : function(clue)
		{
			clue = clue.split(" ");
			if(clue.length <= 1)
				return clue[0];

			return {clue : clue[0], compare : "if(object."+clue[1]+"){return true;}else{return false}"};
		},

		getComponents : function(entity)
		{
			if(!Array.isArray(entity))
				entity = [entity];

			var array = [];
			for(var puppy = 0; puppy < entity.length; puppy++)
			{
				var result = {};
				var refComp = this.list[entity[puppy]];

				if(refComp !== undefined && refComp !== null)
				{
					for(var puppo in refComp)
						result[puppo] = Puppets.Components.list[puppo][refComp[puppo]];

					array.push(result);
				}
			}

			return array;
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
		addComponent : function(entity, component, constructor, enabled)
		{
			if(this.list[component] === null || this.list[component] === undefined)
			{
				this.list[component] = {};
				this.length[component] = 0;
			}

			var id = this.length[component];
			if(constructor === null || constructor === undefined)
				this.list[component][id] = Function("datas", "entity", componentsModels[component])({}, entity);
			else
				this.list[component][id] = Function("datas", "entity", componentsModels[component])(constructor, entity);

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
		},
		find : function(clue)
		{

		}
	}
	window.Puppets = this;
	return this;
}

Puppets.prototype.run = function()
{
	this.Systems.launchSystems();
}

Puppets.prototype.find = function(clue, aplane)
{
	var results = [];

	if(!Array.isArray(clue))
		clue = [clue];

	var nb = clue.length;
	for(var puppy = 0; puppy < nb; puppy++)
		results.push(this.Entities.find(clue[puppy]));

	if(aplane)
	{
		var tmp = [];
		for(var puppy = 0; puppy < results.length; puppy++)
		{
			var array = results[puppy];
			for(var puppo = 0; puppo < array.length; puppo++)
			{
				if(tmp.indexOf(array[puppo]) < 0)
					tmp.push(array[puppo]);
			}
		}
		results = tmp;
	}

	return results;
}