import React from 'react';
import StudyCaseItem from 'components/study-case/StudyCaseItem';

export default function StudyCaseList({ data }) {
  return (
    <ul className="c-sc-list row expanded">
      {data.map((sc, i) => <li className="column small-4" key={i}><StudyCaseItem data={sc} /></li>)}
    </ul>
  );
}

StudyCaseList.propTypes = {
  data: React.PropTypes.array
};
