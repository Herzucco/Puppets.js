var Systems =
{
	COMPONENTS : [],
	orderList : [],

	launchSystems : function()
	{
		var nbSystems = this.orderList.length;
		for(var element in Entities.list)
		{
		    for(var i = 0; i < nbSystems; i++)
		    {
		       var system = window[this.orderList[i]];
		       this.callSystem(element, system.components, system.method, system.settings); 
		    }
		}
	},
	callSystem : function(id, listOfComponents, method, settings) 
	{
		var entity = Entities.list[id];
		var components = this.COMPONENTS;
		for(var i = 0; i < listOfComponents.length; i++)
		{
			var component = listOfComponents[i];
			if(entity[component] === null || entity[component] === undefined) 
			{
				this.COMPONENTS.length = 0;
				return;
			}

			components.push(Components.list[component][entity[component]]);
		}
		method.apply(null, components);
		this.COMPONENTS.length = 0;
	}
}