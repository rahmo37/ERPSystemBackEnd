/**
 * Author: Nick, Obaedur
 * Date: 17-sep-24
 * Description: This is the starting file of the ERPSystem, calls various routes and middlewares, connects to database and starts the server
 */

// Importing Modules
// Project configuration imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConfig = require("./config/db");
const requestInfo = require("./middlewares/logRequestInformation");
const { hashPasswordsInDatabase } = require("./misc/hashPassword");

// Employee related imports
const employeeAuth = require("./routes/authentication/employeeAuth");
const employeeInventoryOperations = require("./routes/employeeOperations/inventoryOperationsRoute");
const employeeCustomerOperations = require("./routes/employeeOperations/customerOperationsRoute");
const employee_EmployeeOperations = require("./routes/employeeOperations/employeeOperationsRoute");
const employeeOrderOperations = require("./routes/employeeOperations/orderOperationsRoute");
const employeeSaleOperations = require("./routes/employeeOperations/saleOperations");
const employeeInformationUpdate = require("./routes/updateAccountInformation/employeeInfoUpdateRoute");

// Customer related imports
const customerAuth = require("./routes/authentication/customerAuth");
const customerInformationUpdate = require("./routes/updateAccountInformation/customerInfoUpdateRoute");
const customerOrderRequests = require("./routes/customerRequests/orderRequestRoute");

// Shared routes imports
const sharedCreateCustomer = require("./routes/sharedRoutes/createCustomerRoute");
const sharedOrderOperations = require("./routes/sharedRoutes/sharedOrderOperationsRoute");
const sharedGetInventory = require("./routes/sharedRoutes/getInventoryRoute");

// Error related imports
const errorHandler = require("./middlewares/errorHandler");
const routeNotFoundHandler = require("./middlewares/routeNotFoundHandler");

// Model imports
const Customer = require("./models/Customer");
const Employee = require("./models/Employee");

//!---------------------- Application logic starts ----------------------

// Configuring application
// Creating application instance
const erpSystem = express();

// Enable cors-origin requests
erpSystem.use(cors());

// Print request information
erpSystem.use(requestInfo);

// Data parsing middleware
erpSystem.use(express.json());

// Routes
// Employee routes
erpSystem.use("/api/employee/login", employeeAuth);
erpSystem.use("/api/employee/inventory", employeeInventoryOperations);
erpSystem.use("/api/employee/customer", employeeCustomerOperations);
erpSystem.use("/api/employee/manage", employee_EmployeeOperations);
erpSystem.use("/api/employee/update", employeeInformationUpdate);
erpSystem.use("/api/employee/order", employeeOrderOperations);
erpSystem.use("/api/employee/sale", employeeSaleOperations);

//Customer routes
erpSystem.use("/api/customer/login", customerAuth);
erpSystem.use("/api/customer/update", customerInformationUpdate);
erpSystem.use("/api/customer/order", customerOrderRequests);

// Shared routes
erpSystem.use("/api/shared/customer", sharedCreateCustomer);
erpSystem.use("/api/shared/order", sharedOrderOperations);
erpSystem.use("/api/shared/inventory", sharedGetInventory);

// Not found error handler, if no routes matches this middleware is called
erpSystem.use(routeNotFoundHandler);

// Error handling middleware
erpSystem.use(errorHandler);

// Database connection
mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("Database connected...");

    /**
     * If database connection is successful, we start our server
     * Otherwise we go to the catch block
     */
    const PORT = process.env.PORT || 3000;
    erpSystem.listen(PORT, () => {
      console.log(`ERP Server is listening request on port ${PORT}...`);
    });

    // Hash entity passwords, implies when records are added manually in the database
    hashPasswordsInDatabase([Customer, Employee]);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
