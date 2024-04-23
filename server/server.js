const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pos",
  port: 3307,
});

app.get("/", (req, res) => {
  if (req.session.username) {
    if (req.session.isAdmin) {
      console.log(req.session.username);
      console.log(true);
      return res.json({
        valid: true,
        username: req.session.username,
        admin: true,
      });
    } else {
      return res.json({
        valid: true,
        username: req.session.username,
        admin: false,
      });
    }
  } else {
    return res.json({ valid: false });
  }
});

app.post("/SignUp", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.json({ error: "Error" });
    }
    const sql =
      "INSERT INTO admins(`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];
    db.query(sql, [values], (err, data) => {
      if (err) {
        return res.json({ error: "Error" });
      }
      return res.json({ success: true });
    });
  });
});

app.post("/Login", (req, res) => {
  let sql = "SELECT * FROM admins WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      bcrypt.compare(req.body.password, data[0].password, (err, result) => {
        if (err) {
          return res.json("Error");
        }
        if (result) {
          req.session.username = data[0].username;
          req.session.admin_id = data[0].admin_id;
          req.session.isAdmin = true;

          return res.json({ Login: true, Admin: true, error: "" });
        } else {
          return res.json({
            Login: false,
            Admin: false,
            error: "Invalid password",
          });
        }
      });
    } else {
      sql = "SELECT * FROM employee WHERE email = ?";
      db.query(sql, [req.body.email], (err, data) => {
        if (err) {
          return res.json("Error");
        }
        if (data.length > 0) {
          bcrypt.compare(req.body.password, data[0].password, (err, result) => {
            if (err) {
              return res.json("Error");
            }
            if (result) {
              req.session.username = data[0].username;
              req.session.admin_id = data[0].admin_id;
              req.session.isAdmin = false;

              return res.json({ Login: true, Admin: false, error: "" });
            } else {
              return res.json({
                Login: false,
                Admin: false,
                error: "Invalid password",
              });
            }
          });
        } else {
          return res.json({
            Login: false,
            Admin: false,
            error: "No existing accounts",
          });
        }
      });
    }
  });
});

app.get("/Products", (req, res) => {
  const sql = "SELECT * FROM product WHERE admin_id = ?";

  db.query(sql, [req.session.admin_id], (err, data) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }
    return res.json(data);
  });
});

app.delete("/DeleteProduct", (req, res) => {
  const sql = "DELETE FROM product WHERE product_id = ?";
  db.query(sql, [req.query.product_id], (err, data) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Error deleting product" });
    }
    console.log(req.query.product_id);
    return res.json({ success: true });
  });
});

app.post("/AddProduct", (req, res) => {
  const sql =
    "INSERT INTO product(`product_id`, `Name`, `Price`, `Quantity`, `admin_id`) VALUES (?)";
  const values = [
    req.body.product_id,
    req.body.name,
    req.body.price,
    req.body.quantity,
    req.session.admin_id,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ error: "Error adding product" });
    }
    return res.json({ success: true });
  });
});

app.get("/CheckProductID", (req, res) => {
  const sql = "SELECT * FROM product WHERE product_id = ?";
  db.query(sql, [req.query.product_id], (err, data) => {
    if (err) {
      console.error("Error checking product ID:", err);
      return res.status(500).json({ error: "Error checking product ID" });
    } else if (data.length > 0) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  });
});

app.post("/AddEmployee", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.json({ error: "Error" });
    }
    const sql =
      "INSERT INTO employee(`username`, `password`, `email`, `admin_id`) VALUES (?)";
    const values = [
      req.body.username,
      hash,
      req.body.email,
      req.session.admin_id,
    ];
    db.query(sql, [values], (err, data) => {
      if (err) {
        return res.json({ error: "Error" });
      }
      return res.json({ success: true });
    });
  });
});

