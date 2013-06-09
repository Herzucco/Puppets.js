var RenderShape = 
{
	components : ["renderShape", "position2d", "size2d"],
	settings : {

	},
	method : function(settings, renderShape, position2d, size2d)
	{
		var shape = renderShape.shape;
		var color = renderShape.color;
		context.fillStyle = color;
		if(shape == "square")
			context.fillRect(position2d.x, position2d.y, size2d.width, size2d.height);
		else if(shape == "circle")
			context.arc(position2d.x,position2d.y,size2d.radius, 0, 2*Math.PI);
	}
}
