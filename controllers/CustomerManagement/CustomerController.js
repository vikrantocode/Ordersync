const { fn, col, Op, or, QueryTypes } = require("sequelize");
const fs = require("fs");
const csv = require("csvtojson");
const _ = require("lodash-contrib");
const sequelize = require("../../config/database");
const Customer = require("../../models/Customer");
const Order = require("../../models/Order");
const PaymentDetail = require("../../models/PaymentDetail");

//? Create Customer
const addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    return res.status(200).json(customer);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError")
      return res.status(400).json({
        [error.name]: error.errors[0].message,
        field: Object.keys(error.fields)[0],
      });
    else if (error.name === "SequelizeDatabaseError")
      return res.status(400).json({ [error.name]: error.message });
    else if (error.name === "SequelizeValidationError")
      return res.status(400).json({
        [error.name]: error.errors[0].message,
        field: error.errors[0].path,
      });
    return res.status(500).json("Something Went Wrong!!!");
  }
};

//? Get Customers
const getCustomers = async (req, res) => {
  const orderBy = req.query.orderBy || "id";
  const orderManner = req.query.orderManner || "ASC";
  const pageSize = req.query.pageSize || 15;
  const searchItem = req.query.searchItem || "";
  const page = req.params.page || 1;
  try {
    const customers = await sequelize.query(
      `SELECT "customers"."id", "customers"."username", "customers"."firstName", "customers"."lastName", "customers"."email", "customers"."phone", "customers"."businessName", COUNT("orders"."id") AS "orderCount" FROM "customers" AS "customers" LEFT OUTER JOIN "orders" AS "orders" ON "customers"."id" = "orders"."customerId" WHERE ("customers"."username" ILIKE '%${searchItem}%' OR "customers"."firstName" ILIKE '%${searchItem}%' OR "customers"."lastName" ILIKE '%${searchItem}%' OR "customers"."email" ILIKE '%${searchItem}%' OR "customers"."businessName" ILIKE '%${searchItem}%' OR CAST("customers"."phone" AS VARCHAR) ILIKE '%${searchItem}%' OR CAST("customers"."id" AS VARCHAR) ILIKE '%${searchItem}%') GROUP BY "customers"."id" ORDER BY "${orderBy}" ${orderManner} LIMIT ${pageSize} OFFSET ${
        (page - 1) * pageSize
      };`,
      { type: QueryTypes.SELECT }
    );
    const count = await Customer.count({
      where: or(
        {
          username: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          firstName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          lastName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          businessName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        sequelize.where(
          sequelize.cast(sequelize.col("customers.id"), "varchar"),
          { [Op.iLike]: `%${searchItem}%` }
        ),
        sequelize.where(
          sequelize.cast(sequelize.col("customers.phone"), "varchar"),
          { [Op.iLike]: `%${searchItem}%` }
        )
      ),
    });
    if (!count) return res.status(404).send(`No Customers Found!!!`);
    return res.status(200).json({ customers, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json(`Something Went Wrong!!!`);
  }
};

//? Get All Customers
const getAllCustomers = async (req, res) => {
  const searchItem = req.query.searchItem || "";
  try {
    const customers = await Customer.findAll({
      attributes: ["id", "email", "firstName", "lastName", "username"],
      where: or(
        {
          username: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          firstName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          lastName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          businessName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        sequelize.where(
          sequelize.cast(sequelize.col("customers.id"), "varchar"),
          { [Op.iLike]: `%${searchItem}%` }
        )
      ),
    });
    return res.status(200).json(customers);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something Went Wrong!!!");
  }
};

//? Get Specific Customer
const getCustomer = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const customer = await Customer.findOne({
      where: { id },
      include: [
        {
          model: Order,
          attributes: [],
        },
      ],
      group: ["customers.id"],
    });
    if (!customer)
      return res.status(404).send(`There is No Customer with Provided Id!!!`);
    const orders = await Order.findAll({
      where: { customerId: id },
      attributes: ["id"],
      include: [
        {
          model: PaymentDetail,
          attributes: ["grandTotal"],
        },
      ],
    });
    return res.status(200).json({ customer, orders });
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Something Went Wrong!!!`);
  }
};

//? Helper Function to Rename Keys
const renameToDesiredFormat = (data) => {
  let result = [];
  data.map((item) => {
    result.push(
      _.renameKeys(item, {
        UserID: "id",
        UserName: "username",
        Email: "email",
        EmailCC: "emailCC",
        FirstName: "firstName",
        LastName: "lastName",
        Address1: "address1",
        Address2: "address2",
        City: "city",
        State: "state",
        Country: "country",
        ZipCode: "zipCode",
        Phone: "phone",
        BusinessName: "businessName",
        CreditTerm: "creditTerm",
        CreditLimit: "creditLimit",
        UserPhone1: "userPhone1",
        UserPhone2: "userPhone2",
        UserPhone3: "userPhone3",
      })
    );
  });
  return result;
};

//? API Handler to Import Customers from CSV File.
const importCustomers = async (req, res) => {
  const jsonCustomers = await csv().fromFile(req.file.path);
  const customers = renameToDesiredFormat(jsonCustomers);
  fs.unlink(req.file.path, async () => {
    const t = await sequelize.transaction();
    try {
      for (let customer of customers) {
        const count = await Customer.count({
          where: { email: customer.email },
        });
        console.log(count);
        if (!count) await Customer.create(customer, { transaction: t });
      }
      await t.commit();
      return res.status(201).send("Customers Imported Successfully.");
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).send("Something Went Wrong!!!");
    }
  });
};

//? API Handler to Update Customer Details
const updateCustomer = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await Customer.update(req.body, { where: { id } });
    return res.status(200).json("Customer Details Successfully Updated.");
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError")
      return res.status(400).json({
        [error.name]: error.errors[0].message,
        field: Object.keys(error.fields)[0],
      });
    else if (error.name === "SequelizeDatabaseError")
      return res.status(400).json({ [error.name]: error.message });
    return res.status(500).json(error);
  }
};

//? API Handler to Delete Customer(s)
const deleteCustomer = async (req, res) => {
  try {
    if (typeof req.query.id == "string") {
      await Customer.destroy({
        where: { id: parseInt(req.query.id) },
      });
    } else if (typeof req.query.id == "object") {
      for (let id of req.query.id) {
        await Customer.destroy({
          where: { id },
        });
      }
    }
    return res.status(200).send("Deleted Successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something Went Wrong!!!");
  }
};

//? Search Customers
const searchCustomers = async (req, res) => {
  const searchItem = req.query.searchItem || "";
  try {
    const customers = await Customer.findAll({
      attributes: ["id", "email", "firstName", "lastName", "phone"],
      where: or(
        {
          username: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          firstName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          lastName: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${searchItem}%`,
          },
        },
        sequelize.where(
          sequelize.cast(sequelize.col("customers.id"), "varchar"),
          { [Op.iLike]: `%${searchItem}%` }
        )
      ),
      limit: 20,
    });
    return res.status(200).json(customers);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something Went Wrong!!!");
  }
};

module.exports = {
  addCustomer: addCustomer,
  getCustomers: getCustomers,
  getAllCustomers: getAllCustomers,
  getCustomer: getCustomer,
  importCustomers: importCustomers,
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
  searchCustomers: searchCustomers,
};
