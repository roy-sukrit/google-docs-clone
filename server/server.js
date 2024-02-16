const mongoose = require("./database");
const Document = require("./Document");
const http = require('http');

const port = process.env.API_PORT;
const defaultValue = "";
const apiRouter = require('./routes/api.router');


//Init Socket Server
const io = require('socket.io')(process.env.SOCKET_PORT, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']

    }
});

console.warn("Socket Running on port =>", process.env.SOCKET_PORT);


//Socket Events
io.on("connection", socket => {

    console.warn("Connection Success Socket.io Server");

    //Socket to load/create doc data
    socket.on("get-document", async ({documentId,email}) => {
        console.warn("get-document called");
        console.warn("get-document called",documentId,email);


        const document = await findOrCreateDocument(documentId,email);

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
        socket.on("save-document", async ({data,email}) => {
            console.warn("save-documen called",data,email);

            await Document.findByIdAndUpdate(documentId, { data,email })
        })

    })
})


//Func To Handle Doc CRUD Opertaion
async function findOrCreateDocument(id,email) {
    if (id == null) return;

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue,email })

}


// //HTTP Server
// const server = http.createServer(async (req, res) => {
//     // Set CORS headers
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your React app's domain
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add the HTTP methods you want to support
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add the headers you want to support
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); // If your requests use credentials (cookies, etc.)

//     console.log("req.url", req.url);
//     if (req.method === 'OPTIONS') {
//         console.log("options");
//         // Handle preflight requests
//         res.writeHead(200);
//         res.end();
//         return;
//     }

//     if (req.method === 'GET' && req.url === '/api/documents') {

//         try {


//             const data = await Document.find({email:'public'}, { projection: { data: 0 } })
//                 .sort({ updatedAt: -1 });
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(data));
//         }
//         catch (error) {
//             console.log("Error in /api/documents");
//             res.end(JSON.stringify({ error }));

//         }

//     }
//     // else if (req.method === 'PUT' && req.url === '/api/documents') {


//     //     try{
//     //     let body = '';
//     //     req.on('data', chunk => {
//     //         body += chunk.toString(); // convert Buffer to string
//     //     });
//     //     req.on('end', async () => {
//     //         body = JSON.parse(body)
//     //         console.log("req PUT",body.id);
//     //         // const output = await Document.findByIdAndDelete(body.id);


//     //     console.log("output",output);



//     //     // if(output){



//     //     // res.end(JSON.stringify('Success'));
//     //     // }

//     //     });


//     // }
//     // catch (error) {
//     //     console.log("Error in /api/delete",error);
//     //     res.end(JSON.stringify({ error }));

//     // }

//     // } 
//     else if (req.method === 'POST' && req.url === '/api/delete') {

//         try {

//             let body = '';
//             req.on('data', chunk => {
//                 body += chunk.toString(); // convert Buffer to string
//             });
//             req.on('end', async () => {
//                 body = JSON.parse(body)
//                 console.log("req delete", body.id);
//                 const output = await Document.findByIdAndDelete(body.id);


//                 console.log("output", output);



//                 if (output) {


//                     res.writeHead(200, { 'Content-Type': 'application/json' });

//                     res.end(JSON.stringify('Success'));
//                 }

//             });


//         }
//         catch (error) {
//             console.log("Error in /api/delete", error);
//             res.end(JSON.stringify({ error }));

//         }


//     }

//     else if (req.method === 'POST' && req.url === '/api/userDocuments') {

//         try {

//             let body = '';
//             req.on('data', chunk => {
//                 console.log("chunk", chunk);
//                 body += chunk.toString(); // convert Buffer to string
//                 console.log("req data", body);

//             });
//             req.on('end', async () => {
//                 body = JSON.parse(body);
//                 // console.log("req userDocuments",body);
//                 const output = await Document.find({ email: body.email});


//                 console.log("output", output);



//                 if (output) {


//                     res.writeHead(200, { 'Content-Type': 'application/json' });

//                     res.end(JSON.stringify(output));
//                 }

//             });


//         }
//         catch (error) {
//             console.log("Error in /api/userDocuments", error);
//             res.end(JSON.stringify({ error }));

//         }


//     } else {
//         res.writeHead(404, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ error: 'Not Found' }));
//     }
// });



// // Start the server
// server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })

//Express Migration
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors({
    origin:process.env.CLIENT_URL
}))

app.use('/api', apiRouter);



app.listen(port, () => {
  console.log(`Express API listening on port ${port}`)
})
