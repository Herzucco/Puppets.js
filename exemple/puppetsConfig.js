var puppetsConfig =
{
	systemList : {
		RenderShape : {
			components : ["renderShape", "position2d", "size2d"],
			method : function(renderShape, position2d, size2d)
			{
				var shape = renderShape.shape;
				var color = renderShape.color;
				context.fillStyle = color;
				if(shape == "square")
					context.fillRect(position2d.x, position2d.y, size2d.width, size2d.height);
				else if(shape == "circle")
					context.arc(position2d.x,position2d.y,size2d.radius, 0, 2*Math.PI);
			},
		},
	},
	componentList : 
	{
	    size2d : "return {width : datas.width || 0, height : datas.height || 0, radius : datas.radius || 0};",
	    renderShape : "return {color : datas.color || 0, shape : datas.shape || 0};",
	    renderTexture : "return {image : datas.image || null, layer : datas.layer || 0};",
	    velocity2d : "return {x : datas.x || 0, y : datas.y || 0};"
	},
	collectionList : ["background"]
};