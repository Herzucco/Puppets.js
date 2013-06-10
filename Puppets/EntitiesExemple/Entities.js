var entitiesModels =
{
	"rect" :
	{
		"components" : ["renderShape", "position2d", "size2d"],
		instructions : function(entity, settings){
			entity.renderShape.color = settings.color;
			entity.renderShape.shape = settings.shape;
			entity.size2d.width = settings.size2d.width;
			entity.size2d.height = settings.size2d.height;
		}
	},
	"rect2" :
	{
		"components" : ["renderShape", "position2d", "size2d"],
		instructions : function(entity, settings){
			entity.renderShape.color = settings.color;
			entity.renderShape.shape = settings.shape;
			entity.size2d.width = settings.size2d.width;
			entity.size2d.height = settings.size2d.height;
			entity.position2d.x = settings.position2d.x;
			entity.position2d.y = settings.position2d.y;
		}
	}
}