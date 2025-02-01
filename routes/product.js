const express = require("express");
const router = express.Router();
const connection = require("../connection");
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/add", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let product = req.body;
  const query =
    'insert into product (name, description, price, category_id, status) values(?, ?, ?, ?, "true")';
  connection.query(
    query,
    [product.name, product.description, product.price, product.category_id],
    (err, results) => {
      if (!err) {
        console.log("Product added successfully:", product);
        return res.status(200).json({ message: "Product added successfully" });
      } else {
        console.log("Error adding product:", err);
        return res.status(500).json(err);
      }
    }
  );
});
router.get("/get", auth.authenticateToken, (req, res, next) => {
  var query =
    "select p.id, p.name, p.description, p.price, p.status, c.id as category_id, c.name as categoryName from product as p INNER JOIN category as c on p.category_id = c.id";
  connection.query(query, (err, results) => {
    if (!err) {
      console.log("Products:", results);
      return res.status(200).json(results);
    } else {
      console.log("Error fetching products:", err);
      return res.status(500).json(err);
    }
  });
});

router.get("/getByCategory/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  var query =
    'select id, name from product where category_id=? and status = "true"';
  connection.query(query, [id], (err, results) => {
    if (!err) {
      console.log("Products:", results);
      return res.status(200).json(results);
    } else {
      console.log("Error fetching products:", err);
      return res.status(500).json(err);
    }
  });
});

router.get("/getById/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  var query = "select id, name, description, price from product where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      console.log("Product:", results);
      return res.status(200).json(results);
    } else {
      console.log("Error fetching product:", err);
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let product = req.body;
    query =
      "update product set name=?, description=?, price=?, category_id=? where id=?";
    connection.query(
      query,
      [
        product.name,
        product.description,
        product.price,
        product.category_id,
        product.id,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res
              .status(404)
              .json({ message: "Product id does not found" });
          }
          return res
            .status(200)
            .json({ message: "Product Updated SuccesFully" });
        } else {
          console.log("Error updating product:", err);
          return res.status(500).json(err);
        }
      }
    );
  }
);

router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const id = req.params.id;
    var query = " delete from product where id = ?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product id does not found" });
        }
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      } else {
        console.log("Error deleting product:", err);
        return res.status(500).json(err);
      }
    });
  }
);

router.patch(
  "/updateStatus",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let user = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product id does not found" });
        }
        return res
          .status(200)
          .json({ message: "Product Status Updated Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

module.exports = router;
