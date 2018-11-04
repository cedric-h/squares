requirejs(["cedlib"], cedlib => {

    //This is the IP
    cedlib.connect("ws://localhost:8080");

    //list of types
    let troops = [

    	{
    		positions: [
                [-1.50, 0],
                [-1.25, 0],
                [-1.00, 0],
                [-0.75, 0],
                [-0.50, 0],
                [-0.25, 0],
                [ 0.00, 0],
                [ 0.25, 0],
                [ 0.50, 0],
                [ 0.75, 0],
                [ 1.00, 0],
                [ 1.25, 0],
                [ 1.50, 0],
            ],
    		config: {
    			name: "civilian",
	    		color: "blue",
	            mass: 0.001,
	            size: [0.2, 0.6]
	        }
    	},

    	{
    		positions: [
                [-3.0, 0],
                [ 6.0, 0]
            ],
    		config: {
    			name: "House",
	            color: "crimson",
	            mass: 0.5,
	            size: [1.3, 0.75]
	        }
    	},

        {
            positions: [
                [-3.25, 0.57]
            ],
            config: {
                name: "Gerald",
                color: "cyan",
                mass: 0,
                size: [0.215, 0.6],
                velocity: [0, .2],
                angularVelocity: 2
            }
        }

    ];
    

    //actually make all of those troops.
    troops.forEach(troopType => {

    	troopType.positions.forEach( (position) => {

            //this crazy magic makes a copy of the troopConfig,
            let thisTroopsConfig = JSON.parse(JSON.stringify(troopType.config));
            //then we change the position of that config,
            thisTroopsConfig.position = position;

            //then make the square there, by using the config we copied then changed.
            cedlib.makeRect(thisTroopsConfig);

        });
    	
    });

    //this makes the missiles work
    window.addEventListener("mousedown", (event) => {

        cedlib.makeRect({
            position: cedlib.getPhysicsCoords(event),
            name: "missle",
            size: [0.2, 0.2],
            color: "lightgrey"

        }).then( (rect) => {

            rect.set("velocity", [1 - Math.random()*2, Math.random()*-4]);

        });
    })
});