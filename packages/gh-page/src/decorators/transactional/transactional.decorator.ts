import { SetMetadata } from '@nestjs/common';

export const IS_TRANSACTIONAL = Symbol('IS_TRANSACTIONAL');
export const Transactional = () => SetMetadata(IS_TRANSACTIONAL, true);
