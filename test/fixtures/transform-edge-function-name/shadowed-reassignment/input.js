const a = function () { a; };

const b = function () { b = 1; };

const c = function () { c; }; c = 1;

const d = function () { return function () { return () => { d = 1; }; }; };

const e = function () { e; }; () => { e = 1; };
