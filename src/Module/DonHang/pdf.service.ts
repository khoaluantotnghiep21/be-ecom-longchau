import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class PDFService {
  private readonly uploadsDir: string;
  
  constructor(private readonly configService: ConfigService) {
    // Define the directory where PDF invoices will be stored
    this.uploadsDir = path.join(__dirname, '../../../uploads/invoices');
    
    // Ensure the directory exists
    fs.ensureDirSync(this.uploadsDir);
  }

  /**
   * Generate an invoice PDF for an order
   * @param orderData Order data containing all information needed for the invoice
   * @returns Path to the generated PDF file
   */
  async generateInvoice(orderData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Extract the necessary data from the order
        // The SQL query in getOrderDetailsByMadonhang returns properties like:
        // madonhang, hoten, machinhanh, ngaymuahang, sodienthoai, diachi, thanhtien, tongtien, 
        // giamgiatructiep, phivanchuyen, phuongthucthanhtoan, mavoucher, hinhthucnhanhang, trangthai,
        // and sanpham (which is an array of products with tensanpham, donvitinh, soluong, giaban, url)
        const { 
          madonhang, 
          ngaymuahang, 
          hoten, 
          sodienthoai, 
          diachi, 
          thanhtien, 
          tongtien,
          giamgiatructiep,
          phivanchuyen,
          phuongthucthanhtoan,
          hinhthucnhanhang,
          machinhanh,
          trangthai,
          sanpham 
        } = orderData;
        
        console.log('Generating invoice for order:', madonhang);
        console.log('Products:', sanpham);
        
        // Create a unique filename for the invoice
        const filename = `invoice_${madonhang}_${Date.now()}.pdf`;
        const filePath = path.join(this.uploadsDir, filename);
        
        // Create a new PDF document
        const doc = new PDFKit({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        
        // Pipe the PDF to the file
        doc.pipe(stream);
        
        // Add content to the PDF
        this.addHeader(doc);
        this.addCustomerInfo(doc, { 
          hoten, 
          sodienthoai, 
          diachi, 
          madonhang, 
          ngaymuahang, 
          phuongthucthanhtoan,
          hinhthucnhanhang,
          machinhanh,
          trangthai
        });
        
        // Handle the case where sanpham might be a string instead of an array (due to JSON stringification)
        const productsArray = typeof sanpham === 'string' ? JSON.parse(sanpham) : sanpham;
        this.addInvoiceTable(doc, productsArray);
        
        this.addTotals(doc, {
          tongtien: parseFloat(tongtien) || 0,
          giamgiatructiep: parseFloat(giamgiatructiep) || 0,
          phivanchuyen: parseFloat(phivanchuyen) || 0,
          thanhtien: parseFloat(thanhtien) || 0,
          sanpham: productsArray
        });
        
        this.addFooter(doc);
        
        // Finalize the PDF and end the stream
        doc.end();
        
        stream.on('finish', () => {
          console.log('Invoice generated successfully:', filePath);
          resolve(filePath);
        });
        
        stream.on('error', (error) => {
          console.error('Error generating invoice:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Exception in generateInvoice:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Add the company header to the invoice
   * @param doc PDF document
   */
  private addHeader(doc: PDFKit.PDFDocument): void {
    doc
      .registerFont('NotoSans', path.join(__dirname, '../../../fonts/NotoSans-Regular.ttf'))
      .registerFont('NotoSansBold', path.join(__dirname, '../../../fonts/NotoSans-Bold.ttf'))
      .font('NotoSansBold')
      .fillColor('#0066cc')
      .fontSize(22)
      .text('FPT Long Châu', 50, 45, { align: 'left' })
      .font('NotoSans')
      .fontSize(10)
      .text('Nhà thuốc FPT Long Châu', 50, 70, { align: 'left' })
      .text('Địa chỉ: Số 123 Nguyễn Văn Linh, Q.7, TP.HCM', 50, 85, { align: 'left' })
      .text('Hotline: 1800 1111', 50, 100, { align: 'left' })
      .text('Email: lienhe@fptlongchau.com', 50, 115, { align: 'left' });
  }

  /**
   * Add customer information to the invoice
   * @param doc PDF document
   * @param customerInfo Customer information
   */
  private addCustomerInfo(doc: PDFKit.PDFDocument, customerInfo: any): void {
    const { hoten, sodienthoai, diachi, madonhang, ngaymuahang, phuongthucthanhtoan } = customerInfo;
    
    // Format the date nicely
    const date = new Date(ngaymuahang);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    doc
      .fillColor('#000000')
      .font('NotoSansBold')
      .fontSize(16)
      .text('HÓA ĐƠN MUA HÀNG', 50, 150, { align: 'center' });

    // Left column - Customer info
    doc
      .font('NotoSansBold')
      .fontSize(11)
      .text('Thông tin khách hàng:', 50, 180);
      
    doc
      .font('NotoSans')
      .fontSize(10)
      .text(`Họ tên: ${hoten || 'Khách lẻ'}`, 50, 200)
      .text(`Số điện thoại: ${sodienthoai || '--'}`, 50, 215)
      .text(`Địa chỉ: ${diachi || '--'}`, 50, 230);

    // Right column - Order info
    doc
      .font('NotoSansBold')
      .fontSize(11)
      .text('Thông tin đơn hàng:', 300, 180);
      
    doc
      .font('NotoSans')
      .fontSize(10)
      .text(`Mã đơn hàng: ${madonhang}`, 300, 200)
      .text(`Ngày mua hàng: ${formattedDate}`, 300, 215)
      .text(`Phương thức thanh toán: ${phuongthucthanhtoan}`, 300, 230);
  }

  /**
   * Add a table with the ordered products
   * @param doc PDF document
   * @param products Products in the order
   */
  private addInvoiceTable(doc: PDFKit.PDFDocument, products: any[]): void {
    // Define table dimensions
    const tableTop = 270;
    const tableLeft = 50;
    const tableWidth = 500;
    
    // Add table background
    doc
      .rect(tableLeft - 5, tableTop - 5, tableWidth + 10, 30)
      .fillColor('#f6f6f6')
      .fill();
      
    // Add column headers with bold font
    doc
      .fillColor('#000000')
      .font('NotoSansBold')
      .fontSize(10);
    
    this.generateTableRow(
      doc,
      tableTop,
      'STT',
      'Tên sản phẩm',
      'Số lượng',
      'Đơn giá (VNĐ)',
      'Thành tiền (VNĐ)'
    );
    
    // Add horizontal line
    doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(tableLeft, tableTop + 20)
      .lineTo(tableLeft + tableWidth, tableTop + 20)
      .stroke();
    
    // Switch back to regular font for data rows
    doc.font('NotoSans');
    
    // Add product rows
    let position = tableTop + 30;
    let rowHeight = 25; // Increase row height for better readability
    
    products.forEach((product, i) => {
      // Add zebra striping for better readability
      if (i % 2 === 1) {
        doc
          .rect(tableLeft - 5, position - 5, tableWidth + 10, rowHeight)
          .fillColor('#f9f9f9')
          .fill()
          .fillColor('#000000');
      }
      
      this.generateTableRow(
        doc,
        position,
        (i + 1).toString(),
        product.tensanpham,
        product.soluong.toString(),
        this.formatCurrency(product.giaban),
        this.formatCurrency(product.giaban * product.soluong)
      );
      
      position += rowHeight;
      
      // Add a light line between rows
      doc
        .strokeColor('#DDDDDD')
        .lineWidth(0.5)
        .moveTo(tableLeft, position - 5)
        .lineTo(tableLeft + tableWidth, position - 5)
        .stroke();
    });
  }

  /**
   * Add total amounts to the invoice
   * @param doc PDF document
   * @param orderData Order data with financial information
   */
  private addTotals(doc: PDFKit.PDFDocument, orderData: any): void {
    const { tongtien, giamgiatructiep, phivanchuyen, thanhtien } = orderData;
    
    // Calculate the position based on where the product table ends
    const position = 270 + 30 + (orderData.sanpham.length * 25) + 30;
    
    // Add a background for the totals section
    doc
      .rect(350 - 5, position - 5, 205, 100)
      .fillColor('#f8f8f8')
      .fill()
      .fillColor('#000000');
    
    // Regular font for line items
    doc
      .font('NotoSans')
      .fontSize(10);
    
    // Line item: Tổng tiền hàng
    doc
      .text('Tổng tiền hàng:', 350, position)
      .text(this.formatCurrency(tongtien) + ' VNĐ', 500, position, { align: 'right' });
    
    // Line item: Giảm giá trực tiếp
    doc
      .text('Giảm giá trực tiếp:', 350, position + 20)
      .text('-' + this.formatCurrency(giamgiatructiep) + ' VNĐ', 500, position + 20, { align: 'right' });
    
    // Line item: Phí vận chuyển
    doc
      .text('Phí vận chuyển:', 350, position + 40)
      .text(this.formatCurrency(phivanchuyen) + ' VNĐ', 500, position + 40, { align: 'right' });
    
    // Add a line before the total
    doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(350, position + 55)
      .lineTo(550, position + 55)
      .stroke();

    // Add the total amount in bold
    doc
      .font('NotoSansBold')
      .fontSize(12)
      .text('Thành tiền:', 350, position + 65)
      .text(this.formatCurrency(thanhtien) + ' VNĐ', 500, position + 65, { align: 'right' });
  }
  
  /**
   * Add footer to the invoice
   * @param doc PDF document
   */
  private addFooter(doc: PDFKit.PDFDocument): void {
    // Format the date nicely
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Add a horizontal line
    doc
      .strokeColor('#CCCCCC')
      .lineWidth(1)
      .moveTo(50, 690)
      .lineTo(550, 690)
      .stroke();
    
    // Thank you message
    doc
      .fontSize(10)
      .font('NotoSans')
      .fillColor('#333333')
      .text(
        'Cảm ơn Quý khách đã mua hàng tại FPT Long Châu.',
        50,
        700,
        { align: 'center' }
      )
      .text(
        'Mọi thắc mắc xin vui lòng liên hệ hotline: 1800 1111',
        50,
        715,
        { align: 'center' }
      );
      
    // Add the current date, time, and page number
   
  }
  
  /**
   * Generate a table row in the PDF
   * @param doc PDF document
   * @param y Y position
   * @param col1 Column 1 content
   * @param col2 Column 2 content
   * @param col3 Column 3 content
   * @param col4 Column 4 content
   * @param col5 Column 5 content
   */
  private generateTableRow(
    doc: PDFKit.PDFDocument, 
    y: number, 
    col1: string, 
    col2: string, 
    col3: string, 
    col4: string, 
    col5: string
  ): void {
    // Truncate long product names and add ellipsis if needed
    const maxLength = 35;
    let displayCol2 = col2;
    if (col2.length > maxLength) {
      displayCol2 = col2.substring(0, maxLength) + '...';
    }
    
    // STT column (ID)
    doc
      .fontSize(10)
      .text(col1, 50, y, { width: 30, align: 'center' });
      
    // Tên sản phẩm column
    doc
      .text(displayCol2, 90, y, { width: 200, align: 'left' });
      
    // Số lượng column
    doc
      .text(col3, 300, y, { width: 50, align: 'center' });
      
    // Đơn giá column
    doc
      .text(col4, 350, y, { width: 90, align: 'right' });
      
    // Thành tiền column
    doc
      .text(col5, 450, y, { width: 100, align: 'right' });
  }
  
  /**
   * Format a number as a currency string with thousand separators
   * @param value Number to format
   * @returns Formatted currency string
   */
  private formatCurrency(value: number): string {
    if (isNaN(value)) return '0';
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
