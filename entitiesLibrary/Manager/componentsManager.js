var Components =
{
	"list" : {},
	"length" : {},

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
	addComponent : function(component)
	{
		if(this.list[component] === null || this.list[component] === undefined)
		{
			this.list[component] = {};
			this.length[component] = 0;
		}

		var id = this.length[component];
		console.log(id)
		this.list[component][id] = JSON.parse(JSON.stringify(componentsModels[component]));
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