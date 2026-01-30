import { Module } from '@nestjs/common';
import { CantineService } from './cantine.service';
import { CantineController } from './cantine.controller';

@Module({
  controllers: [CantineController],
  providers: [CantineService],
  exports: [CantineService],
})
export class CantineModule {}
