import { CustomScalar, Scalar } from '@nestjs/graphql';
import * as dayjs from 'dayjs';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime')
export class DateTimeScalar implements CustomScalar<string, dayjs.Dayjs> {
  format = 'YYYY-MM-DD HH:mm:ss';
  description = `${this.format} 형식의 문자열`;

  parseValue(value: string) {
    return dayjs(value);
  }

  serialize(value: dayjs.Dayjs) {
    return value.format(this.format);
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }
}
