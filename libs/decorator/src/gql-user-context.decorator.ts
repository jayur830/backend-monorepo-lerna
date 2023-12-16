import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlUserContext = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const { user } = GqlExecutionContext.create(context).getContext();
    return user;
  },
);
