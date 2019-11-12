let _ = t => t,
    _t;

const f = t => t(_t || (_t = _`a`));
