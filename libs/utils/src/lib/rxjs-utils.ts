import { OperatorFunction, pipe } from "rxjs";
import { filter, shareReplay } from 'rxjs/operators';

export const truthy = <T>() => pipe(filter(x => x != null) as OperatorFunction<T | null | undefined, T>);
export const falshy = <T>() => pipe(filter((a: T) => !a));
export const shareLatest = <T>() => pipe(shareReplay<T>({ refCount: true, bufferSize: 1 }));
