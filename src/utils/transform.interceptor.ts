import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../users/entities/user.entity';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((el: User) => {
            return transformElement(el);
          });
        } else {
          return transformElement(data);
        }
      }),
    );
  }
}

function transformElement(element: User | any) {
  const copy = { ...element };
  delete copy.password;
  copy.createdAt = +copy.createdAt;
  copy.updatedAt = +copy.updatedAt;

  return copy;
}
