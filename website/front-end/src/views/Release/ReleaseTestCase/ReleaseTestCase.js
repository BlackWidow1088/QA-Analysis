// CUSTOMER USING THIS RELEASE (OPTIONAL) (M)
// Issues faced on customer side (jira - list)
// customers to be given to
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
class ReleaseTestCase extends Component {
    // "TcID": "PVC_Mirrored-3.3",
    // "TcName": "MirroringStaticProvisioning.RebootAllNodes",
    // "Domain": "StoragePVC",
    // "SubDomain": "Mirrored",
    // "Scenario": "Reboot Tests",
    // "Description": "Create fio pods with pvcs for mirrored volumes. Reboot all nodes.",
    // "ExpectedBehaviour": "After rebooting the nodes,\nPod should go into running state and\nvolumes should go into attached state",
    // "Notes": "NOTES NOT PROVIDED",
    // "Setup": [
    //   "BOS",
    //   "NYNJ",
    //   "OS"
    // ],
    // "OrchestrationPlatform": [
    //   "dcx-k8s",
    //   "dcx-k8s",
    //   "oc-k8s"
    // ],
    // "Status": "UNDERWORK"

    // Bugs: "-1"
    // Build: "9.9.1 (151)"
    // Date: "2019-12-13"
    // Result: "Pass"
    // TcID: "PVC_Mirrored-3.0"
    // id: 288
    constructor(props) {
        super(props);
        this.state = {
            fields: [
                "TcID",
                "Result",
                "Build",
                "Date",

                "Bugs",
                "id",

                // "TcID",
                // "TcName",
                // "Domain",
                // "SubDomain",
                // "Scenario",
                // "Description",
                // "ExpectedBehaviour",
                // "Notes",

                // "Setup",
                // "OrchestrationPlatform",

                // "Status"
            ]
        }
        console.log(this.props.testcases[0]);
    }
    render() {
        let style = {
            textUnderline: true,
            color: 'blue'
        }
        return (
            <div>
                <Row>
                    <Col xs="12" lg="6">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Test Cases
                                {/* <Button size="sm" color="primary" className="float-right">Edit</Button> */}
                            </CardHeader>
                            <CardBody>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            {
                                                this.state.fields.map(item => <th>{item}</th>)
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.testcases && this.props.testcases.map(tc => {
                                                return (
                                                    <tr>
                                                        {
                                                            this.state.fields.map(item => {
                                                                let value = tc[item];
                                                                if (value && item === "Setup" || item === "Orchestration Platform") {
                                                                    value = value.join(',');
                                                                }
                                                                if (item === 'TcID') {
                                                                    return (

                                                                        <td>
                                                                            <span style={style}>
                                                                                {tc[item]}
                                                                            </span>
                                                                        </td>

                                                                    )
                                                                }
                                                                return (
                                                                    <td>{value}</td>
                                                                )
                                                            })
                                                        }
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
            </div >
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
    })[0], //.filter(item => item.name === ownProps.match.params.id)
    testcases: state.testcase.all
})
export default connect(mapStateToProps, {})(ReleaseTestCase);