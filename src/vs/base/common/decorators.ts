let memoizeId = 0;
export function createMemoizer() {
  const memoizeKeyPrefix = `$memoize${memoizeId++}`;
  let self: any = undefined;

  const result = function memoize(target: any, key: string, descriptor: any) {
    let fnKey: string | null = null;
    let fn: Function | null = null;

    if (typeof descriptor.value === 'function') {
      fnKey = 'value';
      fn = descriptor.value;

      if (fn!.length !== 0) {
        console.warn(
          'Memoize should only be used in functions with zero parameters'
        );
      }
    } else if (typeof descriptor.get === 'function') {
      fnKey = 'get';
      fn = descriptor.get;
    }

    if (!fn) {
      throw new Error('not supported');
    }

    const memoizeKey = `${memoizeKeyPrefix}:${key}`;
    descriptor[fnKey!] = function (...args: any[]) {
      self = this;

      if (!this.hasOwnProperty(memoizeKey)) {
        Object.defineProperty(this, memoizeKey, {
          configurable: true,
          enumerable: false,
          writable: true,
          value: fn!.apply(this, args),
        });
      }

      return this[memoizeKey];
    };
  };

  result.clear = () => {
    if (typeof self === 'undefined') {
      return;
    }
    Object.getOwnPropertyNames(self).forEach((property) => {
      if (property.indexOf(memoizeKeyPrefix) === 0) {
        delete self[property];
      }
    });
  };

  return result;
}

export function memoize(target: any, key: string, descriptor: any) {
  return createMemoizer()(target, key, descriptor);
}
