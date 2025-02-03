  const express = require('express');
  const connection = require('../connection');
  const router = express.Router();
  var auth = require('../services/authentication');


  router.get('/details', auth.authenticateToken,(req,res,next) => {
    var categoryCount;
    var productCount;
    var billcount;
    var query = "select count(id) as categoryCount from category";
    connection.query(query, (err, results) => {
        if(!err){
            categoryCount = results[0].categoryCount;
        }
        else{
            return res.status(500).json(err);
        }
    });
    var query ="select count(id) as productCount from product";
    connection.query(query, (err, results) => {
        if(!err){
            productCount = results[0].productCount;

        }
        else{
            return res.status(500).json(err);
        }
    })
    var query = "select count(id) as billCount from bill";
    connection.query(query,(err, results) => {
        if(!err){
            billcount = results[0].billcount;
            var data = {
                category: categoryCount,
                product: productCount,
                bill: billcount
            };
            return res.status(200).json(data);  
        }
        else{
            return res.status(500).json(err);
        }
    })
 
  })


  exports = module.exports = router;