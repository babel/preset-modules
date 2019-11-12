const a = x => { for (let x of {}) x; };

const b = x => { for (const x in []) x; };

const c = x => { for (let x = 0; ;)x; };

const d = () => { let x; for (let x of {}) x; };

const e = x => { for (let x of {}) { let x; x; } };
