import { createSelector } from 'reselect';
import moment from 'moment';

const getParsedBlogDate = (blogs) => {
  if (!blogs.length) return [];

  return blogs.map(blog => ({
    ...blog,
    date: moment(blog.date).format('YYYY-MM-DD')
  }));
};

export default createSelector(
  state => state.blogs.list,
  getParsedBlogDate
);
