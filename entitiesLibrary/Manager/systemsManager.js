var SystemManager =
{
	orderList : ["Kinematic", "RenderShape"],
	launchSystems : function()
	{
		var nbSystems = this.orderList.length;
		for(var element in Entities.list)
		{
		    for(var i = 0; i < nbSystems; i++)
		    {
		       var system = window[this.orderList[i]];
		       this.define(element, system.components, system.method, system.settings); 
		    }
		}
	},
	define : function(id, listOfComponents, method, settings) 
	{
		var entity = Entities.list[id];
		var components = [settings];
		for(var i = 0; i < listOfComponents.length; i++)
		{
			var component = listOfComponents[i];
			if(entity[component] === null || entity[component] === undefined) 
				return;

			components.push(Components.list[component][entity[component]]);
		}
		method.apply(null, components);
	}
}