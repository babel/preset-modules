const a = 1;

(() => {
  const a = 2;
  return a;
})();

let c;

() => {
  let c;

  (() => {
    let c;
  })();
};

(function () {
  let c;
})();
