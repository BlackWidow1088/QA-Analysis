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
    Modal, ModalHeader, ModalBody, ModalFooter, Table, Collapse, Progress
} from 'reactstrap';
import { connect } from 'react-redux';
import { saveReleaseBasicInfo } from '../../../actions';
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
const mainChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Feature 1',
            backgroundColor: hexToRgba(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: data1,
        },
        {
            label: 'Feature 2',
            backgroundColor: 'transparent',
            borderColor: brandSuccess,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: data2,
        },
        {
            label: 'Feature 3',
            backgroundColor: 'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5],
            data: data3,
        },
    ],
};
const polar = {
    datasets: [
        {
            data: [
                11,
                16,
                7,
                3,
                14,
            ],
            backgroundColor: [
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#E7E9ED',
                '#36A2EB',
            ],
            label: 'My dataset' // for legend
        }],
    labels: [
        'Storage',
        'Network',
        'Management',
        'QoS',
        'Helm',
    ],
};

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
            qaStrategy: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false },
            qaStatus: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false }
        }
    }

    componentDidMount() {
        this.reset();
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
            qaStrategy: { editOptions: [TABLE_OPTIONS.EDIT], editing: false, updated: {}, open: false }

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
    updateDate = (values) => {
        let currentData = this.props.selectedRelease;
        [0, 1, 2].forEach((index) => {
            switch (index) {
                case 0:
                    if (values.edit[index]) {
                        currentData.TargetedReleaseDate = values.edit[index].new.target;
                        currentData.ActualReleaseDate = values.edit[index].new.actual;
                    }
                    break;
                case 1:
                    if (values.edit[index]) {
                        currentData.TargetedCodeFreezeDate = values.edit[index].new.target;
                        currentData.ActualCodeFreezeDate = values.edit[index].new.actual;
                    }
                    break;
                case 2:
                    if (values.edit[index]) {
                        currentData.TargetedQAStartDate = values.edit[index].new.target;
                        currentData.QAStartDate = values.edit[index].new.actual;
                    }
                    break;
                default:
                    break;
            }
        });
        this.save(currentData);
        // for(let index in values.edit) {
        //     currentData.splice(index, 1, values.edit[index])
        // };
        // for (let index in values.delete) {
        //     currentData.splice(index, 1);
        // };

    }

    updateFinal = (values) => {
        let currentData = this.props.selectedRelease;
        [0, 1, 2, 3, 4, 5, 6].forEach((index) => {
            switch (index) {
                case 0:
                    if (values.edit[index]) {
                        currentData.FinalOS = values.edit[index].new.value;
                    }
                    break;
                case 1:
                    if (values.edit[index]) {
                        currentData.FinalDockerCore = values.edit[index].new.value;
                    }
                    break;
                case 2:
                    if (values.edit[index]) {
                        currentData.UbootVersion = values.edit[index].new.value;
                    }
                    break;
                case 3:
                    if (values.edit[index]) {
                        currentData.BuildNumber = values.edit[index].new.value;
                    }

                    break;
                case 4:
                    if (values.edit[index]) {
                        currentData.Customers = values.edit[index].new.value.split(',');
                    }
                    break;
                case 5:
                    if (values.edit[index]) {
                        currentData.TargetedReleaseDate = values.edit[index].new.value;
                    }
                    break;
                case 6:
                    if (values.edit[index]) {
                        currentData.ActualReleaseDate = values.edit[index].new.value;
                    }
                    break;
                default:
                    break;
            }
        });
        this.save(currentData);
    }
    updateQA = (values) => {
        let currentData = this.props.selectedRelease;
        [0, 1, 2, 3].forEach((index) => {
            switch (index) {
                case 0:
                    if (values.edit[index]) {
                        currentData.EngineerCount = values.edit[index].new.value ? values.edit[index].new.value : 0;
                    }
                    break;
                case 1:
                    if (values.edit[index]) {
                        currentData.QAStartDate = values.edit[index].new.value;
                    }
                    break;
                case 2:
                    if (values.edit[index]) {
                        currentData.TargetedCodeFreezeDate = values.edit[index].new.value;
                    }
                    break;
                case 3:
                    if (values.edit[index]) {
                        let um = values.edit[index].new.value.split(',')
                        currentData.UpgradeMetrics = values.edit[index].new.value.length ? um : [];
                    }
                    break;
                default:
                    break;
            }
        });
        this.save(currentData);
    }
    updateFeatures = (values) => {
        let currentData = this.props.selectedRelease;
        if (!currentData.Features) {
            currentData.Features = [];
        }
        for (let index in values.edit) {
            if (currentData.Features[index]) {
                currentData.Features[index] = values.edit[index].new
            }
        }
        for (let index in values.delete) {
            if (currentData.Features[index]) {
                currentData.Features.splice(index, 1, null);
            }
        }
        currentData.Features = currentData.Features.filter(item => item);
        let added = values.add.filter(item => item)
        currentData.Features = [...currentData.Features, ...added]
        this.save(currentData);
    }
    updateHardware = (values) => {
        let currentData = this.props.selectedRelease;
        [0, 1].forEach((index) => {
            switch (index) {
                case 0:
                    if (values.edit[index]) {
                        currentData.ServerType = values.edit[index].new.value.split(',');
                    }
                    break;
                case 1:
                    if (values.edit[index]) {
                        currentData.CardType = values.edit[index].new.value.split(',');
                    }
                    break;
                default:
                    break;
            }
        });
        this.save(currentData);
    }
    render() {
        return (
            <div>
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
                                        { key: 'Operating System', value: this.props.selectedRelease.FinalOS, field: 'FinalOS' },
                                        { key: 'Docker Core RPM Number', value: this.props.selectedRelease.FinalDockerCore, field: 'FinalDockerCore' },
                                        { key: 'Build Number', field: 'BuildNumber', value: this.props.selectedRelease.BuildNumber ? this.props.selectedRelease.BuildNumber : '' },

                                    ].map((item, index) => {
                                        return (
                                            <tr>
                                                <React.Fragment>
                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    {this.state.basic.editing ?
                                                        <td>
                                                            <Input
                                                                type={item.type ? item.type : 'text'}
                                                                key={index}
                                                                onChange={(e) => this.setState({ basic: { ...this.state.basic, updated: { ...this.state.basic.updated, [item.field]: e.target.value } } })}
                                                                placeholder={this.props.selectedRelease[item.field]}
                                                                value={this.state.basic.updated[item.field] !== undefined ?
                                                                    this.state.basic.updated[item.field] : (this.props.selectedRelease[item.field] ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : '')}
                                                            />
                                                        </td> :
                                                        <td>{this.props.selectedRelease[item.field]}</td>}
                                                </React.Fragment>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <div className='rp-rs-hw-support'>Hardware Support</div>
                        <Table scroll responsive style={{ overflow: 'scroll', }}>
                            <tbody>
                                {
                                    [
                                        { key: 'Server Type', field: 'ServerType', value: this.props.selectedRelease.ServerType ? this.props.selectedRelease.ServerType.join(',') : '' },
                                        { key: 'Card Type', field: 'CardType', value: this.props.selectedRelease.CardType ? this.props.selectedRelease.CardType.join(',') : '' },
                                    ].map((item, index) => {
                                        return (
                                            <tr>
                                                <React.Fragment>
                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    {this.state.basic.editing ?
                                                        <td>
                                                            <Input
                                                                type={item.type ? item.type : 'text'}
                                                                key={index}
                                                                onChange={(e) => this.setState({ basic: { ...this.state.basic, updated: { ...this.state.basic.updated, [item.field]: e.target.value } } })}
                                                                placeholder={this.props.selectedRelease[item.field]}
                                                                value={this.state.basic.updated[item.field] !== undefined ?
                                                                    this.state.basic.updated[item.field] : (this.props.selectedRelease[item.field] ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : '')}
                                                            />
                                                        </td> :
                                                        <td>{this.props.selectedRelease[item.field] !== undefined ? this.props.selectedRelease[item.field].join(',') : ''}</td>}
                                                </React.Fragment>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <Button className='rp-any-button' size='sm' onClick={() => this.setState({ basic: { ...this.state.basic, open: !this.state.basic.open } })}>{this.state.basic.open ? 'Less' : 'More'} </Button>
                        <Collapse isOpen={this.state.basic.open}>
                            <Table scroll responsive style={{ overflow: 'scroll', }}>
                                <tbody>
                                    {
                                        [
                                            { key: 'UBoot Number', value: this.props.selectedRelease.UbootVersion, field: 'UbootVersion' },
                                            { key: 'Customers', field: 'Customers', value: this.props.selectedRelease.Customers ? this.props.selectedRelease.Customers.join(',') : '' },
                                            { key: 'Target Date', field: 'TargetedReleaseDate', value: this.props.selectedRelease.TargetedReleaseDate, type: 'date' },
                                            { key: 'Actual Date', field: 'ActualReleaseDate', value: this.props.selectedRelease.ActualReleaseDate, type: 'date' },
                                        ].map((item, index) => {
                                            return (
                                                <tr>

                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    {this.state.basic.editing ?
                                                        <td>
                                                            <Input
                                                                type={item.type ? item.type : 'text'}
                                                                key={index}
                                                                onChange={(e) => this.setState({ basic: { ...this.state.basic, updated: { ...this.state.basic.updated, [item.field]: e.target.value } } })}
                                                                placeholder={this.props.selectedRelease[item.field]}
                                                                value={this.state.basic.updated[item.field] !== undefined ?
                                                                    this.state.basic.updated[item.field] : (this.props.selectedRelease[item.field] ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : '')}

                                                            />
                                                        </td> :
                                                        <td>{this.props.selectedRelease[item.field] !== undefined ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : ''}</td>}


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
                        <div style={{ top: '50%', left: '50%', position: 'absolute' }}>NOT AVAILABLE</div>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" md="5" lg="5" className="rp-summary-tables">
                        <div className='rp-app-table-header'>
                            {/* <Link to={'/release/qastrategy'}> */}
                            <span className='rp-app-table-title'>QA Strategy</span>
                            {/* </Link> */}
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
                        {

                        }
                        {/* <Link to={'/release/qastrategy'}> */}
                        <div className="chart-wrapper">
                            <Doughnut data={this.props.tcStrategy} />
                        </div>
                        {/* </Link> */}
                        <Table scroll responsive style={{ overflow: 'scroll', }}>
                            <tbody>
                                {
                                    [

                                        { key: 'Engineers Employed', field: 'EngineerCount', value: this.props.selectedRelease.EngineerCount ? this.props.selectedRelease.EngineerCount : 0 },
                                        { key: 'QA Start Date', field: 'QAStartDate', value: this.props.selectedRelease.QAStartDate, type: 'date' },
                                        { key: 'Target Code Freeze Date', field: 'TargetedCodeFreezeDate', value: this.props.selectedRelease.TargetedCodeFreezeDate, type: 'date' },
                                        { key: 'Upgrade Metrics', field: 'UpgradeMetrics', value: this.props.selectedRelease.UpgradeMetrics ? this.props.selectedRelease.UpgradeMetrics.join(',') : '' },
                                        { key: 'Expected Rate of Progress', field: 'QARateOfProgress', value: this.props.selectedRelease.QARateOfProgress ? this.props.selectedRelease.QARateOfProgress : 0 }
                                    ].map((item, index) => {
                                        return (
                                            <tr>
                                                <React.Fragment>
                                                    <td className='rp-app-table-key'>{item.key}</td>
                                                    {this.state.qaStrategy.editing ?
                                                        <td>
                                                            <Input
                                                                type={item.type ? item.type : 'text'}
                                                                key={index}
                                                                onChange={(e) => this.setState({ qaStrategy: { ...this.state.qaStrategy, updated: { ...this.state.qaStrategy.updated, [item.field]: e.target.value } } })}
                                                                placeholder={this.props.selectedRelease[item.field]}
                                                                value={this.state.qaStrategy.updated[item.field] !== undefined ?
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
                                                        <td>{this.props.selectedRelease[item.field] !== undefined ? Array.isArray(this.props.selectedRelease[item.field]) ? this.props.selectedRelease[item.field].join(',') : this.props.selectedRelease[item.field] : ''}
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
                                                        </td>}
                                                </React.Fragment>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
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
                        <Link to={'/release/qastatus'}>
                            <div className="chart-wrapper">
                                <Doughnut data={this.props.tcSummary} />
                            </div>
                        </Link>
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
}
)


export default connect(mapStateToProps, { saveReleaseBasicInfo })(ReleaseSummary);
