import path from 'path';
import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

@Injectable()
export class GoogleWorkspaceService {
  constructor() {}

  // Return Google Workspace service if authenticate successfully
  async authenticate() {
    const auth = new google.auth.GoogleAuth({
      keyFile: '',
      scopes: SCOPES,
    });

    return google.drive({ version: 'v3', auth });
  }
}
