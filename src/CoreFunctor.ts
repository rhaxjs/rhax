import { ExtensibleFunction } from './ExtensibleFunction';
import { Functor } from './Functor';
import { NumberFunctor } from './NumberFunctor';
import { ObjectFunctor } from './ObjectFunctor';


export class CoreFunctor<T> extends ExtensibleFunction<[], T> {

  public readonly value: T;

  static of<T>(value: T) {
    return new CoreFunctor(value) as Functor<T>
  }

  constructor(value: T) {
    //When called, we want to return the Functor's value.
    super(function (this: CoreFunctor<T>) { return this.value });

    this.value = value;
    if (typeof value === 'number') {
      Object.assign(this, NumberFunctor.prototype)
    };
    if (typeof value === 'object') {
      Object.assign(this, ObjectFunctor.prototype);
    }
  }

  map<S>(fn: (value: T) => S): Functor<S> {
    return CoreFunctor.of(fn(this.value))
  }

  also(fn: (value: T) => void): this {
    fn(this.value);
    return this;
  }

  default<S>(fallback: S): Functor<NonNullable<T> | S> {
    return CoreFunctor.of(this.value ?? fallback);
  }
}
// Typing for CoreFunctor as a callable variable. */
export interface CoreFunctor<T> {
  (): T
}

export const take = CoreFunctor.of