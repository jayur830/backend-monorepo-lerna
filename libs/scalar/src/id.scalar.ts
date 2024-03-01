import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('ID')
export class IDScalar implements CustomScalar<string | number, string> {
  description = 'ID';

  parseValue(value: string | number) {
    return `${value}`;
  }

  serialize(value: string) {
    return value;
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }
}
