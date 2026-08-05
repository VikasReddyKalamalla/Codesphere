const PDFDocument = require('pdfkit');

/**
 * Generates a clean PDF Tax Invoice as a Buffer or streams to response
 * @param {Object} invoiceData - Invoice document data populated with User and Subscription
 * @returns {Promise<Buffer>}
 */
const generateInvoicePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const {
        invoiceNumber = `INV-${Date.now()}`,
        createdAt = new Date(),
        user = {},
        planName = 'CodeSphere Plan',
        billingCycle = 'Monthly',
        amount = 0,
        tax = 0,
        discount = 0,
        total = 0,
        paymentMethod = 'Online Payment',
        status = 'PAID',
      } = invoiceData;

      // Primary Palette
      const primaryColor = '#04AA6D';
      const textColor    = '#1e293b';
      const lightBg      = '#f8fafc';
      const borderLine   = '#e2e8f0';

      // Header Branding
      doc
        .fillColor(primaryColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('CODESPHERE', 50, 45);

      doc
        .fillColor('#64748b')
        .fontSize(9)
        .font('Helvetica')
        .text('The Real-Time Developer & Coding Ecosystem', 50, 70)
        .text('Codesphere Technologies Inc.', 50, 82)
        .text('GSTIN: 36ABCDE1234F1Z5', 50, 94)
        .text('support@codesphere.dev | https://codesphere.dev', 50, 106);

      // Invoice Title & Meta Card
      doc
        .fillColor(primaryColor)
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('TAX INVOICE', 380, 45, { align: 'right' });

      doc
        .fillColor(textColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text(`Invoice No: ${invoiceNumber}`, 380, 72, { align: 'right' })
        .font('Helvetica')
        .text(`Date: ${new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 380, 86, { align: 'right' })
        .text(`Status: ${status.toUpperCase()}`, 380, 100, { align: 'right' })
        .text(`Payment: ${paymentMethod.toUpperCase()}`, 380, 114, { align: 'right' });

      // Horizontal Divider
      doc
        .moveTo(50, 135)
        .lineTo(545, 135)
        .strokeColor(borderLine)
        .strokeWidth(1)
        .stroke();

      // Billed To Box
      doc
        .rect(50, 150, 495, 65)
        .fillAndStroke(lightBg, borderLine);

      doc
        .fillColor('#0f172a')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('BILLED TO:', 65, 160)
        .font('Helvetica')
        .fontSize(9)
        .text(`Name:  ${user.fullName || user.name || 'Valued Customer'}`, 65, 175)
        .text(`Email: ${user.email || 'customer@codesphere.dev'}`, 65, 189);

      // Table Headers
      const tableTop = 240;
      doc
        .rect(50, tableTop, 495, 25)
        .fill(primaryColor);

      doc
        .fillColor('#ffffff')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('DESCRIPTION', 60, tableTop + 8)
        .text('CYCLE', 260, tableTop + 8)
        .text('BASE (₹)', 360, tableTop + 8, { align: 'right' })
        .text('TOTAL (₹)', 460, tableTop + 8, { align: 'right' });

      // Table Row
      const itemY = tableTop + 35;
      doc
        .fillColor(textColor)
        .fontSize(9)
        .font('Helvetica')
        .text(`CodeSphere ${planName} Subscription`, 60, itemY)
        .text(billingCycle.toUpperCase(), 260, itemY)
        .text(`₹${amount.toLocaleString()}`, 360, itemY, { align: 'right' })
        .text(`₹${amount.toLocaleString()}`, 460, itemY, { align: 'right' });

      doc
        .moveTo(50, itemY + 20)
        .lineTo(545, itemY + 20)
        .strokeColor(borderLine)
        .stroke();

      // Summary Calculations Box
      const summaryY = itemY + 35;
      const rightCol = 360;
      const valueCol = 460;

      doc
        .font('Helvetica')
        .fontSize(9)
        .text('Subtotal:', rightCol, summaryY, { align: 'right' })
        .text(`₹${amount.toLocaleString()}`, valueCol, summaryY, { align: 'right' });

      if (discount > 0) {
        doc
          .text('Discount (Coupon):', rightCol, summaryY + 16, { align: 'right' })
          .text(`- ₹${discount.toLocaleString()}`, valueCol, summaryY + 16, { align: 'right' });
      }

      const taxY = discount > 0 ? summaryY + 32 : summaryY + 16;
      doc
        .text('GST / Tax (18%):', rightCol, taxY, { align: 'right' })
        .text(`₹${tax.toLocaleString()}`, valueCol, taxY, { align: 'right' });

      // Total Highlight Bar
      const grandTotalY = taxY + 20;
      doc
        .rect(340, grandTotalY, 205, 26)
        .fill('#0f172a');

      doc
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('TOTAL PAID:', 350, grandTotalY + 8)
        .text(`₹${total.toLocaleString()}`, 450, grandTotalY + 8, { align: 'right' });

      // Footer Terms
      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .font('Helvetica')
        .text('This is a computer-generated tax invoice and requires no physical signature.', 50, 720, { align: 'center' })
        .text('Thank you for being a part of the CodeSphere ecosystem!', 50, 735, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateInvoicePDF };
