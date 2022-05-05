import { OperatorFunction, pipe } from "rxjs";
import { filter, shareReplay } from 'rxjs/operators';
import { nullish } from "./utils.model";

export const truthy = <T>() => pipe(filter(x => !!x) as OperatorFunction<T | nullish, T>);
export const falsy = <T>() => pipe(filter(x => !x) as unknown as OperatorFunction<T | nullish, T extends number ? (nullish | 0) : T extends string ? (nullish | '') : nullish>);
export const shareLatest = <T>() => pipe(shareReplay<T>({ refCount: true, bufferSize: 1 }));
