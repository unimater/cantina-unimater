import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DespesasModule } from './despesas/despesas.module';

@Module({
  imports: [DespesasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
