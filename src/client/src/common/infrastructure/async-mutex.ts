type Resolvable = (params?: unknown) => void;

export class AsyncMutex {
  queue: Array<Resolvable>;
  pending: boolean;

  constructor() {
    this.queue = [];
    this.pending = false;
  }

  acquire() {
    const ticket = new Promise<Resolvable>((resolve) => this.queue.push(resolve as Resolvable));

    if (!this.pending) {
      this.dispatchNext();
    }

    return ticket;
  }

  dispatchNext() {
    if (this.queue.length > 0) {
      this.pending = true;
      const item = this.queue.shift();

      if (item) {
        item(this.dispatchNext.bind(this));
      }
    } else {
      this.pending = false;
    }
  }
}
