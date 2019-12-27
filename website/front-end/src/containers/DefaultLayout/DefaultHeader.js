import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { Row, Col, Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/diamanti.png'
import sygnet from '../../assets/img/brand/diamanti_small.jpg'
import userIcon from '../../assets/img/ico-user-circle.svg'
import './DefaultContainer.scss';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(newProps) {
    if (newProps.selectedReleaseNumber !== this.props.selectedReleaseNumber) {
      this.props.onReleaseChange(newProps.selectedReleaseNumber);
    }
  }
  createNew() {

  }
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        {/* <Row className='rp-dc-header'> */}
        {/* <Col xs="12" md="8" lg="3">
          <img src={logo} className="rp-dc-logo" alt="logo" />
        </Col> */}

        <AppSidebarToggler  display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 150, height: 45, alt: 'Diamanti Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Diamanti Logo' }}
        />
        <Nav className="d-md-down-none"  navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <span style={{ fontWeight: 600, marginRight: '1rem' }}> Release : </span>
              {this.props.selectedReleaseNumber ? this.props.selectedReleaseNumber : 'Release...'}
              <i class="fa fa-caret-down" style={{ paddingLeft:'10px' }} aria-hidden="true"></i>

            </DropdownToggle>
            <DropdownMenu>
              {
                this.props.releases.map(release => <DropdownItem onClick={e => {
                  this.props.history.push('/release/summary')
                  this.props.onReleaseChange(release);
                }} ><i className="fa fa-file" ></i> {release}</DropdownItem>
                )
              }
            </DropdownMenu>
          </UncontrolledDropdown>
          {/* <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/users" className="nav-link">Users</Link>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Settings</NavLink>
          </NavItem> */}
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem> */}
          {/* <NavItem className="d-md-down-none"> */}
          {/* <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink> */}
          {/* </NavItem> */}

          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={userIcon} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right>
              {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem> */}
              {/* <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
              {
                this.props.user &&
                <DropdownItem onClick={() => this.props.onLogout()}><i className="fa fa-lock"></i> Logout</DropdownItem>
              }
              {
                !this.props.user &&
                <DropdownItem onClick={() => this.props.onLogout()}><i className="fa fa-lock"></i> Login</DropdownItem>
              }

            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* </Row> */}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

// const mapStateToProps = (state, ownProps) => ({
//   // currentUser: state.auth.currentUser,
//   // navigation: state.app.navs,
//   // allReleases: state.release.all
// })

// export default connect(mapStateToProps, {})(DefaultHeader);

export default withRouter(DefaultHeader);