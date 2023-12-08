import { Module } from '@nestjs/common';
import { GoogleWorkspaceService } from './google-workspace.service';

@Module({
  providers: [GoogleWorkspaceService],
})
export class GoogleWorkspaceModule {}
