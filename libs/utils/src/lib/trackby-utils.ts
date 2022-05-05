import { TrackByFunction } from '@angular/core';
export type PropertyGetterFn<T> = (obj: T) => string | number;

export const trackByProperty = <T>(propGetterFnOrString: PropertyGetterFn<T> | keyof T): TrackByFunction<T> => (_: number, obj) => typeof propGetterFnOrString === 'function' ? propGetterFnOrString(obj) : obj[propGetterFnOrString];
export const trackById = trackByProperty(<T extends { id: string | number; }>(obj: T) => obj.id);
