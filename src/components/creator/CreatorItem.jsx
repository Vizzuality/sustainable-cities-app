import React from 'react';
import { Input } from 'components/form/Form';

export default function CreatorItem() {
  return (
    <div className="c-creator-item">
      <div className="row expanded">
        <div className="small-6 column">
          <Input type="text" label="Description" validations={[]} />
        </div>
        <div className="small-6 column" />
      </div>
    </div>
  );
}
