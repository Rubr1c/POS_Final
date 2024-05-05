const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const { off } = require("process");

let offlineDB = {
  admins: [],
  employee: [],
  product: [],
  sold_products: [],
  LoggedUserAdmin: "",
};

let session = {};

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send(session);
});

app.get("/getData", (req, res) => {
  res.send(offlineDB);
});

app.post("/SignUp", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  const { email, username, password } = req.body;
  const existingAdmin = offlineDB.admins.find(
    (admin) => admin.username === username
  );
  if (existingAdmin) {
    return res
      .status(400)
      .json({ success: false, error: "User already exists." });
  }
  offlineDB.admins.push({
    email: email,
    username: username,
    password: password,
  });
  fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
  res.json({ success: true });
});

app.post("/Login", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  const { email, password } = req.body;

  let result = {};
  let existingAdmin;
  console.log(email, password);
  existingAdmin = offlineDB.admins.find(
    (admin) => admin.email === email && admin.password === password
  );
  console.log(existingAdmin);
  if (!existingAdmin) {
    let existingEmployee;
    for (let user of offlineDB.employee) {
      if (user.email == email && user.password == password) {
        existingEmployee = {
          user: user.username,
          admin: user.admin,
        };
      }
    }
    if (!existingEmployee) {
      result = { Login: false, error: "Invalid username or password." };
      session = result;
      return res.status(400).json(result);
    }
    console.log(existingEmployee.admin);
    offlineDB.LoggedUserAdmin = existingEmployee.admin;
    result = { Login: true, Admin: false, AdminName: existingEmployee.admin };
    session = result;
    fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
    return res.json(result);
  }
  console.log(existingAdmin);
  offlineDB.LoggedUserAdmin = existingAdmin.name;
  result = { Login: true, Admin: true, AdminName: existingAdmin.name };
  session = result;
  fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
  res.json(result);
});

app.get("/Products", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  let products = [];
  for (let product of offlineDB.product) {
    if ((product.admin = offlineDB.LoggedUserAdmin)) {
      products.push(product);
    }
  }
  fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
  res.json(products);
});

app.get("/SoldProducts", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  let sold_products = [];
  for (let product of offlineDB.sold_products) {
    if ((product.admin = offlineDB.LoggedUserAdmin)) {
      sold_products.push(product);
    }
  }
  fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
  res.json(sold_products);
});

app.get("/GetItemPrice", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  const { product_id } = req.query;
  console.log(product_id);
  const product = offlineDB.product.find(
    (product) => product.product_id === product_id
  );
  console.log(product);
  console.log(parseFloat(product.Price));
  res.json({ Price: parseFloat(product.Price) });
});

app.get("/CheckProductIDs", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  const product = req.query.product_id;
  for (let i = 0; i < offlineDB.product.length; i++) {
    if (offlineDB.product[i].product_id == product) {
      return res.json({ success: true, product: offlineDB.product[i].Name });
    }
  }
  return res.json({ success: false, product: "No Products Found" });
});

app.post("/Checkout", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  const products = req.body.items;
  console.log(products);
  for (let product of products) {
    const productDB = offlineDB.product.find(
      (p) => p.product_id === product.product_id
    );
    if (productDB.quantity < product.quantity) {
      return res.json({
        success: false,
        error: "Not enough quantity for product " + productDB.name,
      });
    }
    const values = {
      product_id: product.product_id,
      name: product.productName,
      admin: offlineDB.LoggedUserAdmin,
      quantity: product.quantity,
      date_sold: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    offlineDB.sold_products.push(values);
    res.json({ success: true });
  }
  fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
});

app.get("/syncOnline", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  const product = [];
  for (let i = 0; i < offlineDB.sold_products.length; i++) {
    product.push(offlineDB.sold_products[i]);
  }
  axios.post("http://localhost:8081/Checkout", { items: product });

  for (let i = 0; i < offlineDB.admins.length; i++) {
    axios.post("http://localhost:8081/SignUp", offlineDB.admins[i]);
  }
});

app.get("/getAllProducts", async (req, result) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  async function getProducts() {
    const response = await axios.get("http://localhost:8081/Products", {
      params: { admin: offlineDB.LoggedUserAdmin },
    });
    const products = response.data;
    return products;
  }

  try {
    const products = await getProducts();
    offlineDB.product = products;
    fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
    result.json({ message: "Products fetched successfully", products }); // Send a success response
  } catch (error) {
    console.error("Error fetching products:", error);
    result.status(500).json({ error: "Error fetching products" });
  }
});

app.get("/Logout", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  offlineDB.LoggedUserAdmin = "";
  session = {};
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
