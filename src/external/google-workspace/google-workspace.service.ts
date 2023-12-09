import * as path from 'path';
import { drive_v3, google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'shared/constants/env-key.constant';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

@Injectable()
export class GoogleWorkspaceService {
  private service: drive_v3.Drive;
  constructor(private configService: ConfigService) {}

  // Return Google Workspace service if authenticate successfully
  async getGoogleWorkspaceService() {
    if (!this.service) {
      const keyFilePath = path.join(
        process.cwd(),
        this.configService.get<string>(
          EnvKey.GOOGLE_WORKSPACE_CREDENTIALS_FILE_NAME,
        ),
      );

    return google.drive({ version: 'v3', auth });
  }
}
