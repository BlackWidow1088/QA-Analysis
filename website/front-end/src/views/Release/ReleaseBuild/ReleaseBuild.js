// CUSTOMER USING THIS RELEASE (OPTIONAL) (M)
// Issues faced on customer side (jira - list)
// customers to be given to
import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
class ReleaseBuild extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div>
                <Row>
                    <Col xs="12" lg="6">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Builds
                                {/* <Button size="sm" color="primary" className="float-right">Edit</Button> */}
                            </CardHeader>
                            <CardBody>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.releaseInfo.BuildNumberList && this.props.releaseInfo.BuildNumberList.map(item => {
                                                return (
                                                    <tr>
                                                        <td>{item}</td>
                                                        <td>2019/01/01</td>
                                                        <td>
                                                            <Badge color="success">Success</Badge>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Pagination>
                                    <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                                    <PaginationItem active>
                                        <PaginationLink tag="button">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                                    <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                                    <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                                    <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    releaseInfo: state.release.all.filter(item => {
        if (item.ReleaseNumber === ownProps.id) {
            return true;
        } else {
            return false;
        }
    })[0]//.filter(item => item.name === ownProps.match.params.id)
})
export default connect(mapStateToProps, {})(ReleaseBuild);