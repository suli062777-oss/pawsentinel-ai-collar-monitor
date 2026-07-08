import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CompositeStoreService } from './composite-store.service';
import { InMemoryStoreService } from './in-memory-store.service';
import { PAWROOM_STORE } from './pawroom-store.port';
import { PrismaStoreService } from './prisma-store.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    InMemoryStoreService,
    PrismaStoreService,
    CompositeStoreService,
    {
      provide: PAWROOM_STORE,
      useExisting: CompositeStoreService,
    },
  ],
  exports: [PAWROOM_STORE, InMemoryStoreService, CompositeStoreService, PrismaStoreService],
})
export class StoreModule {}