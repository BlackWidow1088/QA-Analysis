// CUSTOMER USING THIS RELEASE (OPTIONAL) (M)
// Issues faced on customer side (jira - list)
// customers to be given to
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, Collapse
    , Modal, ModalHeader, ModalBody, ModalFooter, Progress
} from 'reactstrap';
import { connect } from 'react-redux';
import AppTable from '../../../components/AppTable/AppTable';
import { getCurrentRelease } from '../../../reducers/release.reducer';
import { getTCStatusForUIDomains, getTCStatusForUISubDomains, alldomains, getTCStatusForSunburst } from '../../../reducers/release.reducer';
import { TABLE_OPTIONS } from '../../../constants';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { saveTestCase, saveTestCaseStatus, saveSingleTestCase } from '../../../actions';
import './ReleaseTestCase.scss'
// import sunburst from '../../../reducers/domains.js'
import Sunburst from './Sunburst';
import StackedBarChart from './barchart';
// var Sunburst = require("react-zoomable-sunburst")

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
                "Domain",
                "SubDomain",
                "Setup",
                "TcID",
                "TcName",

                // "TcID",
                // "TcName",
                // "Domain",
                // "SubDomain",
                "Scenario",
                "Description",
                "ExpectedBehaviour",
                "Notes",

                // "Setup",
                "OrchestrationPlatform",

                "Status"
            ],
            addTC: {},
            open: false,
            width: window.screen.availWidth > 1700 ? 500 : 380,
            doughnuts: getTCStatusForUIDomains(this.props.selectedRelease),
            qaStrategy: {},
            domainSelected: false,
            domains: getTCStatusForSunburst(this.props.selectedRelease)
        }
    }
    componentDidMount() {
    }
    getTcs() {
        if (this.state.domainSelected) {
            axios.get(`/api/tcinfo/${this.props.selectedRelease.ReleaseNumber}/tcinfo/domain/${this.state.domainSelected}`)
                .then(res => {
                    console.log('for ', this.props.selectedRelease.ReleaseNumber)
                    console.log(res.data)
                    this.props.saveTestCase({ data: res.data, id: this.props.selectedRelease.ReleaseNumber });
                }, error => {
                })
        }
    }
    toggle = () => this.setState({ modal: !this.state.modal });
    save() {
        let data = { ...this.state.addTC };
        let dates = [
            'TargetedReleaseDate', 'ActualReleaseDate', 'TargetedCodeFreezeDate',
            'UpgradeTestingStartDate', 'QAStartDate', 'ActualCodeFreezeDate', 'TargetedQAStartDate'
        ]
        let formattedDates = {};
        dates.forEach(item => {
            if (data[item]) {
                let date = new Date(data[item]);
                formattedDates[item] = date.toISOString()
            }
        })
        data = { ...data, ...formattedDates };
        data.Domain = this.state.domainSelected;
        console.log('saved data ', data);
        axios.post(`/api/tcinfo/${this.props.selectedRelease.ReleaseNumber}`, { ...data })
            .then(res => {
                this.getTcs();
                this.setState({ addTC: {} });
            }, error => {
                alert('error in updating');
            });
        if (this.state.modal) {
            this.toggle();
        }
    }
    confirmToggle() {
        let data = { ...this.state.addTC }
        if (!data || (data && !data.TcID) || !this.state.domainSelected) {
            alert('Please Add Tc ID or Domain');
            return;
        }
        this.toggle();
    }
    sunburstClick(node) {
        console.log('clicked node');
        console.log(node);
        if (alldomains.includes(node.data.name)) {
            this.setState({ doughnuts: getTCStatusForUISubDomains(this.props.selectedRelease, node.data.name), domainSelected: false })
        }
        if (node.data.name === 'domains') {
            this.setState({ doughnuts: getTCStatusForUIDomains(this.props.selectedRelease), domainSelected: false })
        }
        if (!alldomains.includes(node.data.name) && node.data.name !== 'domains') {
            axios.get('/api/' + this.props.selectedRelease.ReleaseNumber + '/tcinfo/domain/' + node.data.name)
                .then(res => {
                    this.props.saveTestCase({ id: this.props.selectedRelease.ReleaseNumber, data: res.data })
                    this.setState({ domainSelected: node.data.name })
                }, error => {

                })
            return false;
        }
        return true;
    }
    render() {
        return (
            <div>
                <Row>
                    <Col xs="11" sm="11" md="11" lg="11" className="rp-summary-tables" style={{ 'margin-left': '1.5rem' }}>
                        <div className='rp-app-table-header'>
                            <span className='rp-app-table-title'>Test Case Status (Domain Wise)</span>
                        </div>
                        <Row>

                            <Col xs="11" sm="11" md="11" lg="4">
                                <div style={{ marginLeft: '1rem', marginTop: '1rem' }}>
                                    <Sunburst
                                        tooltip={false}
                                        onClick={(node) => this.sunburstClick(node)}
                                        data={this.state.domains}
                                        width={this.state.width}
                                        height={this.state.width}
                                        count_member="size"
                                        labelFunc={(node) => node.data.name}
                                    />
                                </div>
                            </Col>
                            <Col xs="11" sm="11" md="11" lg="8">
                                <Row style={{ marginLeft: '0.5rem' }}>
                                    {
                                        this.state.doughnuts &&
                                        this.state.doughnuts.map((item, index) => {
                                            if (index < 4) {
                                                return (
                                                    <Col xs="12" sm="12" md="6" lg="6">
                                                        <div className="chart-wrapper">
                                                            <Doughnut data={item.data} />
                                                        </div>
                                                        <div className='rp-tc-dougnut-text'>
                                                            {item && item.title}
                                                        </div>
                                                    </Col>
                                                )
                                            }

                                        })
                                    }
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            {
                                this.state.doughnuts &&
                                this.state.doughnuts.length >= 4 &&
                                this.state.doughnuts.map((item, index) => {
                                    if (index >= 4) {
                                        return (<Col xs="12" sm="12" md="4" lg="4">
                                            <div className="chart-wrapper">
                                                <Doughnut data={item.data} />
                                            </div>
                                            <div className='rp-tc-dougnut-text'>
                                                {item && item.title}
                                            </div>
                                        </Col>)
                                    }
                                })
                            }
                        </Row>
                    </Col>
                </Row>
                {
                    this.state.domainSelected &&
                    <div>
                        <div>
                            <Button style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }} className='rp-any-button' onClick={() => this.setState({ open: !this.state.open })}>{this.state.open ? 'Close' : 'Create Test Case'}</Button>
                        </div>
                        <Collapse isOpen={this.state.open}>
                            <Row style={{ marginLeft: '1rem', marginTop: '0.2rem' }}>
                                <Col xs="12" sm="12" lg="10" className="rp-summary-tables" >
                                    <div className='rp-app-table-header'>
                                        <span className='rp-app-table-title'>Add Test Case</span>
                                        <Button title="Save" size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.confirmToggle()} >
                                            <i className="fa fa-check-square-o"></i>
                                        </Button>
                                    </div>

                                    <Row>
                                        <Col xs="12" sm="12" md="5" lg="5">
                                            <Table scroll responsive style={{ overflow: 'scroll', }}>
                                                <tbody>
                                                    {
                                                        [
                                                            { field: 'Domain', header: 'Domain *', type: 'text' },
                                                            { field: 'SubDomain', header: 'Sub Domain *', type: 'text' },
                                                            { field: 'Setup', header: 'Setup', type: 'text' },
                                                            { field: 'TcID', header: 'Tc ID *', type: 'text', },
                                                            { field: 'TcName', header: 'Tc Name', type: 'text', restrictWidth: false },
                                                            { field: 'Scenario', header: 'Scenario', type: 'text' },
                                                            { field: 'OrchestrationPlatform', header: 'Orchestration Platform', type: 'text' },
                                                            { field: 'Status', header: 'Status', type: 'text' }
                                                        ].map((item, index) => (
                                                            <tr>
                                                                <td className='rp-app-table-key'>{item.header}</td>
                                                                <td>
                                                                    {
                                                                        item.field === 'Domain' &&
                                                                        <td className='rp-app-table-key'>{this.state.domainSelected}</td>
                                                                    }
                                                                    {
                                                                        item.field !== 'Domain' &&
                                                                        <Input
                                                                            type="text"
                                                                            key={index}
                                                                            onChange={(e) => this.setState({ addTC: { ...this.state.addTC, [item.field]: e.target.value } })}
                                                                            placeholder={'Add ' + item.header}
                                                                            value={this.state.addTC[item.field]}
                                                                        />
                                                                    }

                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                        <Col xs="12" sm="12" md="5" lg="5">
                                            <Table scroll responsive style={{ overflow: 'scroll', }}>
                                                <tbody>
                                                    {
                                                        [

                                                            { field: 'Description', header: 'Description', type: 'text' },
                                                            { field: 'ExpectedBehaviour', header: 'Expected Behaviour', type: 'text' },
                                                            { field: 'Notes', header: 'Notes', type: 'text' },

                                                        ].map((item, index) => (
                                                            <tr>
                                                                <td className='rp-app-table-key'>{item.header}</td>
                                                                <td>
                                                                    <Input
                                                                        type="textarea"
                                                                        key={index}
                                                                        onChange={(e) => this.setState({ addTC: { ...this.state.addTC, [item.field]: e.target.value } })}
                                                                        placeholder={'Add ' + item.header}
                                                                        value={this.state.addTC[item.field]}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>
                        </Collapse>
                    </div>
                }
                {
                    this.state.domainSelected &&
                    <Row>
                        <Col xs="11" sm="11" md="11" lg="11" className="rp-summary-tables" style={{ 'margin-left': '1.5rem' }}>

                            <AppTable
                                // onUpdate={(values) => this.updateTestCase(values)}
                                // editOptions={this.props.currentUser && this.props.currentUser.isAdmin ? [TABLE_OPTIONS.ADD] : []}
                                title={`Test cases`}
                                currentUser={this.props.currentUser}
                                fieldAndHeader={[
                                    { field: 'Domain', header: 'Domain', type: 'text', },
                                    { field: 'SubDomain', header: 'Sub Domain', type: 'text' },
                                    { field: 'Setup', header: 'Setup', type: 'text' },
                                    { field: 'TcID', header: 'Tc ID', type: 'text', },
                                    { field: 'TcName', header: 'Tc Name', type: 'text', restrictWidth: false, },
                                    { field: 'Scenario', header: 'Scenario', type: 'text' },
                                    // { field: 'Description', header: 'Description', type: 'text', restrictWidth: false },
                                    // { field: 'ExpectedBehaviour', header: 'Expected Behaviour', type: 'text', restrictWidth: false },
                                    // { field: 'Notes', header: 'Notes', type: 'text' },
                                    { field: 'OrchestrationPlatform', header: 'Orchestration Platform', type: 'text' },
                                    { field: 'Status', header: 'Status', type: 'text' }
                                ]}
                                data={
                                    this.props.selectedTC
                                }
                                restrictHeight="rp-app-table-medium"
                                addOnTop={true}
                            />

                        </Col>
                    </Row>
                }

                <Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                    <ModalHeader toggle={() => this.toggle()}>Confirmation</ModalHeader>
                    <ModalBody>
                        Are you sure you want to make the changes?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.save()}>Ok</Button>{' '}
                        <Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>)

        // <Pagination>
        //                         <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
        //                         <PaginationItem active>
        //                             <PaginationLink tag="button">1</PaginationLink>
        //                         </PaginationItem>
        //                         <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
        //                         <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
        //                         <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
        //                         <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
        //                     </Pagination>
    }
}
const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    selectedRelease: getCurrentRelease(state, state.release.current.id),
    selectedTC: state.testcase.all[state.release.current.id],
    // selectedTCStatus: state.testcase.status[state.release.current.id],
    // doughnuts: getTCStatusForUIDomains(state, state.release.current.id)
})
export default connect(mapStateToProps, { saveTestCase, saveTestCaseStatus, saveSingleTestCase })(ReleaseTestCase);












/* <div className="ag-theme-balham" style={{ height: '200px', width: '600px' }}>
                            <AgGridReact
                                columnDefs={[
                                    { field: 'Domain', headerName: 'Domain', sortable: true, filter: true },
                                    { field: 'SubDomain', headerName: 'Sub Domain', sortable: true, filter: true },
                                    { field: 'Setup', headerName: 'Setup', sortable: true, filter: true },
                                    { field: 'TcID', headerName: 'Name', sortable: true, filter: true },
                                    { field: 'TcName', headerName: 'Tc Name', sortable: true, filter: true },
                                    { field: 'Scenario', headerName: 'Scenario', sortable: true, filter: true },
                                    { field: 'Description', headerName: 'Description', sortable: true, filter: true },
                                    { field: 'ExpectedBehaviour', headerName: 'Expected Behaviour', sortable: true, filter: true },
                                    { field: 'Notes', headerName: 'Notes', sortable: true, filter: true },
                                    { field: 'OrchestrationPlatform', headerName: 'Orchestration Platform', sortable: true, filter: true },
                                    { field: 'Status', headerName: 'Status', sortable: true, filter: true }]}
                                rowData={this.props.testcases
                                }
                            >
                            </AgGridReact>
                        </div> */