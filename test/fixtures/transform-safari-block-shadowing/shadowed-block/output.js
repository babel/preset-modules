const a = 1;
{
  const _a = 2;
}
a;
{
  let _c;
}
let c;

for (;;) {
  let _c2;
}

() => {
  let c;
  {
    let _c3;

    let d;
    {
      let _c4;
    }
  }
};

{
  const {
    a: _a2 = 1,
    d = 2
  } = {};
  console.log(_a2, d);
}
{
  let d;
}

(function () {
  try {
    {
      let _bar = 456;
    }
    let bar = 123;
    return bar === 123;
  } catch (e) {
    return false;
  }
})();
