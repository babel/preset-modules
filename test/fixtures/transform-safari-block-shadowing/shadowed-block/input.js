const a = 1;
{
  const a = 2;
}
a;
{
  let c;
}
let c;

for (;;) {
  let c;
}

() => {
  let c;
  {
    let c;

    let d;
    {
      let c;
    }
  }
};

{
  const {
    a = 1,
    d = 2
  } = {};
  console.log(a, d);
}

{
  let d;
}

(function () {
  try {
    {
      let bar = 456;
    }
    let bar = 123;
    return bar === 123;
  } catch (e) {
    return false;
  }
})();
