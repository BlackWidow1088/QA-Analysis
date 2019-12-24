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
import './ReleaseQAStrategy.scss'
// import sunburst from '../../../reducers/domains.js'
import Sunburst from '../components/Sunburst';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem } from 'reactstrap';

const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false
}

const data = [
    { date: 'Nov 2019', QARateOfProgress: 40, tcTotal: 2000, tcSkipped: 200, tcNA: 100, SetupsUsed: ['autotb1', 'autotb2'], Engineer: ['achavan@diamanti.com', 'sushil@diamanti.com', 'nikhil@diamanti.com'], startdate: '5th Nov, 2019', freezedate: '30th Nov, 2019', upgrade: [2.2, 2.2] },
    { date: 'Oct 2019', QARateOfProgress: 50, tcTotal: 1000, tcSkipped: 200, tcNA: 100, SetupsUsed: ['autotb5', 'auto8', 'atuo10'], Engineer: ['achavan@diamanti.com', 'sushil@diamanti.com', 'nikhil@diamanti.com'], startdate: '5th Nov, 2019', freezedate: '30th Nov, 2019', upgrade: [2.2, 2.2] },
    { date: 'Sept 2019', QARateOfProgress: 60, tcTotal: 500, tcSkipped: 50, tcNA: 200, SetupsUsed: ['autotb1', 'autotb2'], Engineer: ['achavan@diamanti.com', 'sushil@diamanti.com', 'nikhil@diamanti.com'], startdate: '5th Nov, 2019', freezedate: '30th Nov, 2019', upgrade: [2.2, 2.2] },
]
class ReleaseQAStrategy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addTC: {},
            open: {},
            width: window.screen.availWidth > 1700 ? 500 : 380,
            basic: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false },
            qaStrategy: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false, collapseOpen: { SetupsUsed: false, EngineerCount: false } },
            domainSelected: false,
            items: []
        }
    }
    componentDidMount() {
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
                    {

                        data.map((each, i) =>
                            <Col xs="11" sm="11" md="6" lg="3" className="rp-summary-tables">
                                <div className='rp-app-table-header'>
                                    <span className='rp-app-table-title'>{each.date}</span>
                                </div>

                                <Table scroll responsive style={{ overflow: 'scroll', }}>
                                    <tbody>
                                        {
                                            [
                                                { key: 'Expected rate of Progress per week', field: 'QARateOfProgress', value: each.QARateOfProgress },
                                                { key: 'Test Cases Run', restrictEdit: true, field: 'run', value: each.tcTotal },
                                                { key: 'Test Cases Skipped', restrictEdit: true, field: 'skip', value: each.tcSkipped },
                                                { key: 'Test Cases Not Applicable', restrictEdit: true, field: 'na', value: each.tcNA },

                                                { key: 'Setups Used', restrictEdit: true, field: 'SetupsUsed', value: each.SetupsUsed.length },
                                                { key: 'Engineers', field: 'EngineerCount', value: each.Engineer.length },
                                                { key: 'QA Start Date', field: 'QAStartDate', value: each.startdate },
                                                { key: 'Target Code Freeze Date', field: 'TargetedCodeFreezeDate', value: each.freezedate },
                                                { key: 'Upgrade Metrics Count', restrictEdit: true, field: 'UpgradeMetrics', value: each.upgrade.length },

                                            ].map((item, index) => {
                                                return (
                                                    <tr>
                                                        <React.Fragment>

                                                            <td className='rp-app-table-key'>{item.key}</td>

                                                            <td>{item.value}</td>

                                                        </React.Fragment>

                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                {
                                    !this.state.open[each.date] &&
                                    <div style={{ textAlign: 'center' }}>
                                        <i className="fa fa-angle-down rp-rs-down-arrow" onClick={() => this.setState({ open: { ...this.state.open, [each.date]: !this.state.open[each.date] } })}></i>
                                    </div>
                                }
                                {
                                    this.state.open[each.date] &&
                                    <div style={{ textAlign: 'center' }}>
                                        <i className="fa fa-angle-up rp-rs-down-arrow" onClick={() => this.setState({ open: { ...this.state.open, [each.date]: !this.state.open[each.date] } })}></i>
                                    </div>
                                }
                            </Col>
                        )

                    }
                </Row>

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
            </div >
        )
    }
}
const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    selectedRelease: getCurrentRelease(state, state.release.current.id),
    selectedTC: state.testcase.all[state.release.current.id],
})
export default connect(mapStateToProps, { saveTestCase, saveTestCaseStatus })(ReleaseQAStrategy);