app.get("/GetEmployees", (req, res) => {
  const sql = "SELECT * FROM employee WHERE admin_id = ?";
  db.query(sql, [req.session.admin_id], (err, data) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return res.status(500).json({ error: "Error fetching employees" });
    }
    return res.json(data);
  });
});

app.get("/CheckProductIDs", (req, res) => {
  const sql = "SELECT * FROM product WHERE product_id = ? AND admin_id = ?";
  db.query(sql, [req.query.product_id, req.session.admin_id], (err, data) => {
    if (err) {
      console.error("Error checking product ID:", err);
      return res.status(500).json({ error: "Error checking product ID" });
    } else if (data.length > 0) {
      return res.json({ exists: true, product: data[0].Name });
    }
    return res.json({ exists: false });
  });
});

app.get("/GetItemPrice", (req, res) => {
  const sql = "SELECT Price FROM product WHERE product_id = ?";
  db.query(sql, [req.query.product_id], (err, data) => {
    if (err) {
      console.error("Error fetching price:", err);
      return res.status(500).json({ error: "Error fetching price" });
    }
    return res.json(data[0]);
  });
});

app.delete("/DeleteEmployee", (req, res) => {
  const sql = "DELETE FROM employee WHERE email = ?";
  db.query(sql, [req.query.email], (err, data) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: "Error deleting employee" });
    }
    return res.json({ success: true });
  });
});

app.post("/Checkout", async (req, res) => {
  const validQuantities = [];

  for (const item of req.body.items) {
    const stock = await new Promise((resolve, reject) => {
      db.query(
        "SELECT Quantity FROM product WHERE product_id = ?",
        [item.product_id],
        (err, data) => {
          if (err) {
            console.error("Error checking quantity:", err);
            reject(err);
          } else {
            resolve(data[0].Quantity);
          }
        }
      );
    });

    if (item.quantity > stock) {
      return res.status(500).json({ error: "Quantity not available" });
    } else {
      validQuantities.push(true);
      const values = [
        item.product_id,
        item.productName,
        req.session.admin_id,
        item.quantity,
      ];
      const sql =
        "INSERT INTO sold_products(`product_id`, `name`, `admin_id`, `quantity`) VALUES (?)";
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Error inserting sold product:", err);
        }
      });

      const updateSql =
        "UPDATE product SET Quantity = Quantity - ? WHERE product_id = ?";
      db.query(updateSql, [item.quantity, item.product_id], (err, data) => {
        if (err) {
          console.error("Error updating quantity:", err);
        }
      });
    }
  }

  if (validQuantities.length === req.body.items.length) {
    return res.json({ success: true });
  } else {
    return res.status(500).json({ error: `Not Enough Stock` });
  }
});

app.get("/SoldProducts", (req, res) => {
  const sql = "SELECT * FROM sold_products WHERE admin_id = ?";
  db.query(sql, [req.session.admin_id], (err, data) => {
    if (err) {
      console.error("Error fetching sold products:", err);
      return res.status(500).json({ error: "Error fetching sold products" });
    }
    return res.json(data);
  });
});

app.post("/EditProduct", (req, res) => {
  const sql =
    "UPDATE product SET Name = ?, Price = ?, Quantity = ? WHERE product_id = ?";
  const values = [
    req.body.Name,
    req.body.Price,
    req.body.Quantity,
    req.body.product_id,
  ];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error editing product:", err);
      return res.status(500).json({ error: "Error editing product" });
    }
    return res.json({ success: true });
  });
});

app.post("/EditEmployee", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.json({ error: "Error" });
    }
    const sql =
      "UPDATE employee SET username = ?, password = ?, email = ? WHERE admin_id = ?";
    const values = [
      req.body.username,
      hash,
      req.body.email,
      req.session.admin_id,
    ];
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error editing employee:", err);
        return res.status(500).json({ error: "Error editing employee" });
      }
      return res.json({ success: true });
    });
  });
});

app.get("/Logout", (req, res) => {
  req.session.destroy();
  return res.json({ success: true });
});

app.listen(8081, () => {
  console.log("listening");
});
