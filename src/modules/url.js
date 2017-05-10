import { dispatch } from 'main';
import { setBmesDetail } from 'modules/bmes';
import { setImpactDetail } from 'modules/impacts';
import { setEnablingDetail } from 'modules/enablings'
import { setStudyCaseDetail } from 'modules/study-cases'


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

function onEnterEditStudyCase({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setStudyCaseDetail(+id));
  done();
}

export { onEnterEditBmePage, onEnterEditEnablingPage, onEnterEditImpactPage, onEnterEditStudyCase };
