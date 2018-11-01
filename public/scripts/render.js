define(() =>
{
	//set up canvas and context
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;


	//rendering helpers
	function drawRectangle(rect)
	{
		ctx.save();

        ctx.translate(rect.position[0], rect.position[1]);
        ctx.rotate(rect.angle);
        ctx.fillRect(-rect.size[0]/2, -rect.size[1]/2, rect.size[0], rect.size[1]);

        ctx.restore();
	}


	//render
	return function(rectangles)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
        ctx.translate(canvas.width/2, canvas.height - 50);
        ctx.scale(50, -50);

		rectangles.forEach(rect =>
		{
			ctx.fillStyle = rect.color;
			drawRectangle(rect);
		});

		let textScale = 0.03;
		ctx.scale(textScale, -textScale);
		rectangles.forEach(rect =>
		{
			if(rect.name)
			{
				ctx.fillStyle = "black";
				ctx.fontStyle = "40px serif";

				let textAngle = rect.angle - Math.PI/2;

				ctx.fillText(
					rect.name,
					Math.floor((rect.position[0])/textScale),
					(rect.position[1] + Math.max(rect.size[0], rect.size[1])/2)/-textScale
				);
			}
		});

		ctx.restore();
	}
});