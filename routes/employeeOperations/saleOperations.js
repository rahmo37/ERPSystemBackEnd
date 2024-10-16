// Admin employee operations router

// Requiring express
const express = require("express");
const employee_SaleOperationsRoute = express.Router();
const saleFunction = require("../../controllers/employeeControllers/employeeSalesController");
const jwtVerifyToken = require("../../middlewares/jwtVerifyToken");
const isAdmin = require("../../middlewares/roleVerification");

// Register necessary middlewares to verify token and role
// ! employee_SaleOperationsRoute.use(jwtVerifyToken,isAdmin);

// retrieve the sales report
employee_SaleOperationsRoute.get("/", saleFunction.salesReport);

// Export the module
module.exports = employee_SaleOperationsRoute;
