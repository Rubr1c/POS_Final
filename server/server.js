const express = require("express");

const mysql = require("mysql2");
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

const db = mysql.createPool({
  host: "mysql-2db23d6d-alizaghloul64-04e3.l.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_ftL4Rwa6oc9QuRe4FNH",
  database: "pos",
  port: 19616,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  if (req.session.username) {
    if (req.session.isAdmin) {
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
  console.log(req.body.password);
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    db.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting connection:", err);
        return res.status(500).json({ error: "Database connection error" });
      }

      const insertSql =
        "INSERT INTO admins(`username`, `email`, `password`) VALUES (?)";
      const insertValues = [req.body.username, req.body.email, hash];

      connection.query(insertSql, [insertValues], (err, data) => {
        connection.release();

        
        

        return res.json({ success: true });
      });
    });
  });
});

app.post("/Login", (req, res) => {
  let sql = "SELECT * FROM admins WHERE email = ?";
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(sql, [req.body.email], (err, adminData) => {
      if (err) {
        connection.release();
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error querying database" });
      }

      if (adminData.length > 0) {
        bcrypt.compare(
          req.body.password,
          adminData[0].password,
          (err, result) => {
            if (err) {
              connection.release();
              console.error("Error comparing passwords:", err);
              return res
                .status(500)
                .json({ error: "Error comparing passwords" });
            }

            if (result) {
              req.session.username = adminData[0].username;
              req.session.admin = adminData[0].username;
              req.session.isAdmin = true;

              connection.release();
              return res.json({
                Login: true,
                Admin: true,
                error: "",
                Username: adminData[0].username,
                AdminName: adminData[0].username,
              });
            } else {
              return res.json({ error: "Incorrect password" });
            }
          }
        );
      } else {
        sql = "SELECT * FROM employee WHERE email = ?";
        connection.query(sql, [req.body.email], (err, employeeData) => {
          connection.release();

          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Error querying database" });
          }

          if (employeeData.length > 0) {
            bcrypt.compare(
              req.body.password,
              employeeData[0].password,
              (err, result) => {
                if (err) {
                  console.error("Error comparing passwords:", err);
                  return res
                    .status(500)
                    .json({ error: "Error comparing passwords" });
                }

                if (result) {
                  req.session.username = employeeData[0].username;
                  req.session.admin = employeeData[0].admin;
                  req.session.isAdmin = false;

                  return res.json({
                    Login: true,
                    Admin: false,
                    error: "",
                    Username: employeeData[0].username,
                    AdminName: employeeData[0].admin,
                  });
                } else {
                  return res.json({
                    Login: false,
                    Admin: false,
                    error: "Incorrect password",
                  });
                }
              }
            );
          } else {
            return res.json({
              Login: false,
              Admin: false,
              error: "No existing account",
            });
          }
        });
      }
    });
  });
});

app.get("/Products", async (req, res) => {
  try {
    const sql = "SELECT * FROM product WHERE admin = ?";
    const [rows, fields] = await db
      .promise()
      .query(sql, [req.session.admin || req.query.admin]);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ error: "Error fetching products" });
  }
});

app.post("/AddProduct", async (req, res) => {
  try {
    const sql =
      "INSERT INTO product(`product_id`, `Name`, `Price`, `Quantity`, `admin`) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.product_id,
      req.body.name,
      req.body.price,
      req.body.quantity,
      req.session.admin || req.body.admin,
    ];
    const [rows, fields] = await db.promise().query(sql, values);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error adding product:", err);
    return res.status(500).json({ error: "Error adding product" });
  }
});

app.delete("/DeleteProduct", async (req, res) => {
  try {
    const sql = "DELETE FROM product WHERE product_id = ?";
    const [rows, fields] = await db
      .promise()
      .query(sql, [req.query.product_id]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ error: "Error deleting product" });
  }
});

app.post("/EditProduct", async (req, res) => {
  try {
    const sql =
      "UPDATE product SET Name = ?, Price = ?, Quantity = ? WHERE product_id = ?";
    const values = [
      req.body.Name,
      req.body.Price,
      req.body.Quantity,
      req.body.product_id,
    ];
    const [rows, fields] = await db.promise().query(sql, values);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error editing product:", err);
    return res.status(500).json({ error: "Error editing product" });
  }
});

