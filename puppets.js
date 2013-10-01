var Puppets = function (config)
{
	this.ARRAY = [];
	this.Systems =
	{
		COMPONENTS : [],
		order : [],
		list : {},
		runs : 0,

		launchSystems : function()
		{
			var nbCollections = Puppets.Entities.orderCollections.length;
            var puppy, puppo, i;
            var system, id;
            var orderLength = this.order.length;
            
			for(puppy = 0; puppy < nbCollections; puppy+=1)
			{
				var collection = Puppets.Entities.orderCollections[puppy];
				for(puppo in Puppets.Entities.collections[collection])
				{
					id = Puppets.Entities.collections[collection][puppo];
				    for(i = 0; i < orderLength; i++)
				    {
				       system = this.list[this.order[i]];
				       if(system !== undefined && (system.delay === undefined || system.delay === null || this.runs % system.delay == 0))
				     	  this.callSystem(id, system.components, system.method, system.data); 
				    }
				}
			}
			this.runs++;
		},
		callSystem : function(id, listOfComponents, method, data) 
		{
			var entity = Puppets.Entities.list[id];
			var components = this.COMPONENTS;
            var i;
            var component;
			if(entity !== null && entity !== undefined)
			{
				for(i = 0; i < listOfComponents.length; i++)
				{
					component = listOfComponents[i];
					if(entity[component] === null || entity[component] === undefined ||
					 Puppets.Components.list=== null || Puppets.Components.list === undefined ||
					 !Puppets.Components.list[component][entity[component]].enabled) 
					{
						this.COMPONENTS.length = 0;
						return;
					}

					components.push(Puppets.Components.list[component][entity[component]]);
				}
				components.push(id);
				method.apply(data, components);
				this.COMPONENTS.length = 0;
			}
		},
		load : function(name, method, data)
		{
			if(this.list[name] !== undefined && this.list[name] !== null)
				console.warn("Name "+name+" overrided by system "+method);
			if(data === undefined)
			{
				throw console.error("data argument can not be undefined");
				return false;
			}

			this.list[name] = { components : data.components, method : method , delay : data.delay, data : data};

			var indexSystem = this.order.indexOf(name);
			if(indexSystem >= 0)
				this.order.splice(indexSystem, 1);

			if(typeof(data.position) === 'number')
				this.order.splice(data.position, 0, name);
			else
				this.order.push(name);

			return true;
		}
	}

	this.Entities =
	{
		models : {},
		list : {},
		collections : {},
		orderCollections : [],
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
			if(this.models[model] === undefined)
			{
				console.warn("Entity "+model+" doesn't exist in Puppet, you have to load it");
				return false;
			}
			model = this.models[model];
			var entity = {};
			var argument = {};
			var lengthComponents = model.components.length;
            var i, o, id;
			for (i = 0; i < lengthComponents; i++)
			{
				if(typeof model.components[i] === "object")
				{
					var component = Object.keys(model.components[i])[0];
					if(typeof(constructor[component]) !== 'object')
						constructor[component] = {};

					for (o in model.components[i][component])
					{
						if(constructor[component][o] !== undefined && constructor[component][o] !== null)
							model.components[i][component][o] = constructor[component][o];
					}
					constructor[component][o] = model.components[i][component][o];
				}
				else
					var component = model.components[i];

				if(constructor[component] !== undefined && constructor[component] !== null)
					id = Puppets.Components.addComponent(this.length, component, constructor[component], constructor[component].enabled);
				else
					id = Puppets.Components.addComponent(this.length, component, constructor[component]);

				entity[component] = id;
				argument[component] = Puppets.Components.list[component][id];
			}
			id = this.length;
			this.list[id] = entity;
			if(this.collections[collection] !== undefined && this.collections[collection] !== null)
				this.collections[collection][id] = ""+id+"";
			else
				this.collections["world"][id] = ""+id+"";
			this.length++;

			return this.length-1;
		},
		addComponent : function(entity, component, settings, enabled, undefined)
		{
			if(!Array.isArray(entity))
				entity = [entity];
            
            var id;
            
			for(var puppy = 0; puppy < entity.length; puppy++)
			{
				if(!this.list[entity[puppy]].hasOwnProperty(component))
				{
					id = Puppets.Components.addComponent(entity[puppy], component, settings, enabled);
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
            
            var id;
            
			for(var puppy = 0; puppy < entity.length; puppy++)
			{
				if(this.list[entity[puppy]].hasOwnProperty(component))
				{
					id = this.list[entity[puppy]][component];
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

			if(!Array.isArray(entity))
				entity = [entity];

			var nb = entity.length;
            var puppy;
            var e, puppo;
            
			for(puppy = 0; puppy < nb; puppy++)
			{
				e = entity[puppy];
				if(this.list[e] !== null && this.list[e] !== undefined)
				{
					for(puppo in this.collections)
					{
						if(this.collections[puppo][e] !== null && this.collections[puppo][e] !== undefined)
						{
							delete this.collections[puppo][e];
							break;
						}
					}
					delete this.list[e];
				}
			}
		},
		switchCollection : function(entity, collection)
		{
			if(this.collections[collections] !== null && this.collections[collections] !== undefined)
			{
				if(!Array.isArray(entity))
				entity = [entity];
                
                var puppy;
                var moveEntity, puppo;
                
				for(puppy = 0; puppy < entity.length; puppy++)
				{
					if(typeof entity[puppy] == "number")
						moveEntity = ""+entity[puppy]+"";
					else
						moveEntity = entity[puppy];

					for(puppo in this.collections)
					{
						if(this.collections[puppo].indexOf(moveEntity) > -1)
						{
							delete this.collections[puppo][moveEntity];
							this.collections[collection][moveEntity] = moveEntity;
							break;
						}
					}
				}
				return true;
			}

			return false;
		},
		copy : function(entity, number, collection)
		{
			entity = arrayzation(entity);
			var nb = entity.length;

			if(typeof number !== "number")
			{
				collection = number;
				number = 1;
			}
			else if(collection === undefined || typeof collection !== "string")
				collection = "world";

			for(var puppy = 0; puppy < nb; puppy++)
			{
				var copy = entity[puppy];
                var puppo, puppa;
                var newCopy, constructor;
                
				if(this.list[copy] !== undefined && this.list[copy] !== null)
				{
					for(puppo = 0; puppo < number; puppo++)
					{
						newCopy = JSON.parse(JSON.stringify(this.list[copy]));
						for(puppa in newCopy)
						{
							constructor = Puppets.Components.list[puppa][newCopy[puppa]];
							newCopy[puppa] = Puppets.Components.addComponent(copy, puppa, constructor);
						}
						this.list[this.length] = newCopy;
						this.length++;
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

			var object = {};
            var puppy, puppo;
            var refComp, result;
            
			for(puppy = 0; puppy < entity.length; puppy++)
			{
				result = {};
				refComp = this.list[entity[puppy]];

				if(refComp !== undefined && refComp !== null)
				{
					for(puppo in refComp)
						result[puppo] = Puppets.Components.list[puppo][refComp[puppo]];

					object[puppy] = result;
				}
			}

			return object;
		},
		merge : function(createNew, params)
		{
			if(arguments.length < 4)
				return false;

			if(params === undefined || params === null)
				params = {};

			var entitiesToMerge = [];
            var puppy, puppo;
            
			for(puppy = 2; puppy < arguments.length; puppy++)
			{
				if(Array.isArray(arguments[puppy]))
				{
					for(puppo = 0; puppo < arguments[puppy].length; puppo++)
					{
						if(typeof arguments[puppy][puppo] == "string" || typeof arguments[puppy][puppo] == "number")
							entitiesToMerge.push(arguments[puppy][puppo]);
					}
				}
				else if(typeof arguments[puppy] == "string" || typeof arguments[puppy] == "number")
					entitiesToMerge.push(arguments[puppy]);
			}
			entitiesToMerge = this.getComponents(entitiesToMerge);

		},
		load : function(name, constructor)
		{
			if(this.models[name] !== undefined && this.models[name] !== null)
				console.warn("Name "+name+" overrided by entity "+constructor);

			this.models[name] = {components : constructor.components, data : constructor.data };
			return true;
		},
	}

	this.Components =
	{
		models : {},
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
			this.list[component][id] = this.models[component].constructor(constructor || {}, entity);

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
		load : function(name, constructor, data)
		{
			if(this.models[name] !== undefined && this.models[name] !== null)
				console.warn("Name "+name+" overrided by component "+ constructor);

			this.models[name] = {constructor : constructor, data : data };
			return true;
		},
	}
	var arrayzation = function(value)
	{
		if(!Array.isArray(value))
				return [value];
	}

	var init = function(self)
	{
		window.Puppets = self;
		if(typeof(config) === "string")
			self.load(config);

		if(self.Entities.orderCollections.indexOf("world") < 0)
		{
			self.Entities.collections["world"] = {};
			self.Entities.orderCollections.push("world");
		}
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
	if(aplane === undefined)
		aplane = true;
	
	clue = clue.split(',');

	var nb = clue.length;
    var puppy, puppo;
    
	for(puppy = 0; puppy < nb; puppy++)
	{
		if(clue[puppy].slice(0, 1) == ".")
		{
			results.push(this.Entities.collections[clue[puppy].slice(1)]);
			var tmp = [];
			for(puppo in results[results.length-1])
				tmp.push(results[results.length-1][puppo]);

			results[results.length-1] = tmp;
		}
		else
			results.push(this.Entities.find(clue[puppy]));
	}

	if(aplane)
	{
		var tmp = [];
        var array;
        
		for(puppy = 0; puppy < results.length; puppy++)
		{
			array = results[puppy];
			for(puppo = 0; puppo < array.length; puppo++)
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
	return this.Entities.removeEntity(entity);
}
Puppets.prototype.removeComponent = function(entity, component)
{
	return this.Entities.removeComponent(entity, component);
}
Puppets.prototype.addComponent = function(entity, component, settings, enabled, undefined)
{
	return this.Entities.addComponent(entity, component, settings, enabled);
}
Puppets.prototype.createEntity = function(model, constructor, collection)
{
	return this.Entities.createEntity(model, constructor, collection);
}
Puppets.prototype.getComponents = function(entity)
{
	return this.Entities.getComponents(entity);
}
Puppets.prototype.switchCollection = function(entity, collection)
{
	return this.Entities.switchCollection(entity, collection);
}
Puppets.prototype.copy = function(entity, number, collection)
{
	return this.Entities.copy(entity, number, collection);
}
Puppets.prototype.load = function(file, success, error)
{
	var request =new XMLHttpRequest();
	request.open("GET", file, false);
	request.send();
	if(request.response === "")
	{
		if(typeof(error) === 'function')
			error(request.response);

		throw console.warn("An error occured loading "+file);
		return false;
	}
	if(typeof(success) === "function")
		success(request.response);

	var module = document.createElement('script');
	module.innerHTML = request.response;
	document.body.appendChild(module);
	document.body.removeChild(module);
}
Puppets.prototype.entity = function(name, data){
	return this.Entities.load(name, data);
}
Puppets.prototype.component = function(name, method, data){
	return this.Components.load(name, method, data);
}
Puppets.prototype.system = function(name, method, data){
	return this.Systems.load(name, method, data);
}
Puppets.prototype.collection = function(collection, position){
	if(Array.isArray(collection))
	{
		this.Entities.orderCollections = collection;
		for(var puppy = 0; puppy < collection.length; puppy+=1)
			this.Entities.collections[collection[puppy]] = {};

		console.warn("Set new collection list : "+collection);
		return true;
	}
	else if(typeof(collection) === "string")
	{
		var indexCollection = this.Entities.orderCollections.indexOf(collection);

		if(indexCollection >= 0)
			this.Entities.orderCollections.splice(indexCollection, 1);

		if(typeof(position) !== "number")
		{
			this.Entities.orderCollections.push(collection);

			if(this.Entities.collections[collection] !== undefined)
				console.warn("Collection "+collection+" overrided");
		}
		else
			this.Entities.orderCollections.splice(position, 0, collection);

		this.Entities.collections[collection] = {};
		return true;
	}
	else
	{
		console.warn("Can not set collection : "+collection);
		return false;
	}
}
Puppets.prototype.systemList = function(list)
{
	if(Array.isArray(list))
		this.Systems.order = list

	return this.Systems.order;
}
