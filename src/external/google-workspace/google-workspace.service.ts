import * as path from 'path';
import { drive_v3, google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'shared/constants/env-key.constant';

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const enum MIME_TYPES {
  FOLDER = 'application/vnd.google-apps.folder',
  SPREADSHEET = 'application/vnd.google-apps.spreadsheet',
}

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

      const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: SCOPES,
      });

      this.service = google.drive({ version: 'v3', auth });
    }

    return this.service;
  }

  // Test function
  async listFile() {
    try {
      const service = await this.getGoogleWorkspaceService();
      const res = await service.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
      });
      console.log({ res: res.data.files });

      return res.data.files;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // Test function
  async uploadFile() {
    try {
      const service = await this.getGoogleWorkspaceService();

      const media = {
        mimeType: 'text/csv',
        body: 'test\n\ntest',
      };

      const file = await service.files.create({
        requestBody: {
          name: 'My Report',
          parents: ['19vkVhfepqeRjcKuaoFP-YyqL5MgbkdhT'],
          mimeType: 'application/vnd.google-apps.spreadsheet',
        },
        media: media,
      });
      console.log({ file });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
