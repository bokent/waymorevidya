type map_fun<T, V> = (
    currentValue: T,
    index: number,
    array: T[],
    worker: number
  ) => V;
  type returnT<T, V> = { status: string; value?: V; reason?: any; param: T };
  
  export class LimitedConcurrency {
    static *arrayGenerator<T>(array: T[]): Generator<[T, number, T[]]> {
      for (let index = 0; index < array.length; index++) {
        const currentValue = array[index];
        yield [currentValue, index, array];
      }
    }
  
    static async mapItem<T, V>(
      mapFn: map_fun<T, V>,
      currentValue: T,
      index: number,
      array: T[],
      worker: number
    ): Promise<returnT<T, V>> {
      try {
        return {
          status: "fulfilled",
          value: await mapFn(currentValue, index, array, worker),
          param: currentValue,
        };
      } catch (reason) {
        return {
          status: "rejected",
          reason,
          param: currentValue,
        };
      }
    }
  
    static async worker<T, V>(
      id: number,
      gen: Generator<[T, number, T[]]>,
      mapFn: map_fun<T, V>,
      result: Awaited<returnT<T, V>>[]
    ) {
      for (let [currentValue, index, array] of gen) {
        console.time(`Worker ${id} --- index ${index} item ${currentValue}`);
        result[index] = await this.mapItem(mapFn, currentValue, index, array, id);
        console.log(
          `Worker ${id} --- index ${index} item ${currentValue}: ${result[index].status} - ${result[index].reason}`
        );
        console.timeEnd(`Worker ${id} --- index ${index} item ${currentValue}`);
      }
    }
  
    static async mapAllSettled<T, V>(
      arr: T[],
      mapFn: map_fun<T, V>,
      limit = arr.length
    ): Promise<returnT<T, V>[]> {
      const result: Awaited<returnT<T, V>>[] = [];
  
      if (arr.length === 0) {
        return result;
      }
  
      const gen = this.arrayGenerator(arr);
  
      limit = Math.min(limit, arr.length);
  
      const workers = new Array(limit);
      for (let i = 0; i < limit; i++) {
        workers.push(this.worker(i, gen, mapFn, result));
      }
  
      await Promise.all(workers);
  
      return result;
    }
  }
  