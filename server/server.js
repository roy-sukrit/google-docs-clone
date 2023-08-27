const mongoose = require("./database");
const Document = require("./Document");
const defaultValue ="";
const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on("connection",  socket => {
    console.log("Connected server");

    socket.on("get-document", async documentId => {
        const document = await findOrCreateDocument(documentId);

        //Putting the user in the room socket
        socket.join(documentId)

        //Sending the Latest data
        socket.emit("load-document", document.data)


        socket.on("send-changes", delta => {
            console.log("changes from client delta =>", delta);
            //To boradcast that there has been some changes to everyone except users  
            // socket.broadcast.emit("receive-changes",delta)
            //Added docuemt id for room identier
            socket.broadcast.to(documentId).emit("receive-changes", delta);    
    
        })

        socket.on("save-document",async data =>{
            await Document.findByIdAndUpdate(documentId,{data})
        })
    
    })

  
    // socket.on("load-document",documentId =>{
    //     const data = "";

    //     //Putting the user in the room socket
    //     socket.join(documentId)
    // })
})



async function findOrCreateDocument(id) {
    if(id == null) return;

    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({_id:id,data:defaultValue})
    
}