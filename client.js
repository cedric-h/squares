const EventEmitter = require('events');

module.exports = class Client extends EventEmitter
{
    constructor(entity, ws)
    {
        super();
    }

    initialize(ws)
    {
    	this.ws = ws;

        //error handling
        this.ws.on('error', error =>
        {
            console.log('ws Error!');
            console.log(error.code);
            console.error(error);
        });

        //emit messages from the websocket after processing them.
        this.ws.on('message', (messageJSON) =>
        {
            let message = JSON.parse(messageJSON);
            this.emit(message.tag, message.data);
        });
    }

    send(tag, data)
    {
        if(this.ws.readyState === 1)
            this.ws.send(JSON.stringify({
                tag: tag,
                content: data
            }));
    }
}