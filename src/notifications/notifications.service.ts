import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendEnrollmentWelcome(data: { email: string; name: string; admissionNumber?: string }) {
    console.log(`[Notification] Welcome email sent to ${data.email} for ${data.name} (Admission: ${data.admissionNumber})`);
    return true;
  }
}