// Importing the fetchHandler module
import { fetchHandler } from "../../helper/fetchHandler.js";
import { urlObject } from "../../helper/urls.js";
import { errorPopUp } from "../../helper/errorPopUpHandler.js";
import { successPopUp } from "../../helper/successPopupHandler.js";
import { confirmPopUp } from "../../helper/confirmPopUpHandler.js";
import { filterTable } from "../../helper/searchTable.js";

(function () {
  const usersContainer = document.getElementById("table-container");
  const addUserBtn = document.getElementById("add-new-btn");
  const modal = document.getElementById("customer-modal");
  const modalContent = document.getElementById("modal-content-customer");
  const closeModalBtn = document.getElementById("close-userDetail-modal");
  const modalOverlay = document.getElementById("custom-modal-overlay");
  const addUserModal = document.getElementById("add-User-modal");
  const closeAddUserModalBtn = document.getElementById("close-add-User-modal");
  const userForm = document.getElementById("new-user-form");
  const addUserModalOverlay = document.getElementById("add-User-modal-overlay");
  const searchInput = document.getElementById("searchInput");

  getUserList();

  //////////////// Functions for communication with server //////////////

  // Function to retrieve customer list from server
  async function getUserList() {
    try {
      const requestInfo = {
        url: urlObject.getCustomerList,
        method: fetchHandler.methods.get,
      };

      const data = await fetchHandler.sendRequest(requestInfo);
      const userData = data.data; // Store user data
      renderUserList(userData);
      const searchInput = document.getElementById("searchInput");
      searchInput.addEventListener("input", () => {
        filterTable();
      });
    } catch (error) {
      errorPopUp.showErrorModal("Error fetching User List:", error.message);
    }
  }

  // Function to add customer
  async function addCustomer(customerData) {
    try {
      const requestInfo = {
        url: urlObject.createCustomer,
        method: fetchHandler.methods.post,
        data: customerData,
      };

      const data = await fetchHandler.sendRequest(requestInfo);
      successPopUp.showSuccessModal(data.message);
    } catch (error) {
      errorPopUp.showErrorModal(error.message);
    }
  }

  // Function to update customer data, including account status
  async function updateCustomerData(customerID, updatedData) {
    try {
      const requestInfo = {
        url: urlObject.updateCustomer + customerID,
        method: fetchHandler.methods.put,
        data: updatedData,
      };

      const data = await fetchHandler.sendRequest(requestInfo);

      successPopUp.showSuccessModal(data.message);
    } catch (error) {
      errorPopUp.showErrorModal(error.message);
    }
  }

  //////////////////////////////////////////////////////////////////////

  // Render user list in table
  function renderUserList(data) {
    usersContainer.innerHTML = ""; // Clear the container

    const table = document.createElement("table");
    table.id = "dataTable";
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
      <th>Customer ID</th>
      <th>Email</th>
      <th>Phone Number</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Gender</th>
      <th>Date Created</th>
      <th>Account Status</th>
    `;
    table.appendChild(headerRow);

    data.forEach((customer) => {
      const customerRow = document.createElement("tr");
      customerRow.innerHTML = `
        <td>${customer.customerID}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>${customer.customerBio.firstName}</td>
        <td>${customer.customerBio.lastName}</td>
        <td>${customer.customerBio.gender}</td>
        <td>${new Date(customer.accountCreated).toLocaleDateString()}</td>
        <td>${customer.accountStatus}</td>
      `;

      customerRow.addEventListener("click", () => {
        openCustomerModal(customer);
      });

      table.appendChild(customerRow);
    });

    usersContainer.appendChild(table);
  }

  // Open customer details modal
  function openCustomerModal(customer) {
    const formattedDate = new Date(customer.accountCreated).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

    modalContent.innerHTML = `
      <h2>User Information</h2>
      <form id="edit-user-form">

        <label for="customerId">Customer ID:</label>
        <input type="text" id="customerId" name="customerId" value="${
          customer.customerID
        }" readonly>

        <div class="multiple-input-fields">
          <div>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" value="${
              customer.customerBio.firstName
            }" required>
          </div>
          <div>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" value="${
              customer.customerBio.lastName
            }" required>
          </div>
        </div>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="${
          customer.email
        }" readonly>

        <label for="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" value="${
          customer.phone
        }" required>

        <label for="street">Street:</label>
        <input type="text" id="street" name="street" value="${
          customer.customerBio.address.street
        }" required>

        <div class="multiple-input-fields">
          <div>
            <label for="city">City:</label>
            <input type="text" id="city" name="city" value="${
              customer.customerBio.address.city
            }" required>
          </div>
          <div>
            <label for="country">Country:</label>
            <input type="text" id="country" name="country" value="${
              customer.customerBio.address.country
            }" required>
          </div>
        </div>

        <div class="multiple-input-fields">
          <div>
            <label for="gender">Gender:</label>
            <select id="gender" name="gender">
              <option value="Male" ${
                customer.customerBio.gender === "Male" ? "selected" : ""
              }>Male</option>
              <option value="Female" ${
                customer.customerBio.gender === "Female" ? "selected" : ""
              }>Female</option>
              <option value="Other" ${
                customer.customerBio.gender === "Other" ? "selected" : ""
              }>Other</option>
            </select>
          </div>
          <div>
            <label for="account-status">Account Status:</label>
            <select id="account-status" name="account-status">
              <option value="Active" ${
                customer.accountStatus === "Active" ? "selected" : ""
              }>Active</option>
              <option value="Frozen" ${
                customer.accountStatus === "Frozen" ? "selected" : ""
              }>Frozen</option>
            </select>
          </div>
        </div>

        <label for="date">Date Created:</label>
        <input type="text" id="date" name="dateCreated" value="${formattedDate}" readonly>    

        <button type="submit" id="save-changes-btn">Save Changes</button>
      </form>
    `;

    modal.style.display = "block";
    modalOverlay.style.display = "block";

    // Set focus to the first input field
    document.getElementById("firstName").focus();

    const editUserForm = document.getElementById("edit-user-form");

    // Define the form submission handler
    async function formSubmitHandler(event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const updatedCustomerData = {};

      // Check and add updated fields to the payload
      if (formData.get("firstName") !== customer.customerBio.firstName) {
        updatedCustomerData.firstName = formData.get("firstName");
      }
      if (formData.get("lastName") !== customer.customerBio.lastName) {
        updatedCustomerData.lastName = formData.get("lastName");
      }
      if (formData.get("phone") !== customer.phone) {
        updatedCustomerData.phone = formData.get("phone");
      }
      if (formData.get("street") !== customer.customerBio.address.street) {
        updatedCustomerData.address = {
          ...(updatedCustomerData.address || {}),
          street: formData.get("street"),
        };
      }
      if (formData.get("city") !== customer.customerBio.address.city) {
        updatedCustomerData.address = {
          ...(updatedCustomerData.address || {}),
          city: formData.get("city"),
        };
      }
      if (formData.get("country") !== customer.customerBio.address.country) {
        updatedCustomerData.address = {
          ...(updatedCustomerData.address || {}),
          country: formData.get("country"),
        };
      }
      if (formData.get("gender") !== customer.customerBio.gender) {
        updatedCustomerData.gender = formData.get("gender");
      }
      if (formData.get("account-status") !== customer.accountStatus) {
        updatedCustomerData.accountStatus = formData.get("account-status");
      }

      // Only send updated fields
      if (Object.keys(updatedCustomerData).length > 0) {
        await updateCustomerData(customer.customerID, updatedCustomerData);
      }

      closeModal();
      getUserList();
      searchInput.value = "";
    }

    // Remove previous event listener to prevent duplicates
    editUserForm.removeEventListener("submit", formSubmitHandler);
    editUserForm.addEventListener("submit", formSubmitHandler);
  }

  // Close customer modal
  function closeModal() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
  }

  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Open Add User modal
  addUserBtn.addEventListener("click", () => {
    addUserModal.style.display = "block";
    addUserModalOverlay.style.display = "block";
  });

  // Close Add User modal
  function closeAddUserModal() {
    addUserModal.style.display = "none";
    addUserModalOverlay.style.display = "none";
  }

  closeAddUserModalBtn.addEventListener("click", closeAddUserModal);
  addUserModalOverlay.addEventListener("click", closeAddUserModal);

  // Add user form submission
  userForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(userForm);
    const customerData = {
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      customerBio: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        address: {
          street: formData.get("street"),
          city: formData.get("city"),
          country: formData.get("country"),
        },
        gender: formData.get("gender"),
      },
      accountCreated: new Date().toISOString(),
      accountStatus: "Active",
      orders: [],
    };

    await addCustomer(customerData);
    closeAddUserModal();
    getUserList();
    searchInput.value = "";
  });
})();
