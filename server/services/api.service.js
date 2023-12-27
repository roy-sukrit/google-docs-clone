const Document = require("../Document");

// const mongoose = require("./database");

async function getDocuments(req, res, next) {

    try {

        const data = await Document.find({ email: 'public' },
            { projection: { data: 0 } })
            .sort({ updatedAt: -1 });

            console.log("data",data);
        // res.writeHead(200, { 'Content-Type': 'application/json' });
         return JSON.stringify(data);
    }
    catch (error) {
        console.log("Error in /api/documents");
        res.end(JSON.stringify({ error }));

    }
}


async function deleteDocument(req, res, next) {

    try {

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', async () => {
            body = JSON.parse(body)
            console.log("req delete", body.id);
            const output = await Document.findByIdAndDelete(body.id);


            console.log("output", output);



            if (output) {



                res.end(JSON.stringify('Success'));
            }

        });


    }
    catch (error) {
        console.log("Error in /api/delete", error);
        res.end(JSON.stringify({ error }));

    }
}


async function updateDocument(req, res, next) {

    try {

        let body = '';
        req.on('data', chunk => {
            console.log("chunk", chunk);
            body += chunk.toString(); // convert Buffer to string
            console.log("req data", body);

        });
        req.on('end', async () => {
            body = JSON.parse(body);
            // console.log("req userDocuments",body);
            const output = await Document.find({ email: body.email });


            console.log("output", output);



            if (output) {


                res.writeHead(200, { 'Content-Type': 'application/json' });

                res.end(JSON.stringify(output));
            }

        });


    }
    catch (error) {
        console.log("Error in /api/userDocuments", error);
        res.end(JSON.stringify({ error }));

    }
}

module.exports = {
    getDocuments,
    deleteDocument,
    updateDocument
}