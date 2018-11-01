requirejs(["cedlib"], cedlib => {

	cedlib.connect("ws://localhost:8080");

	window.addEventListener("keydown", () => {
		
		cedlib.makeRect({
			mass: 	1,
			name: 	"name",
			size: 	[Math.random(), Math.random()]
		});

	});

});