import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserContext = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const [request] = context.getArgs();
    return request.user;
  },
);
