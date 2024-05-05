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
  res.json({ success: true });
  fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
});

app.post("/Login", (req, res) => {
  const { email, password } = req.body;
  let result = {};
  let existingAdmin;
  for (let user of offlineDB.admins) {
    if (user.email == email && user.password == password) {
      existingAdmin = user.username;
    }
  }
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
    offlineDB.LoggedUserAdmin = existingEmployee.admin;
    result = { Login: true, Admin: false, AdminName: existingEmployee.admin };
    session = result;
    return res.json(result);
  }
  offlineDB.LoggedUserAdmin = existingAdmin;
  result = { Login: true, Admin: true, AdminName: existingAdmin };
  session = result;
  res.json(result);
});

app.get("/Products", (req, res) => {
  let products = [];
  for (let product of offlineDB.product) {
    if ((product.admin = offlineDB.LoggedUserAdmin)) {
      products.push(product);
    }
  }
  res.json(products);
});

const generateProductId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 10);
};

app.get("/SoldProducts", (req, res) => {
  let sold_products = [];
  for (let product of offlineDB.sold_products) {
    if ((product.admin = offlineDB.LoggedUserAdmin)) {
      sold_products.push(product);
    }
  }
  res.json(sold_products);
});

app.get("/GetItemPrice", (req, res) => {
  const { product_id } = req.query;
  const product = offlineDB.product.find(
    (product) => product.product_id === product_id
  );
  res.json(product.Price);
});

app.get("/CheckProductIDs", (req, res) => {
  const product = req.query.product_id;
  for (let i = 0; i < offlineDB.product.length; i++) {
    if (offlineDB.product[i].product_id == product) {
      return res.json({ success: true, product: offlineDB.product[i].Name });
    }
  }
  return res.json({ success: false, product: "No Products Found" });
});

app.post("/Checkout", (req, res) => {
  const products = req.body.items;
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

app.get("/saveData", (req, res) => {
  fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));

  res.json({ success: true });
});

app.post("/loadData", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));

  res.json({ success: true });
});

app.get("/syncOnline", (req, res) => {
  offlineDB = JSON.parse(fs.readFileSync("offlineDB.json"));
  
  for (let i = 0; i < offlineDB.sold_products.length; i++) {
    const product = [];
    product.push(offlineDB.sold_products[i]);
    axios.post("http://localhost:8081/Checkout", { items: product });
  }
  

  for (let i = 0; i < offlineDB.admins.length; i++) {
    axios.post("http://localhost:8081/SignUp", offlineDB.admins[i]);
  }
});

app.get("/getAllProducts", (req, result) => {
  axios
    .get("http://localhost:8081/Products", {
      params: { admin: offlineDB.LoggedUserAdmin },
    })
    .then((response) => {
      const products = [];
      for (let i of response.data) {
        products.push(i);
      }
      offlineDB.product = products;
      result.json(response.data);
    })
    fs.writeFileSync("offlineDB.json", JSON.stringify(offlineDB));
});

app.get("/Logout", (req, res) => {
  offlineDB.LoggedUserAdmin = "";
  session = {};
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
