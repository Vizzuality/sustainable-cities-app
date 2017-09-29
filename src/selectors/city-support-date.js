import { createSelector } from 'reselect';
import moment from 'moment';

const getParsedCitySupportDate = (cities) => {
  if (!cities.length) return [];

  return cities.map(city => ({
    ...city,
    date: moment(city.date).format('YYYY-MM-DD')
  }));
};

export default createSelector(
  state => state.citySupport.list,
  getParsedCitySupportDate
);
