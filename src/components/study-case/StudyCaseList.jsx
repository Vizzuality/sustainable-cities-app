import React from 'react';
import StudyCaseItem from 'components/study-case/StudyCaseItem';
import classnames from 'classnames';

export default function StudyCaseList({ data }) {
  return (
    <ul className="c-sc-list row expanded">
      {data.map((sc, i) => {
        const cNames = classnames('column', 'small-4', {
          end: (i + 1) === data.length
        });
        return <li className={cNames} key={i}><StudyCaseItem data={sc} /></li>;
      })}
    </ul>
  );
}

StudyCaseList.propTypes = {
  data: React.PropTypes.array
};
