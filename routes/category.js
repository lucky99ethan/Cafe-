const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

// Import your category controller here
router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    // Call your category controller function here
    let category = req.body;
    query = 'insert into category (name) values(?)';
    connection.query(query, [category.name], (err, results) => {
        if (!err) {
            console.log('Category added successfully:', category);
            return res.status(200).json({ message: 'Category added successfully' });
        } else {
            console.log('Error adding category:', err);
            return res.status(500).json(err);
        }
    });
});

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    // Call your category controller function here
    var query = 'select * from category';
    connection.query(query, (err, results) => {
        if (!err) {
            console.log('Categories:', results);
            return res.status(200).json(results);
        } else {
            console.log('Error fetching categories:', err);
            return res.status(500).json(err);
        }
    });
});


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    // Call your category controller function here
    let category = req.body;
    query = 'update category set name=? where id=?';
    connection.query(query, [category.name, category.id], (err, results) => {
        if (!err) {
           if(results.affectedRows == 0){
               return res.status(404).json({message: "Category id does not found"});
           }
           return res.status(200).json({message: "Category Updated Successfully"});
        } else {
            console.log('Error updating category:', err);
            return res.status(500).json(err);
        } 
    });
});

module.exports = router;