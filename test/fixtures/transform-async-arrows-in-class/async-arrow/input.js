class Foo {
  constructor() {
    this.x = async () => await 1;
  }
  bar() {
    (async () => { })();
  }
}
