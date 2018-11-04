define(["render", "connectTo"], (render, connectTo) =>
{
	let server;
	let rectangles = [];
	let rectangleCount = 0;//number of rectangles this client has made.

	//for getPhysicsCoord
	let canvas = document.getElementById('canvas');

	//watch out! the renderer doesn't actually use this.
	let camera = [canvas.width/2, canvas.height - 50];

	function onServerConnect()
	{
		//manage rectangles
		server.on('orientationsUpdate', newRectangles =>
			rectangles.forEach((rectangle, index) =>
				Object.assign(rectangle, newRectangles[index])
			)
		);

		server.on('newRect', rect =>
			rectangles.push(rect)
		);
	}

	requestAnimationFrame(function update()
	{
		requestAnimationFrame(update);

		render(rectangles, cedlib.colors);
	});


	let cedlib = {
		colors: {},
		connect: address =>
		{
			server = connectTo(address);

			return new Promise(resolve =>
				server.once('connectionEstablished', () =>
				{
					onServerConnect();
					resolve();
				})
			);
		},
		makeRect: async rect =>
		{
			if(server.readyState !== 1)
				await new Promise(resolve => server.once('connectionEstablished', () => resolve()));

			rect = Object.assign({
				position: [0, 5],

				color: "rgb(" + Math.random()*255 + ", " + Math.random()*255 + ", " + Math.random()*255 + ")",

				name: "name",

				size: [0.4, 0.4],

				set: function(whatToSet, whatToSetTo)
				{
					console.log(this.uuid);
					server.emit('set', {
						uuid: this.uuid,
						whatToSet: whatToSet,
						whatToSetTo: whatToSetTo
					});
				}
			}, rect || {});

			server.emit('makeRect', {
				data: rect,
				count: ++rectangleCount
			});

			return new Promise(resolve =>
			{
				server.once('rectMade' + rectangleCount, uuid =>
				{
					//assume server has already told us about the rectangle we requested by now,
					//so it's in the array. we want to grab it, add the .set function to it, and return it.
					let rectangleInRenderArray = rectangles.filter(rectangle => rectangle.uuid === uuid)[0];
					rectangleInRenderArray = Object.assign(rectangleInRenderArray, rect);
					resolve(rectangleInRenderArray);
				});
			});
		},
		getPhysicsCoords: (event) =>
        {
            var rect = canvas.getBoundingClientRect();

            return [
              (event.clientX - rect.left - camera[0]) /  50,
              (event.clientY - rect.top  - camera[1]) / -50
            ]
        },
        setVecLength: (vec, length) =>
        {
        	return p2.vec2.multiply(
        		[],
        		p2.vec2.normalize(
        			[],
        			vec
        		),
        		[length, length]
        	);
        }
	};

	let skies = [
		"mediumturquoise",
		"paleturquoise",
		"deepskyblue",
		"aliceblue",
		"lightcyan",
		"#20b2aa"
	];

	let grounds = [
		"goldenrod",
		"lime",
		"gray",
		"springgreen",
		"khaki",
		"rosybrown",
		"mediumseagreen", 
		"limegreen",
		"chartreuse",
		"darkslategray",
	]

	cedlib.colors.sky = skies[Math.floor(Math.random() * skies.length)];
	cedlib.colors.ground = grounds[Math.floor(Math.random() * grounds.length)];

	return cedlib;
});