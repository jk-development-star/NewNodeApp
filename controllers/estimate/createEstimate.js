const fs = require("fs");
const PDFDocument = require("pdfkit");
const actionItemTaskDriver = require("../../drivers/associations/actionItemTasks.driver");
const sendMail = require("../../config/email.config");
const currencyFormat = require("../../helpers/common");
const estimateDriver = require("../../drivers/estimate/estimate.driver");
const path = require("path");

const createInvoice = async (req, res) => {
  const details = [];
  const { id } = req.params;
  const value = req.body;
  for (let id of value.action_items) {
    const taskDetails = [];
    let resAction = await actionItemTaskDriver.getActionItemTasks(id);
    if (resAction.action_item_id._id.equals(id)) {
      actionItem = {
        name: resAction.action_item_id.action_item_name,
        description: resAction.action_item_id.action_item_description,
        tasks: taskDetails,
      };
      for (let task of resAction.tasks_id) {
        taskItem = {
          name: task.task_name,
        };
        taskDetails.push(taskItem);
      }
      details.push(actionItem);
    }
  }
  const estimate = {
    ownerDetail: {
      name: value.owner_name,
      address: value.address,
    },
    actionItems: details,
    estimateAmont: Number(value.estimate_cost.replace(/[^0-9\.-]+/g, "")),
    paid: 0,
    estimateNumber: value.lead_id,
  };

  const { generatedBy, lead_id, ...data } = value;
  data["generatedBy"] = req.userId;
  data["lead_id"] = id;
  data["pdf_path"] = path.join("public", `/estimate/TestDocument-${id}.pdf`);
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc, estimate); // Invoke `generateHeader` function.
  generateCustomerInformation(doc, estimate); // Invoke `generateCustomerInformation` function.
  generateInvoiceTable(doc, estimate); // Invoke `generateInvoiceTable` function.
  generateFooter(doc, estimate); // Invoke `generateFooter` function.
  doc
    .pipe(
      fs.createWriteStream(
        path.join("public", `/estimate/TestDocument-${id}.pdf`)
      )
    )
    .on(
      "finish",
      async () =>
        await estimateDriver.createEstimate(data).then((result) => {
          if (result) {
            res.redirect("back");
            setTimeout(() => {
              const text = `Hi ${estimate.ownerDetail.name}, We have successfully generated the estimate for your Lead!!
            Thanks!! `;
              sendMail("jitendra@yopmail.com", "Estimate Generation", text),
                req.flash("success", "Estimate Generated Successfully");
            }, 3000);
          }
        })
    );
  // Mark the end of file
  doc.end();
};

const generateHeader = async (doc) => {
  await doc
    .image("public/newAssets/dist/img/AdminLTELogo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("MRB Inc.", 110, 57)
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
};

function generateCustomerInformation(doc, estimate) {
  doc.fillColor("#444444").fontSize(20).text("Estimate", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Estimate Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(estimate.estimateNumber, 150, customerInformationTop)
    .font("Helvetica")
    .text("Estimate Date:", 50, customerInformationTop + 15)
    .text(new Date().toDateString(), 150, customerInformationTop + 15)
    .text("Estimate Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(estimate.estimateAmont),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(estimate.ownerDetail.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(estimate.ownerDetail.address, 300, customerInformationTop + 15)
    .moveDown();

  generateHr(doc, 252);
}
const generateFooter = async (doc) => {
  await doc
    .fontSize(10)
    .text(
      "This is auto-generated Estimate for the Lead work. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
};

const generateTableRow = async (doc, y, c1, c2, c3, c4, c5) => {
  await doc
    .fontSize(10)
    .text(c1, 50, y, { width: 90 })
    .text(c2, 150, y)
    .text(c3, 200, y, { width: 90, align: "right" })
    .text(c4, 270, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
};

function generateInvoiceTable(doc, estimate) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Items",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < estimate.actionItems.length; i++) {
    const item = estimate.actionItems[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      item.description,
      //formatCurrency(item.amount / item.quantity),
      item.quantity
      //formatCurrency(item.amount)
    );
    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Estimate Cost",
    "",
    formatCurrency(estimate.estimateAmont)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(estimate.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(estimate.estimateAmont - estimate.paid)
  );
  doc.font("Helvetica");
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(number) {
  return currencyFormat.indianFormat(number);
}

module.exports = {
  createInvoice,
};
