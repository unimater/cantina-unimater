import { Test, TestingModule } from '@nestjs/testing';
import { FormasPagamentoService } from './formas-pagamento.service';

describe('FormasPagamentoService', () => {
  let service: FormasPagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormasPagamentoService],
    }).compile();

    service = module.get<FormasPagamentoService>(FormasPagamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
