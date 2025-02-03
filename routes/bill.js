const express = require("express");
const connection = require("../connection");
const router = express.Router();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
var fs = require("fs");
var uuid = require("uuid");
var auth = require("../services/authentication");

router.post("/generateReport", auth.authenticateToken, (req, res) => {
  const generatedUuid = uuid.v1();
  const orderDetails = req.body;

  // Ensure productDetails is a valid JSON string
  if (!orderDetails.productDetails) {
    return res.status(400).json({ message: "Product details are required" });
  }

  let productDetailsReport;
  try {
    productDetailsReport = JSON.parse(orderDetails.productDetails);
  } catch (error) {
    return res.status(400).json({ message: "Invalid product details format" });
  }

  const query =
    "insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [
      orderDetails.name,
      generatedUuid,
      orderDetails.email,
      orderDetails.contactNumber,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      orderDetails.productDetails,
      res.locals.email,
    ],
    (err, results) => {
      if (!err) {
        ejs.renderFile(
          path.join(__dirname, "report.ejs"),
          {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
          },
          (err, data) => {
            if (err) {
              return res.status(500).json(err);
            } else {
              pdf
                .create(data)
                .toFile(
                  "./generated_pdf/" + generatedUuid + ".pdf",
                  function (err, result) {
                    if (err) {
                      console.log("Error generating pdf:", err);
                      return res.status(500).json(err);
                    } else {
                      console.log("PDF generated successfully");
                      return res.status(200).json({ uuid: generatedUuid });
                    }
                  }
                );
            }
          }
        );
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

router.get("/getPdf", auth.authenticateToken, function (req, res) {
  const orderDetails = req.body;
  const generatedUuid = orderDetails.uuid; // Extract UUID from request body
  const pdfPath = "./generated_pdf/" + generatedUuid + ".pdf";
  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    ejs.renderFile(
      path.join(__dirname, "report.ejs"),
      {
        productDetails: productDetailsReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount,
      },
      (err, data) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          pdf.create(data).toFile(pdfPath, function (err, data) {
            if (err) {
              console.log("Error generating pdf:", err);
              return res.status(500).json(err);
            } else {
              console.log("PDF generated successfully");
              res.contentType("application/pdf");
              fs.createReadStream(pdfPath).pipe(res);
            }
          });
        }
      }
    );
  }
});

router.get("/getBills", auth.authenticateToken, (req, res, next) => {
  var query = "select * from bill order by id DESC";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json(results);
    } else {
      return res.status(200).json(results);
    }
  });
});

router.delete("/delete/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  var query = "delete from bill where id = ?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(400).json({ message: "Bill id does not found" });
      } else {
        return res.status(200).json({ message: "Bill deleted successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
