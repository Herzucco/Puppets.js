var Puppets = function (config)
{
	this.ARRAY = [];
	this.Systems =
	{
		COMPONENTS : [],
		list : {},

		launchSystems : function()
		{
			var nbSystems = this.list.length;
			var nbCollections = Puppets.Entities.orderCollections.length;
			for(var puppy = 0; puppy < nbCollections; puppy+=1)
			{
				var collection = Puppets.Entities.orderCollections[puppy];
				for(var puppo = 0; puppo < Puppets.Entities.collections[collection].length; puppo+=1)
				{
					var id = Puppets.Entities.collections[collection][puppo];
				    for(var i = 0; i < nbSystems; i++)
				    {
				       var system = window[this.list[i]];
				       this.callSystem(id, system.components, system.method); 
				    }
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
		createEntity : function(model, constructor, collection)
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

				if(constructor[component] !== undefined && constructor[component] !== null)
					var id = Puppets.Components.addComponent(this.length, component, constructor[component], constructor[component].enabled);
				else
					var id = Puppets.Components.addComponent(this.length, component, constructor[component]);

				entity[component] = id;
				argument[component] = Puppets.Components.list[component][id];
			}
			id = this.length;
			this.list[id] = entity;
			if(this.collections[collection] !== undefined && this.collections[collection] !== null)
				this.collections[collection].push(""+id+"");
			else
				this.collections.world.push(""+id+"")
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
					var id = Puppets.Components.addComponent(entity, component, settings, enabled);
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
					{
						for(var puppo in this.collections)
						{
							if(this.collections[puppo].indexOf(e) > -1)
							{
								this.collections[puppo].splice(this.collections[puppo].indexOf(e), 1);
								break;
							}
						}
						delete this.list[e];
					}
				}
				return true;
			}
			else
			{
				if(this.list[entity] !== null && this.list[entity] !== undefined)
				{
					for(var puppo in this.collections)
					{
						if(this.collections[puppo].indexOf(e) > -1)
						{
							this.collections[puppo].splice(this.collections[puppo].indexOf(e), 1);
							break;
						}
					}
					return delete this.list[entity];
				}
			}
			
			return false;
		},
		switchCollection : function(entity, collection)
		{
			if(!Array.isArray(entity))
				entity = [entity];

			for(var puppy = 0; puppy < entity.length; puppy++)
			{
				if(typeof entity[puppy] == "number")
					var moveEntity = ""+entity[puppy]+"";
				else
					var moveEntity = entity[puppy];

				for(var puppo in this.collections)
				{
					if(this.collections[puppo].indexOf(moveEntity) > -1)
					{
						this.collections[puppo].splice(this.collections[puppo].indexOf(moveEntity), 1);
						this.collections[collection].push(moveEntity);
						break;
					}
				}
			}
		},
		copy : function(entity, number, collection)
		{
			entity = arrayzation(entity);
			var nb = entity.length;

			if(typeof puppo !== "number")
			{
				collection = number;
				number = 1
			}
			else if(collection === undefined || typeof collection !== "string")
				collection = "world";

			for(var puppy = 0; puppy < nb; puppy++)
			{
				var copy = entity[puppy];
				if(this.list[copy] !== undefined && this.list[copy] !== null)
				{
					for(var puppo = 0; puppo < number; puppo++)
					{
						this.list[this.list.length] = this.list[copy];
						
					}
				}
			}
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
	}
	var arrayzation = function(value)
	{
		if(!Array.isArray(value))
				return [value];
	}
	var computeSystems = function(self, list)
	{
		self.Systems.list = list;
	}
	var computeCollections = function(self, list)
	{
		self.Entities.orderCollections = list;
		for(var puppy = 0; puppy < list.length; puppy+=1)
			self.Entities.collections[list[puppy]] = [];

		if(list.indexOf("world") < 0)
		{
			self.Entities.collections["world"] = [];
			self.Entities.orderCollections.push("world");
		}
	} 
	var init = function(self)
	{
		window.Puppets = self;
		computeSystems(self, config.systemList);
		computeCollections(self, config.collectionList);
	}(this);
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
	{
		if(clue[puppy].slice(0, 1) == ".")
		{
			results.push(this.Entities.collections[clue[puppy].slice(1)])
			for(var puppo = 0; puppo < results[results.length-1].length; puppo++)
				results[results.length-1][puppo] = results[results.length-1][puppo];
		}
		else
			results.push(this.Entities.find(clue[puppy]));
	}

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

Puppets.prototype.removeEntity = function(entity)
{
	this.Entities.removeEntity(entity);
}
Puppets.prototype.removeComponent = function(entity, component)
{
	this.Entities.removeComponent(entity, component);
}
Puppets.prototype.addComponent = function(entity, component, settings, enabled, undefined)
{
	this.Entities.addComponent(entity, component, settings, enabled);
}
Puppets.prototype.createEntity = function(model, constructor, collection)
{
	this.Entities.createEntity(model, constructor, collection);
}
Puppets.prototype.getComponents = function(entity)
{
	this.Entities.getComponents(entity);
}
Puppets.prototype.switchCollection = function(entity, collection)
{
	this.Entities.switchCollection(entity, collection);
}