app.get("/CheckProductID", async (req, res) => {
  try {
    const sql = "SELECT * FROM product WHERE product_id = ?";
    const [rows, fields] = await db
      .promise()
      .query(sql, [req.query.product_id]);
    return res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error("Error checking product ID:", err);
    return res.status(500).json({ error: "Error checking product ID" });
  }
});

app.get("/CheckProductIDs", async (req, res) => {
  try {
    const sql = "SELECT * FROM product WHERE product_id = ? AND admin = ?";
    const [rows, fields] = await db
      .promise()
      .query(sql, [req.query.product_id, req.session.admin]);
    return res.json({
      exists: rows.length > 0,
      product: rows.length > 0 ? rows[0].Name : null,
    });
  } catch (err) {
    console.error("Error checking product ID:", err);
    return res.status(500).json({ error: "Error checking product ID" });
  }
});

app.get("/SoldProducts", async (req, res) => {
  try {
    const sql = "SELECT * FROM sold_products WHERE admin = ?";
    const [rows, fields] = await db.promise().query(sql, [req.session.admin]);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching sold products:", err);
    return res.status(500).json({ error: "Error fetching sold products" });
  }
});

app.get("/GetItemPrice", async (req, res) => {
  try {
    const sql = "SELECT Price FROM product WHERE product_id = ?";
    const [rows, fields] = await db
      .promise()
      .query(sql, [req.query.product_id]);
    return res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching price:", err);
    return res.status(500).json({ error: "Error fetching price" });
  }
});

app.post("/AddEmployee", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const sql =
      "INSERT INTO employee(`username`, `password`, `email`, `admin`) VALUES (?, ?, ?, ?)";
    const values = [req.body.username, hash, req.body.email, req.session.admin];
    const [rows, fields] = await db.promise().query(sql, values);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error adding employee:", err);
    return res.status(500).json({ error: "Error adding employee" });
  }
});

app.get("/GetEmployees", async (req, res) => {
  try {
    const sql = "SELECT * FROM employee WHERE admin = ?";
    const [rows, fields] = await db.promise().query(sql, [req.session.admin]);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching employees:", err);
    return res.status(500).json({ error: "Error fetching employees" });
  }
});

app.post("/EditEmployee", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const sql =
      "UPDATE employee SET username = ?, password = ? WHERE email = ? AND admin = ?";
    const values = [req.body.username, hash, req.body.email, req.session.admin];
    const [rows, fields] = await db.promise().query(sql, values);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error editing employee:", err);
    return res.status(500).json({ error: "Error editing employee" });
  }
});

app.delete("/DeleteEmployee", async (req, res) => {
  try {
    const sql = "DELETE FROM employee WHERE email = ?";
    const [rows, fields] = await db.promise().query(sql, [req.query.email]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return res.status(500).json({ error: "Error deleting employee" });
  }
});

app.post("/Checkout", async (req, res) => {
  console.log(req.body);
  try {
    const validQuantities = [];

    for (const item of req.body.items || req.body) {
      const [rows, fields] = await db
        .promise()
        .query("SELECT Quantity FROM product WHERE product_id = ?", [
          item.product_id,
        ]);
      const stock = rows[0].Quantity;

      if (item.quantity > stock) {
        return res.status(500).json({ error: "Quantity not available" });
      } else {
        validQuantities.push(true);
        const values = [
          item.product_id,
          item.productName || item.name,
          req.session.admin || item.admin,
          item.quantity,
          item.date_sold
            ? item.date_sold.slice(0, 19).replace("T", " ")
            : new Date().toISOString().slice(0, 19).replace("T", " "),
        ];
        const sql =
          "INSERT INTO sold_products(`product_id`, `name`, `admin`, `quantity`, `date_sold`) VALUES (?)";
        await db.promise().query(sql, [values]);

        const updateSql =
          "UPDATE product SET Quantity = Quantity - ? WHERE product_id = ?";
        await db.promise().query(updateSql, [item.quantity, item.product_id]);
      }
    }

    if (validQuantities.length === req.body.items.length) {
      return res.json({ success: true });
    } else {
      return res.status(500).json({ error: `Not Enough Stock` });
    }
  } catch (err) {
    console.error("Error in checkout:", err);
  }
});

app.get("/Logout", (req, res) => {
  req.session.destroy();
  return res.json({ success: true });
});

app.listen(8081, () => {
  console.log("listening");
});
