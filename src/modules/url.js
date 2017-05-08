import { dispatch } from 'main';
import { setBmesDetail } from 'modules/bmes';
import { setImpactDetail } from 'modules/impacts';
import { setEnablingDetail } from 'modules/enablings'
import { setSourceDetail } from 'modules/sources';


function onEnterEditBmePage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setBmesDetail(+id));
  done();
}

function onEnterEditEnablingPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setEnablingDetail(+id));
  done();
}

function onEnterEditImpactPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setImpactDetail(+id));
  done();
}

function onEnterEditSourcePage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setSourceDetail(+id));
  done();
}

export { onEnterEditBmePage, onEnterEditEnablingPage, onEnterEditImpactPage, onEnterEditSourcePage };
