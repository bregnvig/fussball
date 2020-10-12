import { filter, shareReplay } from 'rxjs/operators';
import { pipe } from "rxjs";

export const truthy = <T>() => pipe(filter((a: T) => !!a));
export const falshy = <T>() => pipe(filter((a: T) => !a));
export const shareLatest = <T>() => pipe(shareReplay<T>({ refCount: true, bufferSize: 1 }));
