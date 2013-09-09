(function Module(undefined){
	//collections list
	Puppets.collection(["background"]);

	//entities models
	Puppets.entity("rect", {
		components : [{renderShape : {shape : "square"}}, "position2d", "size2d"]
	});

	//components models
	Puppets.component("position2d", function(data, entity, undefined)
	{
		return {x : data.x || 0, y : data.y || 0};
	});
	Puppets.component("size2d", function(data, entity, undefined)
	{
		return {width : data.width || 0, height : data.height || 0, radius : data.radius || 0};
	});
	Puppets.component("renderShape", function(data, entity, undefined)
	{
		return {color : data.color || 0, shape : data.shape || 0};
	});
	Puppets.component("renderTexture", function(data, entity, undefined)
	{
		return {image : data.image || null, layer : data.layer || 0};
	});
	Puppets.component("velocity2d", function(data, entity, undefined)
	{
		return {x : data.x || 0, y : data.y || 0};
	});

	//systems
	Puppets.system("Kinematic", function Kinematic (position2d, velocity2d)
	{
		var newPosition = Vectors.add(position2d, velocity2d); 
		position2d.x = newPosition.x;
		position2d.y = newPosition.y;
	}, {components : ["position2d", "velocity2d"]});
	Puppets.system("RenderShape", function RenderShape (renderShape, position2d, size2d)
	{
		var shape = renderShape.shape;
		var color = renderShape.color;
		context.fillStyle = color;
		if(shape == "square")
			context.fillRect(position2d.x, position2d.y, size2d.width, size2d.height);
		else if(shape == "circle")
			context.arc(position2d.x,position2d.y,size2d.radius, 0, 2*Math.PI);
	}, {components : ["renderShape", "position2d", "size2d"]});
})();