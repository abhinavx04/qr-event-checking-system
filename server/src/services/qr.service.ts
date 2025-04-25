import QRCode from 'qrcode';
import crypto from 'crypto';

export class QRService {
  private static generateUniqueCode(eventId: string, timestamp: number): string {
    const data = `${eventId}-${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  static async generateEventQR(eventId: string, eventDate: Date): Promise<string> {
    try {
      const timestamp = new Date().getTime();
      const uniqueCode = this.generateUniqueCode(eventId, timestamp);
      
      const qrData = {
        eventId,
        code: uniqueCode,
        timestamp,
        expiryTime: eventDate.getTime()
      };

      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      return qrCodeDataUrl;
    } catch (error) {
      throw new Error('Error generating QR code');
    }
  }

  static async verifyQRCode(qrData: string, eventId: string): Promise<boolean> {
    try {
      const parsedData = JSON.parse(qrData);
      
      // Verify if QR code is for the correct event
      if (parsedData.eventId !== eventId) {
        return false;
      }

      // Check if QR code has expired
      if (parsedData.expiryTime < new Date().getTime()) {
        return false;
      }

      // Verify the unique code
      const generatedCode = this.generateUniqueCode(
        parsedData.eventId,
        parsedData.timestamp
      );

      return generatedCode === parsedData.code;
    } catch (error) {
      return false;
    }
  }
}