const apiService = require('../services/api.service');


/** GET Documents*/
async function getDocuments(req, res, next) {
  try {
      const data = await apiService.getDocuments(req);
      console.log("data controller",data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end((data));


  } catch (err) {
      console.error(`Error while getting Documents `, err.message);
  }
}


/** Delete Documents*/
async function deleteDocument(req, res, next) {
    try {
        const data = await apiService.deleteDocument(req,res);

        console.log("data controller 2",data);

        // res.writeHead(200, { 'Content-Type': 'application/json' });

        // res.end((data));
    
    } catch (err) {
        console.error(`Error while  deleteDocument `, err.message);
    }
  }
  

  /** Update Documents*/
async function updateDocument(req, res, next) {
    try {
        const data = await apiService.updateDocument(req,res);
        console.log("data controller",data);
  
        // res.writeHead(200, { 'Content-Type': 'application/json' });
        // res.end((data));  
      } catch (err) {
        console.error(`Error while updateDocument `, err.message);
    }
  }
  


module.exports = {
    getDocuments,
    deleteDocument,
    updateDocument
  };