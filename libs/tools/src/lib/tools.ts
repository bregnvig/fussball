import { TrackByFunction } from '@angular/core';
export type PropertyGetterFn<T> = (obj: T) => string | number;

export const trackByProperty = <T>(propGetterFnOrString: PropertyGetterFn<T> | string): TrackByFunction<T> => (_: number, obj) => typeof propGetterFnOrString === 'string' ? obj[propGetterFnOrString] : propGetterFnOrString(obj);
export const trackById = trackByProperty(<T extends { id: string | number; }>(obj: T) => obj.id);
