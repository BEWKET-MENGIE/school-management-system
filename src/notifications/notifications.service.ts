import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  // 🛠️ FIX: Removed 'async' to fix the @typescript-eslint/require-await error
  sendEnrollmentWelcome(studentId: string): void {
    console.log(`Sending welcome email and SMS to student: ${studentId}`);
    // Future SMS/Email logic goes here
  }
}
