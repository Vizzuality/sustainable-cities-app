import { createSelector } from 'reselect';
import moment from 'moment';

const getParsedEventsDate = (events) => {
  if (!events.length) return [];

  return events.map(event => ({
    ...event,
    date: moment(event.date).format('YYYY-MM-DD')
  }));
};

export default createSelector(
  state => state.events.list,
  getParsedEventsDate
);
