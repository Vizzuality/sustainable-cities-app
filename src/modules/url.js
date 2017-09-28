import { dispatch } from 'main';
import { setBmesDetail } from 'modules/bmes';
import { setImpactDetail } from 'modules/impacts';
import { setEnablingDetail } from 'modules/enablings';
import { setStudyCaseDetail } from 'modules/study-cases';
import { setCategoryDetail } from 'modules/categories';
import { setCityDetail } from 'modules/cities';


function onEnterEditBmePage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setBmesDetail(+id));
  done();
}

function onEnterEditCategoryPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setCategoryDetail(+id));
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

function onEnterEditCityPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setCityDetail(+id));
  done();
}

export {
  onEnterEditBmePage,
  onEnterEditEnablingPage,
  onEnterEditImpactPage,
  onEnterEditStudyCase,
  onEnterEditCategoryPage,
  onEnterEditCityPage
};
