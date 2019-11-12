const a = () => {
  for (let x of {}) x;
};

const b = () => {
  for (const x in []) x;
};

const c = () => {
  for (let x = 0;;) x;
};

const d = x => {
  for (let y of {}) y;
};

const e = x => {
  for (let y of {}) {
    let x;
    x;
  }
};
