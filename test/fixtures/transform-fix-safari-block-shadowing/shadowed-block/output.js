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
