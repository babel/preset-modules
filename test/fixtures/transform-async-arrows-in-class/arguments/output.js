class Foo {
  constructor() {
    var _arguments = arguments;

    this.x = async function () {
      return await _arguments[0];
    };
  }

}
