const a = function a() {
  a;
};

const _b = function b() {
  _b = 1;
};

const _c = function c() {
  _c;
};

_c = 1;

const _d = function d() {
  return function () {
    return () => {
      _d = 1;
    };
  };
};

const _e = function e() {
  _e;
};

() => {
  _e = 1;
};
