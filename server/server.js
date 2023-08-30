const mongoose = require("./database");
const Document = require("./Document");
const http = require('http');

const port = process.env.API_PORT;
const defaultValue = "";


//Init Socket Server
const io = require('socket.io')(process.env.SOCKET_PORT, {
    cors: {
        origin: [process.env.CLIENT_URL],
        methods: ['GET', 'POST']

    }
});

console.warn("Socket Running on port =>", process.env.SOCKET_PORT);


//Socket Events
io.on("connection", socket => {

    console.warn("Connection Success Socket.io Server");

    //Socket to load/create doc data
    socket.on("get-document", async documentId => {
        console.warn("get-document called");

        const document = await findOrCreateDocument(documentId);

        //Putting the user in the room socket
        socket.join(documentId)

        //Sending the Latest data
        socket.emit("load-document", document.data)

        //To boradcast that there has been some changes to everyone except users
        socket.on("send-changes", delta => {
            
            console.log("changes from client delta =>", delta);

            //All the users get the latest changes
            socket.broadcast.to(documentId).emit("receive-changes", delta);

        })

        //To save data
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })

    })
})


//Func To Handle Doc CRUD Opertaion
async function findOrCreateDocument(id) {
    if (id == null) return;

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })

}


//HTTP Server
const server = http.createServer(async (req, res) => {

    if (req.method === 'GET' && req.url === '/api/documents') {

        try {
            // Setting CORS headers
            // Replace '*' with your frontend URL
            res.setHeader('Access-Control-Allow-Origin', '*');

            // const allowedOrigins = [process.env.CLIENT_URL];
            // const origin = req.headers.origin;
            // if (allowedOrigins.includes(origin)) {
            //      res.setHeader('Access-Control-Allow-Origin', origin);
            // }
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            const data = await Document.find({}, { projection: { data: 0 } });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        catch (error) {
            console.log("Error in /api/documents");
            res.end(JSON.stringify({ error }));

        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});



// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})