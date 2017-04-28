import { dispatch } from 'main';
import { setBmesDetail } from 'modules/bmes';
import { setSolutionsDetail } from 'modules/solutions';
import { setEnablingDetail } from 'modules/enablings'

function onEnterEditBmePage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setBmesDetail(+id));
  done();
}

function onEnterEditSolutionPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setSolutionsDetail(+id));
  done();
}

function onEnterEditEnablingPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setEnablingDetail(+id));
  done();
}

export { onEnterEditBmePage, onEnterEditSolutionPage, onEnterEditEnablingPage };
