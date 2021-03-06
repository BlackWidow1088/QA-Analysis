import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import axios from 'axios';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
// import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import { connect } from 'react-redux';
import { saveReleaseBasicInfo, updateNavBar, saveTestCase } from '../../actions';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    if (e) {
      e.preventDefault()
    }
    this.props.history.push('/login')
  }
  componentDidMount() {
    if (this.props.allReleases.length === 0) {
      axios.get(`/api/release/all`)
        .then(res => {
          res.data.forEach(item => {
            this.props.updateNavBar({ id: item.ReleaseNumber });
            this.props.saveReleaseBasicInfo({ id: item.ReleaseNumber, data: item });
          });
        }, error => {
        });
    }
    if (this.props.allTestCases.length === 0) {
      axios.get(`/api/tcstatus`)
        .then(res => {
          res.data.forEach(item => {
            console.log('teceived item ', item);
            this.props.saveTestCase({ id: item.TcID, data: item });
          });
        }, error => {
        });
    }
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={this.props.navigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {/* <AppBreadcrumb appRoutes={routes} router={router} /> */}
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {
                    !this.props.currentUser &&
                    <Redirect to="/login" />
                  }
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/"
                    to={this.props.allReleases[0] ? `/release/${this.props.allReleases[0].ReleaseNumber}` : `/release/manage`} />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        {/* <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter> */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.auth.currentUser,
  navigation: state.app.navs,
  allReleases: state.release.all,
  allTestCases: state.testcase.all
})

export default connect(mapStateToProps, { saveReleaseBasicInfo, updateNavBar, saveTestCase })(DefaultLayout);
