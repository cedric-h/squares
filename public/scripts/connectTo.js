//tiny ease of use wrapper for WS.
//doesn't support removing listeners.
//that's a problem.
// -- Cedric Hutchings --

define(() => address =>
{
	// Create WebSocket connection.
	const server = new WebSocket(address);

	server.on = function(tag, listener)
	{
		this.addEventListener("message", (event) => 
		{
			let data = JSON.parse(event.data);
			if(data.tag === tag)
				listener(data.content);
		});
	}

	server.once = function(tag, listener)
	{
		this.addEventListener("message", function callOnce(event)
		{
			let data = JSON.parse(event.data);
			if(data.tag === tag)
			{
				listener(data.content);
				server.removeEventListener("message", callOnce);
			}
		});
	}

	server.emit = function(tag, content)
	{
		this.send(JSON.stringify({
			tag: tag,
			data: content
		}));
	}

	return server;
});