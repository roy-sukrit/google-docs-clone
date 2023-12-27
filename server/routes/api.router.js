const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');

/* GET Routes. */
router.get('/documents', apiController.getDocuments);
  
/* POST Routes. */
router.post('/delete', apiController.deleteDocument);

router.post('/userDocuments', apiController.updateDocument);


module.exports = router;