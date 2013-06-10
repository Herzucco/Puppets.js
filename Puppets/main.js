var init = function()
{
	contextInitialization();
    update(context);
}

var contextInitialization = function()
{
	window.canvas = document.getElementById("canvas");
	window.context = canvas.getContext("2d");
	canvas.width = "800";
	canvas.height = "600";
}

var update = function()
{
    Puppets.run();
    requestAnimFrame(update);
}
new Puppets(["Kinematic", "RenderShape"]);
Puppets.Entities.createEntity(entitiesModels["rect"], {"shape" : "square","color" : "black","size2d" : {"width" : 800,"height" : 600}});
Puppets.Entities.createEntity(entitiesModels["rect2"], {"shape" : "square","color" : "white","size2d" : {"width" : 50,"height" : 50},"position2d" : {"x" : 400,"y" : 300}});
Puppets.Entities.addComponent(1, "velocity2d", {"x":(Math.random()*2-Math.random()*2), "y":(Math.random()*2-Math.random()*2)}, function(velocity2d, settings){velocity2d.x = settings.x; velocity2d.y = settings.y;})

init();