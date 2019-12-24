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
import { getTCStrategyForUIDomains, getTCStrategyForUISubDomains, alldomains, getTCStatusForSunburst } from '../../../reducers/release.reducer';
import { TABLE_OPTIONS } from '../../../constants';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { saveTestCase, saveTestCaseStatus, saveSingleTestCase } from '../../../actions';
import './ReleaseTestMetrics.scss'
// import sunburst from '../../../reducers/domains.js'
import Sunburst from '../components/Sunburst';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false
}
class ReleaseTestMetrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addTC: {},
            open: false,
            width: window.screen.availWidth > 1700 ? 500 : 380,
            doughnuts: getTCStrategyForUIDomains(this.props.selectedRelease),
            qaStrategy: {},
            domainSelected: false,
            domains: getTCStatusForSunburst(this.props.selectedRelease),
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
            this.setState({ doughnuts: getTCStrategyForUISubDomains(this.props.selectedRelease, node.data.name), domainSelected: false })
        }
        if (node.data.name === 'domains') {
            this.setState({ doughnuts: getTCStrategyForUIDomains(this.props.selectedRelease), domainSelected: false })
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
                            <span className='rp-app-table-title'>Test Case Distribution (Domain Wise)</span>
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
                                                    <Col>
                                                        <div className="chart-wrapper" style={{ minHeight: '400px' }}>
                                                            {/* <Doughnut data={item.data} /> */}
                                                            <Bar data={item.data} options={options} />
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
                        {/* <Row>
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
                        </Row> */}
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
            </div >)
    }
}
const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    selectedRelease: getCurrentRelease(state, state.release.current.id),
    selectedTC: state.testcase.all[state.release.current.id],
})
export default connect(mapStateToProps, { saveTestCase, saveTestCaseStatus })(ReleaseTestMetrics);








