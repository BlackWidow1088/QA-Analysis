import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Modal, ModalHeader, ModalBody, ModalFooter, Table, Collapse, Progress, Badge
} from 'reactstrap';
import { connect } from 'react-redux';
import { saveReleaseBasicInfo, saveFeatures, saveBugs, saveSingleFeature, statusPage } from '../../../actions';
import { getCurrentRelease } from '../../../reducers/release.reducer';
import { getTCForStatus, getTCForStrategy } from '../../../reducers/release.reducer';
import BasicReleaseInfo from '../components/BasicReleaseInfo';
import ChatBox from '../../../components/ChatBox/ChatBox';
import AgGrid from '../../../components/AgGrid/AgGrid';
import AppTable from '../../../components/AppTable/AppTable';
import './ReleaseSummary.scss';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { TABLE_OPTIONS } from '../../../constants';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { cardChartOpts2, cardChartData2 } from '../constants';
const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')
// const line = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     datasets: [
//         {
//             label: 'Feature Completion',
//             fill: false,
//             lineTension: 0.1,
//             backgroundColor: 'rgba(75,192,192,0.4)',
//             borderColor: 'rgba(75,192,192,1)',
//             borderCapStyle: 'butt',
//             borderDash: [],
//             borderDashOffset: 0.0,
//             borderJoinStyle: 'miter',
//             pointBorderColor: 'rgba(75,192,192,1)',
//             pointBackgroundColor: '#fff',
//             pointBorderWidth: 1,
//             pointHoverRadius: 5,
//             pointHoverBackgroundColor: 'rgba(75,192,192,1)',
//             pointHoverBorderColor: 'rgba(220,220,220,1)',
//             pointHoverBorderWidth: 2,
//             pointRadius: 1,
//             pointHitRadius: 10,
//             data: [65, 59, 80, 81, 56, 55, 40],
//         },
//     ],
// };
const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false
}
const mainChartOpts = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {
            labelColor: function (tooltipItem, chart) {
                return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
            }
        }
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [
            {
                gridLines: {
                    drawOnChartArea: false,
                },
            }],
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                },
            }],
    },
    elements: {
        point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
        },
    },
};
var elements = 12;
var data1 = [];
var data2 = [];
var data3 = [];
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
for (var i = 0; i <= elements; i++) {
    data1.push(random(50, 200));
    data2.push(random(80, 100));
    data3.push(65);
}

class ReleaseSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            isReleaseStatusEditing: false,
            modal: false,
            toggleModal: false,
            jenkinsBuildLink: '',
            editReleaseStatusOptions: [TABLE_OPTIONS.EDIT],
            basic: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false },
            qaStrategy: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false, collapseOpen: { SetupsUsed: false, EngineerCount: false } },
            qaStatus: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false },
            screen: {
                tcStrategyTitleStyle: window.screen.availWidth > 1400 ?
                    { position: 'absolute', top: '30%', left: '47%', textAlign: 'center', fontSize: '20px', fontWeight: 600, color: '#00742b' } :
                    { position: 'absolute', top: '30%', left: '46%', textAlign: 'center', fontSize: '16px', fontWeight: 600, color: '#00742b' },
                tcSummaryTitleStyle: window.screen.availWidth > 1400 ?
                    { position: 'absolute', top: '38%', left: '47%', textAlign: 'center', fontSize: '20px', fontWeight: 600, color: '#00742b' } :
                    { position: 'absolute', top: '40%', left: '46%', textAlign: 'center', fontSize: '16px', fontWeight: 600, color: '#00742b' },
            },
            showFeatures: false
        }
    }

    componentDidMount() {
        this.reset();
        axios.get('/rest/features/' + this.props.selectedRelease.ReleaseNumber)
            .then(res => {
                this.props.saveFeatures({ data: res.data, id: this.props.selectedRelease.ReleaseNumber })
                this.setState({ showFeatures: true })
            }, err => {
                console.log('err ', err);
            });
        axios.get('/rest/bugs/' + this.props.selectedRelease.ReleaseNumber)
            .then(res => {
                this.props.saveBugs({ data: res.data, id: this.props.selectedRelease.ReleaseNumber })
                this.setState({ showBugs: true })
            }, err => {
                console.log('err ', err);
            })
    }
    edit() {
        this.setState({ isEditing: true });
    }
    reset() {
        this.setState({
            isEditing: false,
            isReleaseStatusEditing: false,
            modal: false,
            toggleModal: false,
            jenkinsBuildLink: '',
            editReleaseStatusOptions: [TABLE_OPTIONS.EDIT],
            basic: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {} },
            qaStrategy: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false, collapseOpen: { SetupsUsed: false, EngineerCount: false } }

        });
    }
    save() {
        console.log(this.state.basic.updated);
        let data = { ...this.props.selectedRelease, ...this.state.basic.updated, ...this.state.qaStrategy.updated }
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
        let arrays = [
            'ServerType', 'CardType', 'BuildNumberList', 'SetupsUsed', 'UpgradeMetrics', 'Customers'
        ]
        let formattedArrays = {};
        console.log('server ttype')
        console.log(data.ServerType);
        if (data.ServerType && !Array.isArray(data.ServerType)) {
            console.log('entered')
        }

        arrays.forEach(item => {
            if (!data[item]) {
                formattedArrays[item] = [];
            }
            if (data[item] && !Array.isArray(data[item])) {
                formattedArrays[item] = data[item].split(',');
            }
        })
        data = { ...data, ...formattedArrays };


        if (isNaN(data.EngineerCount)) {
            data.EngineerCount = 0;
        } else {
            data.EngineerCount = parseInt(data.EngineerCount);
        }
        if (!data.EngineerCount) {
            data.EngineerCount = 0;
        }
        if (isNaN(data.QARateOfProgress)) {
            data.QARateOfProgress = 0;
        } else {
            data.QARateOfProgress = parseInt(data.QARateOfProgress);
        }
        if (!data.QARateOfProgress) {
            data.QARateOfProgress = 0;
        }
        console.log('saved data ', data);
        axios.put(`/api/release/${this.props.selectedRelease.ReleaseNumber}`, { ...data })
            .then(res => {
                this.props.saveReleaseBasicInfo({ id: data.ReleaseNumber, data: data });
                this.reset();
            }, error => {
                alert('error in updating');
            });
        if (this.state.modal) {
            this.toggle();
        }
        if (this.state.momModal) {
            this.momToggle();
        }
    }
    toggle = () => this.setState({ modal: !this.state.modal });
    momToggle = () => this.setState({ momModal: !this.state.momModal });
    getFeatureDetails(dws) {
        axios.post('/rest/featuredetail', { data: dws }).then(res => {
            this.props.saveSingleFeature({ data: res.data });
            this.props.history.push('/release/status')
        }, err => {

        })
    }
    render() {
        let featuresCount = 0;
        let statusScenarios = {};
        if (this.props.feature && this.props.feature.issues) {
            featuresCount = this.props.feature.issues.length;
            this.props.feature.issues.forEach(item => {
                if (statusScenarios[item.fields.status.name]) {
                    statusScenarios[item.fields.status.name].total += 1;
                } else {
                    statusScenarios[item.fields.status.name] = { total: 1 }
                }
            })
        }


        return (
            <div>
                {/* <Button onClick={(e) => this.call()}>Click</Button> */}
                <Row>
                    <Col xs="12" sm="12" md="5" lg="5" className="rp-summary-tables">
                        {
                            <div className='rp-app-table-header'>
                                <span className='rp-app-table-title'>Basic Info</span>
                                {
                                    this.props.currentUser && this.props.currentUser.isAdmin && this.state.basic.editOptions && this.state.basic.editOptions.length ?
                                        this.state.basic.editing ?
                                            <Fragment>
                                                <Button title="Save" size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.toggle()} >
                                                    <i className="fa fa-check-square-o"></i>
                                                </Button>
                                                <Button size="md" color="transparent" className="float-right" onClick={() => this.reset()} >
                                                    <i className="fa fa-undo"></i>
                                                </Button>
                                            </Fragment>
                                            :
                                            <Button size="md" color="transparent" className="float-right" onClick={() => this.setState({ basic: { ...this.state.basic, editing: true } })} >
                                                <i className="fa fa-pencil-square-o"></i>
                                            </Button>
                                        : null
                                }
                            </div>
                        }

                        <Table scroll responsive style={{ overflow: 'scroll', }}>
                            <tbody>

                                {

                                    [
                                        { key: 'Target Date', field: 'TargetedReleaseDate', value: this.props.selectedRelease.TargetedReleaseDate, type: 'date' },
                                        { key: 'Actual Date', field: 'ActualReleaseDate', value: this.props.selectedRelease.ActualReleaseDate, type: 'date' },
                                        { key: 'Server Type Supported', field: 'ServerType', value: this.props.selectedRelease.ServerType ? this.props.selectedRelease.ServerType.join(',') : '' },
                                        { key: 'Card Type Supported', field: 'CardType', value: this.props.selectedRelease.CardType ? this.props.selectedRelease.CardType.join(',') : '' },
                                        { key: 'Intended Customers', field: 'Customers', value: this.props.selectedRelease.Customers ? this.props.selectedRelease.Customers.join(',') : '' },
                                        { key: 'Total Features', restrictEdit: true, field: 'Total Features', value: featuresCount },
                                    ].map((item, index) => {
                                        return (
                                            <tr>
                                                <React.Fragment>
                                                    <td className='rp-app-table-key'>{item.key}</td>


                                                    {this.state.basic.editing && !item.restrictEdit &&
                                                        <td>
                                                            <Input
                                                                type={item.type ? item.type : 'text'}
                                                                key={index}
                                                                onChange={(e) => this.setState({ basic: { ...this.state.basic, updated: { ...this.state.basic.updated, [item.field]: e.target.value } } })}
                                                                placeholder={this.props.selectedRelease[item.field]}
                                                                value={this.state.basic.updated[item.field] !== undefined ?
                                                                    this.state.basic.updated[item.field] : (this.props.selectedRelease[item.field] ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : '')}
                                                            />
                                                        </td>
                                                    }

                                                    {
                                                        !this.state.basic.editing && !item.restrictEdit &&
                                                        this.props.selectedRelease[item.field] !== undefined &&
                                                        Array.isArray(this.props.selectedRelease[item.field]) &&
                                                        <td>{
                                                            this.props.selectedRelease[item.field].map(item => <Badge className='rp-array-badge'>{item}</Badge>)
                                                        }</td>
                                                    }
                                                    {!this.state.basic.editing && !item.restrictEdit &&
                                                        <td>{this.props.selectedRelease[item.field] !== undefined && !Array.isArray(this.props.selectedRelease[item.field]) && this.props.selectedRelease[item.field]}</td>
                                                    }
                                                    {!this.state.basic.editing && !item.restrictEdit &&
                                                        <td>{this.props.selectedRelease[item.field] === undefined && ''}</td>
                                                    }

                                                    {
                                                        item.restrictEdit && <td>{item.value}</td>
                                                    }
                                                </React.Fragment>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        {/* <Button className='rp-any-button' size='sm' onClick={() => this.setState({ basic: { ...this.state.basic, open: !this.state.basic.open } })}>{this.state.basic.open ? 'Less' : 'More'} </Button> */}
                        {
                            !this.state.basic.open &&
                            <div style={{ textAlign: 'center' }}>
                                <i className="fa fa-angle-down rp-rs-down-arrow" onClick={() => this.setState({ basic: { ...this.state.basic, open: !this.state.basic.open } })}></i>
                            </div>
                        }
                        {
                            this.state.basic.open &&
                            <div style={{ textAlign: 'center' }}>
                                <i className="fa fa-angle-up rp-rs-down-arrow" onClick={() => this.setState({ basic: { ...this.state.basic, open: !this.state.basic.open } })}></i>
                            </div>
                        }



                        <Collapse isOpen={this.state.basic.open}>
                            <Table scroll responsive style={{ overflow: 'scroll', }}>
                                <tbody>
                                    {
                                        [
                                            { key: 'Operating System', value: this.props.selectedRelease.FinalOS, field: 'FinalOS' },
                                            { key: 'Final Build Number', field: 'BuildNumber', value: this.props.selectedRelease.BuildNumber ? this.props.selectedRelease.BuildNumber : '' },
                                            { key: 'UBoot Number', value: this.props.selectedRelease.UbootVersion, field: 'UbootVersion' },
                                            { key: 'Docker Core RPM Number', value: this.props.selectedRelease.FinalDockerCore, field: 'FinalDockerCore' },

                                        ].map((item, index) => {
                                            return (
                                                <tr>

                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    {this.state.basic.editing &&
                                                        <td>
                                                            <Input
                                                                type={item.type ? item.type : 'text'}
                                                                key={index}
                                                                onChange={(e) => this.setState({ basic: { ...this.state.basic, updated: { ...this.state.basic.updated, [item.field]: e.target.value } } })}
                                                                placeholder={this.props.selectedRelease[item.field]}
                                                                value={this.state.basic.updated[item.field] !== undefined ?
                                                                    this.state.basic.updated[item.field] : (this.props.selectedRelease[item.field] ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : '')}

                                                            />
                                                        </td>
                                                    }
                                                    {
                                                        !this.state.basic.editing && !item.restrictEdit &&
                                                        this.props.selectedRelease[item.field] !== undefined &&
                                                        Array.isArray(this.props.selectedRelease[item.field]) &&
                                                        <td>{
                                                            this.props.selectedRelease[item.field].map(item => <Badge className='rp-array-badge'>{item}</Badge>)
                                                        }</td>
                                                    }
                                                    {!this.state.basic.editing && !item.restrictEdit &&
                                                        <td>{this.props.selectedRelease[item.field] !== undefined && !Array.isArray(this.props.selectedRelease[item.field]) && this.props.selectedRelease[item.field]}</td>
                                                    }
                                                    {!this.state.basic.editing && !item.restrictEdit &&
                                                        <td>{this.props.selectedRelease[item.field] === undefined && ''}</td>
                                                    }

                                                    {
                                                        item.restrictEdit && <td>{item.value}</td>
                                                    }


                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Collapse>
                    </Col>
                    <Col xs="12" sm="12" md="5" lg="5" className="rp-summary-tables">
                        <div className='rp-app-table-header'>
                            <span className='rp-app-table-title'>Release Status</span>
                        </div>
                        <Table scroll responsive style={{ overflow: 'scroll', }}>
                            <tbody>
                                <tr style={{ cursor: 'pointer' }} onClick={() => this.setState({ featureOpen: !this.state.featureOpen })}>
                                    <td className='rp-app-table-key' style={{ maxWidth: '3rem' }}>
                                        {
                                            !this.state.featureOpen &&
                                            <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                                        }
                                        {
                                            this.state.featureOpen &&
                                            <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                                        }
                                        Feature Status
                                    </td>
                                    <td>
                                        {
                                            Object.keys(statusScenarios).map(item =>

                                                <Badge
                                                    onClick={() => {
                                                        this.props.statusPage({ featureOpen: true, bugOpen: false, buildOpen: false, graphsOpen: false });
                                                        this.props.history.push('/release/status');
                                                    }}
                                                    className='rp-open-status-badge' style={{ marginTop: '0.5rem' }}>
                                                    <span>{item} : </span>
                                                    <span>{statusScenarios[item].total}</span>
                                                </Badge>

                                            )
                                        }

                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <Collapse isOpen={this.state.featureOpen}>
                            <Table scroll responsive style={{ overflow: 'scroll', }}>
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        <th>Summary</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.feature && this.props.feature.issues &&
                                        this.props.feature.issues.map(item => {
                                            return (
                                                <tr style={{ cursor: 'pointer' }} onClick={() => {
                                                    this.getFeatureDetails(item.self)

                                                }}>
                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    <td>{item.fields.summary}</td>
                                                    <td><Badge className='rp-open-status-badge'>{item.fields.status.name}</Badge></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Collapse>

                        <div onClick={() => {
                            this.props.statusPage({ featureOpen: false, buildOpen: false, bugOpen: true, graphsOpen: false });
                            this.props.history.push('/release/status');
                        }}>

                            <Table scroll responsive style={{ overflow: 'scroll', }}>
                                <tbody>
                                    <tr style={{ cursor: 'pointer' }} onClick={() => this.setState({ bugOpen: !this.state.bugOpen })}>
                                        <td className='rp-app-table-key'>
                                            {/* {
                                            !this.state.bugOpen &&
                                            <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                                        }
                                        {
                                            this.state.bugOpen &&
                                            <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                                        } */}
                                            Bug Status
                                    </td>
                                        <td>
                                            {
                                                this.props.bug && this.props.bug.bugCount && Object.keys(this.props.bug.bugCount.all).map((item, index) =>

                                                    <Badge className={`rp-bug-${item}-status-badge`}>
                                                        <span>{item} : </span>
                                                        <span>{this.props.bug.bugCount.all[item]}</span>
                                                    </Badge>

                                                )
                                            }

                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        {/* <Collapse isOpen={this.state.featureOpen}>
                            <Table scroll responsive style={{ overflow: 'scroll', }}>
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        <th>Summary</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.feature && this.props.feature.issues &&
                                        this.props.feature.issues.map(item => {
                                            return (
                                                <tr onClick={() => this.props.history.push('/release/status')}>
                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    <td>{item.fields.summary}</td>
                                                    <td><Badge className='rp-open-status-badge'>{item.fields.status.name}</Badge></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Collapse> */}
                        <Table scroll responsive style={{ overflow: 'scroll', }}>
                            <tbody>
                                <tr>
                                    <td className='rp-app-table-key' style={{ maxWidth: '2rem' }}>
                                        Current Build Number
                                    </td>
                                    <td>
                                        NA
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" md="5" lg="5" className="rp-summary-tables">
                        <div className='rp-app-table-header'>
                            <Link to={'/release/qastrategy'}>
                                <span className='rp-app-table-title'>QA Strategy</span>
                            </Link>
                            {
                                this.props.currentUser && this.props.currentUser.isAdmin && this.state.qaStrategy.editOptions && this.state.qaStrategy.editOptions.length ?
                                    this.state.qaStrategy.editing ?
                                        <Fragment>
                                            <Button title="Save" size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.toggle()} >
                                                <i className="fa fa-check-square-o"></i>
                                            </Button>
                                            <Button size="md" color="transparent" className="float-right" onClick={() => this.reset()} >
                                                <i className="fa fa-undo"></i>
                                            </Button>
                                        </Fragment>
                                        :
                                        <Button size="md" color="transparent" className="float-right" onClick={() => this.setState({ qaStrategy: { ...this.state.qaStrategy, editing: true } })} >
                                            <i className="fa fa-pencil-square-o"></i>
                                        </Button>
                                    : null
                            }
                        </div>

                        {/* <Link to={'/release/qastrategy'}>
                            <div>
                                <div style={this.state.screen.tcStrategyTitleStyle}>
                                    <div>Total</div>
                                    <div>{this.props.tcStrategy && this.props.tcStrategy.total}</div>
                                </div>
                                <div className="chart-wrapper">
                                    <Doughnut data={this.props.tcStrategy && this.props.tcStrategy.data} />
                                </div>
                            </div>
                        </Link> */}
                        <Table scroll responsive style={{ overflow: 'scroll', }}>
                            <tbody>
                                {
                                    [
                                        { key: 'Expected rate of Progress per week', field: 'QARateOfProgress', value: this.props.selectedRelease.QARateOfProgress ? this.props.selectedRelease.QARateOfProgress : 0 },
                                        { key: 'Test Cases', restrictEdit: true, field: 'run', value: this.props.tcStrategy ? this.props.tcStrategy.totalTests : 0 },
                                        { key: 'Test Cases Skipped', restrictEdit: true, field: 'skip', value: this.props.tcStrategy ? this.props.tcStrategy.skipped : 0 },
                                        { key: 'Test Cases Not Applicable', restrictEdit: true, field: 'na', value: this.props.tcStrategy ? this.props.tcStrategy.notApplicable : 0 },

                                        { key: 'Setups Used', restrictEdit: true, field: 'SetupsUsed', value: this.props.selectedRelease.SetupsUsed ? this.props.selectedRelease.SetupsUsed.length : 0 },
                                        { key: 'Engineers', field: 'EngineerCount', value: this.props.selectedRelease.EngineerCount ? this.props.selectedRelease.EngineerCount : 0 },
                                        { key: 'QA Start Date', field: 'QAStartDate', value: this.props.selectedRelease.QAStartDate, type: 'date' },
                                        { key: 'Target Code Freeze Date', field: 'TargetedCodeFreezeDate', value: this.props.selectedRelease.TargetedCodeFreezeDate, type: 'date' },
                                        { key: 'Upgrade Metrics Count', restrictEdit: true, field: 'UpgradeMetrics', value: this.props.selectedRelease.UpgradeMetrics ? this.props.selectedRelease.UpgradeMetrics.length : '' },

                                    ].map((item, index) => {
                                        return (
                                            <tr>
                                                <React.Fragment>

                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    {this.state.qaStrategy.editing && !item.restrictEdit ?
                                                        <td>
                                                            <Input
                                                                type={item.type ? item.type : 'text'}
                                                                key={index}
                                                                onChange={(e) => this.setState({ qaStrategy: { ...this.state.qaStrategy, updated: { ...this.state.qaStrategy.updated, [item.field]: e.target.value } } })}
                                                                placeholder={this.props.selectedRelease[item.field]}
                                                                value={

                                                                    this.state.qaStrategy.updated[item.field] !== undefined ?
                                                                        this.state.qaStrategy.updated[item.field] : (this.props.selectedRelease[item.field] ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : '')}

                                                            />
                                                            {
                                                                item.field === 'QARateOfProgress' &&
                                                                <div>
                                                                    <div className="progress-group">
                                                                        <div className="progress-group-bars">
                                                                            <Progress className="progress-xs" color="warning" value={this.state.qaStrategy.updated[item.field]} />

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </td> :
                                                        <td>

                                                            {
                                                                !this.state.basic.editing && !item.restrictEdit &&
                                                                this.props.selectedRelease[item.field] !== undefined &&
                                                                Array.isArray(this.props.selectedRelease[item.field]) &&
                                                                <span>{
                                                                    this.props.selectedRelease[item.field].map(item => <Badge className='rp-array-badge'>item</Badge>)
                                                                }</span>
                                                            }
                                                            {!this.state.basic.editing && !item.restrictEdit &&
                                                                <span>{this.props.selectedRelease[item.field] !== undefined && !Array.isArray(this.props.selectedRelease[item.field]) && this.props.selectedRelease[item.field]}</span>
                                                            }
                                                            {!this.state.basic.editing && !item.restrictEdit &&
                                                                <span>{this.props.selectedRelease[item.field] === undefined && ''}</span>
                                                            }

                                                            {/* {
                                                                item.restrictEdit && <td>{item.value}</td>
                                                            } */}

                                                            {item.restrictEdit && item.value}
                                                            {
                                                                item.field === 'QARateOfProgress' && <span>%</span>
                                                            }
                                                            {
                                                                item.field === 'QARateOfProgress' &&
                                                                <div>
                                                                    <div className="progress-group">
                                                                        <div className="progress-group-bars">
                                                                            <Progress className="progress-xs" color="warning" value={this.props.selectedRelease[item.field]} />

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </td>
                                                    }
                                                </React.Fragment>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        {/* <div className='rp-rs-hw-support'>Test Cases</div>
                        <Row>
                            <Col sm="12" md="6" lg="3" style={{ margin: '1rem' }}>
                                <span>Run</span>
                                <span style={{ marginLeft: '0.5rem' }} className='rp-app-table-key'>{this.props.tcStrategy ? this.props.tcStrategy.totalTestsRun : 0}</span>
                            </Col>
                            <Col sm="12" md="6" lg="3" style={{ margin: '1rem' }}>
                                <span>Skipped </span>
                                <span style={{ marginLeft: '0.5rem' }} className='rp-app-table-key'>{this.props.tcStrategy ? this.props.tcStrategy.skipped : 0}</span>
                            </Col>
                            <Col sm="12" md="6" lg="3" style={{ margin: '1rem' }}>
                                <span>Not Applicable</span>
                                <span style={{ marginLeft: '0.5rem' }} className='rp-app-table-key'>{this.props.tcStrategy ? this.props.tcStrategy.notApplicable : 0}</span>
                            </Col>
                        </Row> */}
                    </Col>
                    <Col xs="12" sm="12" md="5" lg="5" className="rp-summary-tables">
                        <div className='rp-app-table-header'>
                            <Link to={'/release/qastatus'}>
                                <span className='rp-app-table-title'>QA Status</span>
                            </Link>
                            {/* {
                                this.props.currentUser && this.props.currentUser.isAdmin && this.state.qaStatus.editOptions && this.state.qaStatus.editOptions.length ?
                                    this.state.qaStatus.editing ?
                                        <Fragment>
                                            <Button title="Save" size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.toggle()} >
                                                <i className="fa fa-check-square-o"></i>
                                            </Button>
                                            <Button size="md" color="transparent" className="float-right" onClick={() => this.reset()} >
                                                <i className="fa fa-undo"></i>
                                            </Button>
                                        </Fragment>
                                        :
                                        <Button size="md" color="transparent" className="float-right" onClick={() => this.setState({ qaStatus: { ...this.state.qaStatus, editing: true } })} >
                                            <i className="fa fa-pencil-square-o"></i>
                                        </Button>
                                    : null
                            } */}
                        </div>
                        <Table scroll responsive style={{ overflow: 'scroll', }}>
                            <tbody>
                                {
                                    [
                                        { key: 'Actual rate of Progress per week', field: 'ActualQARateOfProgress', value: this.props.selectedRelease.ActualQARateOfProgress ? this.props.selectedRelease.ActualQARateOfProgress : 0 },
                                        { key: 'Test Cases required to run again', restrictEdit: true, field: 'run', value: this.props.tcStrategy ? this.props.tcStrategy.needToRun : 0 },
                                    ].map((item, index) => {
                                        return (
                                            <tr>
                                                <React.Fragment>

                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    {
                                                        // this.state.qaStrategy.editing ?
                                                        // <td style={{ width: '10rem' }}>
                                                        //     <Input
                                                        //         type={item.type ? item.type : 'text'}
                                                        //         key={index}
                                                        //         onChange={(e) => this.setState({ qaStrategy: { ...this.state.qaStrategy, updated: { ...this.state.qaStrategy.updated, [item.field]: e.target.value } } })}
                                                        //         placeholder={this.props.selectedRelease[item.field]}
                                                        //         value={

                                                        //             this.state.qaStrategy.updated[item.field] !== undefined ?
                                                        //                 this.state.qaStrategy.updated[item.field] : (this.props.selectedRelease[item.field] ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : '')}

                                                        //     />
                                                        //     {
                                                        //         <div>
                                                        //             <div className="progress-group">
                                                        //                 <div className="progress-group-bars">
                                                        //                     <Progress className="progress-xs" color="warning" value={this.state.qaStrategy.updated[item.field]} />

                                                        //                 </div>
                                                        //             </div>
                                                        //         </div>
                                                        //     }
                                                        // </td> :
                                                        <td style={{ width: '10rem' }}>

                                                            {item.value}
                                                            {
                                                                item.field === 'ActualQARateOfProgress' && <span>%</span>
                                                            }
                                                            {
                                                                item.field === 'ActualQARateOfProgress' &&



                                                                <div>
                                                                    <div className="progress-group">
                                                                        <div className="progress-group-bars">
                                                                            <Progress className="progress-xs" color="warning" value={this.props.selectedRelease[item.field]} />

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }

                                                        </td>
                                                    }
                                                </React.Fragment>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <Link to={'/release/qastatus'}>
                            <div className="chart-wrapper">
                                <div style={this.state.screen.tcSummaryTitleStyle}>
                                    <div>Total</div>
                                    <div>{this.props.tcSummary && this.props.tcSummary.total}</div>
                                </div>
                                <Doughnut data={this.props.tcSummary && this.props.tcSummary.data} />
                            </div>
                        </Link>
                        <div className='rp-app-table-key' style={{
                            marginLeft: '0.5rem',
                            textAlign: 'center',
                            marginTop: '2.5rem',
                            marginBottom: '0.5rem'
                        }}>Weekly Rate of Progress (%)</div>
                        <div className="chart-wrapper mx-3" style={{ height: '15rem' }}>
                            <Line data={cardChartData2} options={cardChartOpts2} height={250} />
                        </div>
                    </Col>
                </Row>

                <Row>

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
    tcSummary: getTCForStatus(state, state.release.current.id),
    tcStrategy: getTCForStrategy(state, state.release.current.id),
    feature: state.feature.all[state.release.current.id],
    bug: state.bug.all[state.release.current.id],
}
)


export default connect(mapStateToProps, { saveReleaseBasicInfo, statusPage, saveFeatures, saveBugs, saveSingleFeature })(ReleaseSummary);
