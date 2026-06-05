export class PassThrough {
  on() { return this; }
  once() { return this; }
  emit() { return true; }
  write() { return true; }
  end() {}
}
const stream = { PassThrough };
export default stream;
