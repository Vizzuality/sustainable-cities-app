import React from 'react';
import PropTypes from 'prop-types';
import StudyCaseItem from 'components/study-case/StudyCaseItem';
import classnames from 'classnames';

export default function StudyCaseList({ data }) {
  return (
    <ul className="c-sc-list row expanded">
      {data.map((sc, i) => {
        const cNames = classnames('column', 'small-4', {
          end: (i + 1) === data.length
        });
        return <li className={cNames} key={sc.id}><StudyCaseItem data={sc} /></li>;
      })}
    </ul>
  );
}

StudyCaseList.propTypes = {
  data: PropTypes.array
};
