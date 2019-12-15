import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { logInSuccess } from '../../../actions';
import { connect } from 'react-redux';
import axios from 'axios';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  login() {
    this.props.logInSuccess({ email: this.state.email, isAdmin: true });
    this.props.history.push('/')
    // axios.post(`api/login`, { email: this.state.email, password: this.state.password })
    //   .then(res => {
    //     this.props.logInSuccess({ email: this.state.email, isAdmin: true });
    //     this.props.history.push('/')
    //   }, error => {
    //     alert('error logging in ');
    //   });
  }
  signup() {
    this.props.history.push('/register');
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <Card>
                <CardBody>
                  <Form>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={(e) => this.setState({ email: e.target.value })} placeholder="Email" autoComplete="email" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" onChange={(e) => this.setState({ password: e.target.value })} placeholder="Password" autoComplete="current-password" />
                    </InputGroup>
                    <Row>
                      <Col xs="8">
                        <Button onClick={() => this.login()} color="primary" className="px-4">Login</Button>
                      </Col>
                      {/* <Col xs="4" className="text-right">
                        <Button onClick={() => this.signup()} color="link" className="px-0">Signup</Button>
                      </Col> */}
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.auth.currentUser,
})

export default connect(mapStateToProps, { logInSuccess })(Login);