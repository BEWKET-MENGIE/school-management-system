import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as express from 'express'; // 1. Namespace import for express
import { BackupService } from './backup.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Controller('admin/backup')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  async createBackup() {
    return this.backupService.createBackup('manual');
  }

  @Get('list')
  async listBackups() {
    return this.backupService.listBackups();
  }

  @Get('download/:fileName')
  downloadBackup(
    @Param('fileName') fileName: string,
    @Res() res: express.Response, // 2. Updated parameter type
  ) {
    const filePath = this.backupService.getBackupFilePath(fileName);
    return res.download(filePath, fileName);
  }

  @Post('restore/:fileName')
  async restoreFromExistingFile(@Param('fileName') fileName: string) {
    const filePath = this.backupService.getBackupFilePath(fileName);
    return this.backupService.restoreDatabase(filePath);
  }

  @Post('upload-and-restore')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'backups', 'temp'),
        filename: (req, file, cb) => {
          const uniqueName = `upload-restore-${Date.now()}.sql`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.endsWith('.sql')) {
          return cb(
            new BadRequestException('Only .sql backup files are allowed.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadAndRestore(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Please select a .sql file to upload.');
    }

    try {
      const result = await this.backupService.restoreDatabase(file.path);
      return result;
    } finally {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }

  @Delete(':fileName')
  deleteBackup(@Param('fileName') fileName: string) {
    return this.backupService.deleteBackup(fileName);
  }
}
