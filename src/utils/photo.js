
import { deserialize } from 'utils/json-api';

export default (include = []) => {
  const photos = include.filter(inc => inc.type === 'photos') || [];
  const photoAttributes = deserialize(photos)[0] || {};
  return { photos_attributes: [photoAttributes] };
};
