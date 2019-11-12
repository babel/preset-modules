let _ = t => t,
    _t;

const f = t => t(_t || (_t = _`a${0}b${0}${0}`), 1, t, ["hello"]);
