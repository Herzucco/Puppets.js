var init = function()
{
	new Puppets(puppetsConfig);// instanciate our Puppets context, with the order list of our systems
	Puppets.load('entity', 'rect', 'entities/square.json');
	Puppets.load('component', 'position2d', 'components/position2d.json');
	Puppets.load('system', 'Kinematic', 'systems/kinematicsystem.js');
	Puppets.createEntity("rect",{ renderShape : {"color" : "white"}, size2d : {"width" : 50,"height" : 50}, position2d : {"x" : 400,"y" : 300}});// add a white square to render
	Puppets.createEntity("rect", { renderShape : {"color" : "black"}, size2d : {"width" : 800,"height" : 600}}, "background");// add a black background to render to the "background" collection
	Puppets.addComponent(0, "velocity2d", {"x":(Math.random()*2-Math.random()*2), "y":(Math.random()*2-Math.random()*2)})// add a velocitiy2d to the white square ==> he can move now !
	contextInitialization();
    update(context);
}

var contextInitialization = function()
{
	window.canvas = document.getElementById("canvas");
	window.context = canvas.getContext("2d");
	canvas.height = "600";
	canvas.width = "800";
}

var update = function()
{
    Puppets.run();
    requestAnimFrame(update);
}

init();