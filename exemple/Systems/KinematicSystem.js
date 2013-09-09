;Puppets.system("Kinematic", function Kinematic (position2d, velocity2d)
	{
		var newPosition = Vectors.add(position2d, velocity2d); 
		position2d.x = newPosition.x;
		position2d.y = newPosition.y;
	}, {components : ["position2d", "velocity2d"]});