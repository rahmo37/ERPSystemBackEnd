// Employee inventory operations router

// Requiring express
const express = require("express");
const employee_InventoryOperationRoutes = express.Router();
const inventoryFunctions = require("../../controllers/employeeControllers/employeeInventoryController");
const jwtVerifyToken = require("../../middlewares/jwtVerifyToken");
const { isEmployee, isAdmin } = require("../../middlewares/roleVerification");

// Register necessary middlewares to  verify token and role
employee_InventoryOperationRoutes.use(jwtVerifyToken, isEmployee);

//! this route is currently moved to the shared route folder
// View inventory route
// employee_InventoryOperationRoutes.get(
//   "/",
//   inventoryFunctions.viewInventory
// );

// Delete product route
employee_InventoryOperationRoutes.delete(
  "/:categoryId/:productId",
  isAdmin,
  inventoryFunctions.deleteProduct
);

// Update product route
employee_InventoryOperationRoutes.put(
  "/:categoryId/:productId",
  inventoryFunctions.updateProduct
);

// Restock a product
employee_InventoryOperationRoutes.patch(
  "/restock/:categoryId/:productId",
  inventoryFunctions.restockProduct
);

// Create product route
employee_InventoryOperationRoutes.post(
  "/:categoryId",
  isAdmin,
  inventoryFunctions.createProduct
);

// View inventory report route
employee_InventoryOperationRoutes.get(
  "/report",
  inventoryFunctions.getInventoryReport
);

employee_InventoryOperationRoutes.post(
  "/report/custom",
  inventoryFunctions.getCustomSoldProductReport
);

// Export the module
module.exports = employee_InventoryOperationRoutes;
