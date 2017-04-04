import React from 'react';
import validator from 'validator';

const required = {
  rule: value => value.toString().trim(),
  hint: () => <span className="form-error -required">Required</span>
};

const email = {
  rule: value => validator.isEmail(value),
  hint: value => <span className="form-error -email">{value} isnt an Email.</span>
};

export { required, email };
