import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transform';
import { validate } from 'class-validator';
import { ValidationException } from '../exeption/validation.exeption';

@Injectable()
export class ValidationPipe implements PipeTransform {
 async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj =  plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      let messages  = errors.map((error: any) => error.message);
       throw new ValidationException(messages);
    }

    return value;
  }
}
