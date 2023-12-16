import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('foo')
export class FooController {
  @Get('/find')
  find(): string {
    return 'get';
  }

  @Post('/insert')
  insert(@Param() name: string): void {
    console.log('insert name:', name);
  }

  @Put('/update')
  update(@Body() age: number): void {
    console.log('update age:', age);
  }

  @Delete('/remove')
  remove(@Param() id: string): string {
    console.log('delete id:', id);
    return 'delete';
  }
}
