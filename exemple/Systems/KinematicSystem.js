var Kinematic = 
{
	components : ["position2d", "velocity2d"],
	method : function(position2d, velocity2d)
	{
		var newPosition = Vectors.add(position2d, velocity2d); 
		position2d.x = newPosition.x;
		position2d.y = newPosition.y;
	}
}