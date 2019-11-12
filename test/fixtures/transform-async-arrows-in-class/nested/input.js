class Foo {
  constructor() {
    this.x = () => async () => await this;
  }
}
