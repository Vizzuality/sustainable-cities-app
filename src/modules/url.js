import { dispatch } from 'main';
import { setBmesDetail } from 'modules/bmes';

function onEnterEditBmePage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setBmesDetail(+id));
  done();
}

export { onEnterEditBmePage };
