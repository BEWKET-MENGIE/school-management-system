import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

export interface BackupFileInfo {
  fileName: string;
  sizeInBytes: number;
  sizeInMB: string;
  createdAt: Date;
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups');

  constructor() {
    this.ensureBackupDirectoryExists();
  }

  private ensureBackupDirectoryExists(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // 1. Automated Cron Job (Runs every midnight at 00:00)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledBackup(): Promise<void> {
    this.logger.log('Starting scheduled daily database backup...');
    try {
      const result = await this.createBackup('scheduled');
      this.logger.log(
        `Scheduled backup created successfully: ${result.fileName}`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Scheduled backup failed: ${err.message}`);
    }
  }

  // 2. Generate a Database Dump (.sql file)
  async createBackup(prefix = 'manual'): Promise<BackupFileInfo> {
    this.ensureBackupDirectoryExists();

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new InternalServerErrorException(
        'DATABASE_URL environment variable is missing.',
      );
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `school-db-${prefix}-${timestamp}.sql`;
    const filePath = path.join(this.backupDir, fileName);

    const command = `pg_dump "${dbUrl}" > "${filePath}"`;

    try {
      await execAsync(command);
      const stats = fs.statSync(filePath);

      return {
        fileName,
        sizeInBytes: stats.size,
        sizeInMB: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
        createdAt: stats.birthtime,
      };
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      const err = error as Error;
      throw new InternalServerErrorException(
        `Database backup failed: ${err.message}`,
      );
    }
  }

  // 3. List All Saved Backups
  async listBackups(): Promise<BackupFileInfo[]> {
    this.ensureBackupDirectoryExists();

    const files = fs.readdirSync(this.backupDir);
    const sqlFiles = files.filter((file) => file.endsWith('.sql'));

    return sqlFiles
      .map((fileName) => {
        const filePath = path.join(this.backupDir, fileName);
        const stats = fs.statSync(filePath);
        return {
          fileName,
          sizeInBytes: stats.size,
          sizeInMB: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // 4. Get File Path for Downloading
  getBackupFilePath(fileName: string): string {
    const safeFileName = path.basename(fileName);
    const filePath = path.join(this.backupDir, safeFileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Backup file '${safeFileName}' not found.`);
    }

    return filePath;
  }

  // 5. Restore Database from a SQL File
  async restoreDatabase(filePath: string): Promise<{ message: string }> {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new InternalServerErrorException(
        'DATABASE_URL environment variable is missing.',
      );
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(
        'Specified backup file for recovery does not exist.',
      );
    }

    // Execute psql command to restore the database
    const command = `psql "${dbUrl}" < "${filePath}"`;

    try {
      this.logger.warn(`Initiating database restoration from: ${filePath}`);
      await execAsync(command);
      this.logger.log('Database restoration completed successfully.');
      return { message: 'Database restored successfully.' };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Database restore failed: ${err.message}`);
      throw new InternalServerErrorException(
        `Database restoration failed: ${err.message}`,
      );
    }
  }

  // 6. Delete a Backup File
  deleteBackup(fileName: string): { message: string } {
    const filePath = this.getBackupFilePath(fileName);
    fs.unlinkSync(filePath);
    return { message: `Backup file '${fileName}' deleted successfully.` };
  }
}
