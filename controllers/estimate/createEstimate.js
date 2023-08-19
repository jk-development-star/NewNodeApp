"use tsrict";
const fs = require("fs");
const PDFDocument = require("pdfkit");
const actionItemDriver = require("../../drivers/actionItems/actionItems.driver");
const createInvoice = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  data.action_items.forEach(async (id) => {
    let res = await actionItemDriver.getSingleActionItems(id);
    const details = {
      action_item_name: res.action_item_name,
      description: res.description,
    };
    console.log("details", details);
  });

  const invoice = {
    shipping: {
      name: "John Doe",
      address: "1234 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: 94111,
    },
    items: [],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234,
  };
  let doc = new PDFDocument({ margin: 50 });

  generateHeader(doc, invoice); // Invoke `generateHeader` function.
  generateCustomerInformation(doc, invoice); // Invoke `generateCustomerInformation` function.
  generateInvoiceTable(doc, invoice); // Invoke `generateInvoiceTable` function.
  generateFooter(doc, invoice); // Invoke `generateFooter` function.

  doc.pipe(fs.createWriteStream(`./public/estimate/TestDocument-${id}.pdf`));

  doc.pipe(res);
  doc.end();
};
const generateHeader = async (doc) => {
  await doc
    .image("public/newAssets/dist/img/AdminLTELogo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("ACME Inc.", 110, 57)
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
};

const generateFooter = async (doc) => {
  await doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
};

const generateCustomerInformation = async (doc, invoice) => {
  const shipping = invoice.shipping;

  await doc
    .text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
    .text(`Invoice Date: ${new Date().getUTCDate()}`, 50, 215)
    .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)

    .text(shipping.name, 300, 200)
    .text(shipping.address, 300, 215)
    .text(`${shipping.city}, ${shipping.state}, ${shipping.country}`, 300, 130)
    .moveDown();
};

const generateTableRow = async (doc, y, c1, c2, c3, c4, c5) => {
  await doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
};

const generateInvoiceTable = async (doc, invoice) => {
  let i,
    invoiceTableTop = 330;

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    console.log("item", invoice.items);
    // const position = invoiceTableTop + (i + 1) * 30;
    // generateTableRow(
    //   doc,
    //   position,
    //   item.owner_name,
    //   item.description,
    //   item.amount / item.quantity,
    //   item.quantity,
    //   item.amount
    // );
  }
};

module.exports = {
  createInvoice,
};
