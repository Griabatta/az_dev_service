// src/repositories/base.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/logic/prisma.service';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(protected readonly prisma: PrismaService) {}

  abstract create(data: any): Promise<T>;
  abstract findById(id: number): Promise<T | null>;
  abstract update(id: number, data: any): Promise<T>;
  abstract delete(id: number): Promise<void>;
}