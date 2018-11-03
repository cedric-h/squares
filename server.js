const WebSocket = require('ws');
const Client = require("./client.js");
const p2 = require('p2');
const present = require('present');

//server
const wss = new WebSocket.Server({ port: 8080 });


//update rates
let clientsFps = 1 / (process.argv[3] || 20)
let physicsFps = 1 / (process.argv[4] || 60)


//physics set up
let world = new p2.World({
	gravity:[0, -9,82]
});

let groundBody = new p2.Body({mass: 0, position: [0, -1]});
groundBody.addShape(new p2.Box({width: 60, height: 1}));
world.addBody(groundBody);


//rectangle set up
let rectangleCount = 0;//number of rectangles ever made
let rectangles = [];

function Rectangle() {
	this.mass 		= 1;
	this.position 	= [0, 5];
	this.size 		= [0.4, 0.4];

	this.color 		= "pink";
	this.name 		= "ced";
}


//networking set up
let clients = [];

wss.on('connection', function connection(ws) {
	let client = new Client();
	client.initialize(ws);

	clients.push(client);

	client.send('connectionEstablished');

	rectangles.forEach(rect => {
		let noPhysicsRect = Object.assign({}, rect);
		delete noPhysicsRect.body;
		client.send('newRect', noPhysicsRect);
	});

	client.on('makeRect', data => {
		let rectangleParameters = data.data;
		let rectangle = Object.assign(new Rectangle(), rectangleParameters);

		rectangleCount++;
		rectangle.uuid = rectangleCount;

		clients.forEach(client =>
			client.send('newRect', rectangle)
		);

		//physics that rectangle
		rectangle.body = new p2.Body({
			mass: rectangle.mass,
			position: rectangle.position,
			velocity: rectangle.velocity
		});
		rectangle.body.addShape(new p2.Box({
			width: 	rectangle.size[0],
			height: rectangle.size[1]
		}));
		world.addBody(rectangle.body);

		rectangles.push(rectangle);

		client.send('rectMade' + data.count, rectangleCount);
	});

	client.on('set', data => {
		let target = rectangles.filter(rectangle => rectangle.uuid === data.uuid)[0];
		target.body[data.whatToSet] = data.whatToSetTo;
	});
});


//physics loop
let lastTime = present() / 1000;
setInterval(
	() => {
		let time = present() / 1000;
		world.step(physicsFps, time - lastTime, 10);
		lastTime = time;
	},
	physicsFps * 1000
);

setInterval(
	() => {
		let rectanglesUpdateData = rectangles.map(rectangle => {

			return {
				position: rectangle.body.interpolatedPosition,
				angle: rectangle.body.interpolatedAngle
			};
		});

		clients.forEach(client => {
			client.send('orientationsUpdate', rectanglesUpdateData);
		});
	},
	clientsFps * 1000
);