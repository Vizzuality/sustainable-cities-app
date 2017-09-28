import { dispatch } from 'main';
import { setBmesDetail } from 'modules/bmes';
import { setImpactDetail } from 'modules/impacts';
import { setEnablingDetail } from 'modules/enablings';
import { setStudyCaseDetail } from 'modules/study-cases';
import { setCategoryDetail } from 'modules/categories';
import { setCityDetail } from 'modules/cities';
import { setBlogsDetail } from 'modules/blogs';
import { setEventsDetail } from 'modules/events';
import { setCitySupportDetail } from 'modules/city-support';


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

function onEnterEditBlogsPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setBlogsDetail(+id));
  done();
}

function onEnterEditEventsPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setEventsDetail(+id));
  done();
}

function onEnterEditCitySupportPage({ params }, replaceUrl, done) {
  const { id } = params;
  dispatch(setCitySupportDetail(+id));
  done();
}

export {
  onEnterEditBmePage,
  onEnterEditEnablingPage,
  onEnterEditImpactPage,
  onEnterEditStudyCase,
  onEnterEditCategoryPage,
  onEnterEditCityPage,
  onEnterEditBlogsPage,
  onEnterEditEventsPage,
  onEnterEditCitySupportPage
};
