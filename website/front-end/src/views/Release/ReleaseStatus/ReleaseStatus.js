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
import { alldomains, getTCStatusForSunburst } from '../../../reducers/release.reducer';
import { TABLE_OPTIONS } from '../../../constants';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { saveSingleFeature } from '../../../actions';
import './ReleaseStatus.scss'
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
class ReleaseStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addTC: {},
            open: false,
            width: window.screen.availWidth > 1700 ? 500 : 380,
            featureOpen: true,
            buildOpen: false,
            bugOpen: false,
            graphsOpen: false
        }
    }
    componentDidMount() {
        if (!this.props.singleFeature.fields) {
            if (this.props.feature && this.props.feature.issues) {
                this.getFeatureDetails(this.props.feature.issues[0].self)
            }
        }
        if (this.props.statusPage) {
            this.setState({ ...this.state, ...this.props.statusPage });
        }
    }

    getFeatureDetails(dws) {
        axios.post('/rest/featuredetail', { data: dws }).then(res => {
            this.props.saveSingleFeature({ data: res.data });
        }, err => {

        })
    }
    render() {
        return (
            <div>

                <Row>
                    <Col xs="11" sm="11" md="11" lg="11" className="rp-summary-tables" style={{ 'margin-left': '1.5rem' }}>
                        <div className='rp-app-table-header' style={{ cursor: 'pointer' }} onClick={() => this.setState({ buildOpen: !this.state.buildOpen })}>
                            {
                                !this.state.buildOpen &&
                                <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                            }
                            {
                                this.state.buildOpen &&
                                <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                            }
                            <span className='rp-app-table-title'>Upgrade Metrics and Risks</span>
                        </div>
                        <Collapse isOpen={this.state.buildOpen}>
                            <Row>
                                <Col xs="11" sm="11" md="11" lg="4">
                                    <div style={{ marginLeft: '1rem', marginTop: '1rem', overflowY: 'scroll', maxHeight: '30rem' }}>
                                        <div className='rp-rs-hw-support'>Upgrade Metrics</div>
                                        <Table scroll responsive style={{ overflow: 'scroll' }}>
                                            <thead>
                                                <tr>
                                                    <th>From Version</th>
                                                    <th>To Version</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.props.selectedRelease.UpgradeMetrics && this.props.selectedRelease.UpgradeMetrics.map(item =>
                                                        <tr>
                                                            <td><Badge className='rp-feature-Open-status-badge'>{item}</Badge></td>
                                                            <td><Badge className='rp-feature-Closed-status-badge'>{this.props.selectedRelease.ReleaseNumber}</Badge></td>
                                                        </tr>
                                                    )
                                                }

                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col xs="11" sm="11" md="11" lg="8">
                                    <div className='rp-rs-hw-support'>Risks and Red Flags</div>
                                    <Input readOnly={true} type="textarea" name="risksRedFlags" id="risksRedFlags" rows="5"
                                        placeholder="Content..." value={this.props.selectedRelease.RedFlagsRisks} />
                                </Col>
                            </Row>
                        </Collapse>
                    </Col>
                </Row>













                <Row>
                    <Col xs="11" sm="11" md="11" lg="11" className="rp-summary-tables" style={{ 'margin-left': '1.5rem' }}>
                        <div className='rp-app-table-header' style={{ cursor: 'pointer' }} onClick={() => this.setState({ featureOpen: !this.state.featureOpen })}>
                            {
                                !this.state.featureOpen &&
                                <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                            }
                            {
                                this.state.featureOpen &&
                                <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                            }
                            <span className='rp-app-table-title'>Features</span>
                        </div>
                        <Collapse isOpen={this.state.featureOpen}>

                            <Row>
                                <Col xs="11" sm="11" md="11" lg="4">
                                    <div style={{ marginLeft: '1rem', marginTop: '1rem', overflowY: 'scroll', maxHeight: '30rem' }}>
                                        <Table scroll responsive style={{ overflow: 'scroll' }}>
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
                                                            <tr style={{ cursor: 'pointer' }} onClick={() => this.getFeatureDetails(item.self)}>
                                                                <td className='rp-app-table-key'>{item.key}</td>
                                                                <td>{item.fields.summary}</td>
                                                                <td><Badge className='rp-open-status-badge'>{item.fields.status.name}</Badge></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col xs="11" sm="11" md="11" lg="8">
                                    {
                                        this.props.singleFeature && this.props.singleFeature.fields &&

                                        <Row style={{ marginLeft: '0.5rem', maxHeight: '30rem', overflowY: 'scroll' }}>
                                            <div className='rp-rs-hw-support'>{this.props.singleFeature.key}</div>


                                            <Table scroll responsive style={{ overflow: 'scroll' }}>
                                                <tbody>
                                                    <tr>
                                                        <td className='rp-app-table-key'>Summary</td>
                                                        <td className='rp-app-table-key'>{this.props.singleFeature.fields.summary}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='rp-app-table-key'>Created</td>
                                                        <td className='rp-app-table-key'>{this.props.singleFeature.fields.created}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='rp-app-table-key'>Updated</td>
                                                        <td className='rp-app-table-key'>{this.props.singleFeature.fields.updated}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='rp-app-table-key'>Priority</td>
                                                        <td className='rp-app-table-key'><Badge className={`rp-priority-${this.props.singleFeature.fields.priority.name}-status-badge`} style={{ marginTop: '0.5rem' }}>
                                                            {this.props.singleFeature.fields.priority.name}</Badge></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='rp-app-table-key'>Progress</td>
                                                        <td className='rp-app-table-key'>{this.props.singleFeature.fields.progress.progress}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='rp-app-table-key'>Status</td>
                                                        <td className='rp-app-table-key'><Badge className={`rp-feature-${this.props.singleFeature.fields.status.name}-status-badge`} style={{ marginTop: '0.5rem' }}>{this.props.singleFeature.fields.status.name}</Badge></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <div className='rp-rs-hw-support'>Subtasks</div>
                                            <Table scroll responsive style={{ overflow: 'scroll' }}>
                                                <tbody>
                                                    {

                                                        this.props.singleFeature.fields.subtasks.map(item => {
                                                            return (
                                                                <tr>
                                                                    <td>{item.key}</td>
                                                                    <td>{item.fields.summary}</td>
                                                                    <td><Badge className={`rp-feature-${item.fields.status.name}-status-badge`} style={{ marginTop: '0.5rem' }}>
                                                                        {item.fields.status.name}</Badge></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </Table>

                                        </Row>
                                    }
                                </Col>
                            </Row>
                        </Collapse>
                    </Col>
                </Row>



                <Row>
                    <Col xs="11" sm="11" md="11" lg="11" className="rp-summary-tables" style={{ 'margin-left': '1.5rem' }}>
                        <div className='rp-app-table-header' style={{ cursor: 'pointer' }} onClick={() => this.setState({ bugOpen: !this.state.bugOpen })}>
                            {
                                !this.state.bugOpen &&
                                <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                            }
                            {
                                this.state.bugOpen &&
                                <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                            }
                            <span className='rp-app-table-title'>Bugs</span>
                        </div>
                        <Collapse isOpen={this.state.bugOpen}>
                            <Row>
                                <Col xs="11" sm="11" md="11" lg="8">
                                    <div style={{ marginLeft: '1rem', marginTop: '1rem', overflowY: 'scroll', maxHeight: '30rem' }}>
                                        <Table scroll responsive style={{ overflow: 'scroll' }}>
                                            <thead>
                                                <tr>
                                                    <th>Bug</th>
                                                    <th>Summary</th>
                                                    <th>Status</th>
                                                    <th>Priority</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.props.bug && this.props.bug.bug && this.props.bug.bug.issues &&
                                                    this.props.bug.bug.issues.map(item => {
                                                        return (
                                                            <tr style={{ cursor: 'pointer' }}>
                                                                <td className='rp-app-table-key'>{item.key}</td>
                                                                <td>{item.fields.summary}</td>
                                                                <td><Badge className={`rp-bug-${item.fields.status.name}-status-badge`}>{item.fields.status.name}</Badge></td>
                                                                <td><Badge className={`rp-priority-${item.fields.status.name}-status-badge`}>{item.fields.status.name}</Badge></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col xs="11" sm="11" md="11" lg="4">
                                    <Table scroll responsive style={{ overflow: 'scroll' }}>
                                        <tbody>
                                            <tr>
                                                <td className='rp-app-table-key'>All</td>
                                                <td>
                                                    {
                                                        this.props.bug && Object.keys(this.props.bug.bugCount.all).map(item =>
                                                            <Badge className={`rp-bug-${item}-status-badge`}>
                                                                <span>{item} : </span>
                                                                <span>{this.props.bug.bugCount.all[item]}</span>
                                                            </Badge>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='rp-app-table-key'>Priority</td>
                                                <td>
                                                    {
                                                        this.props.bug && Object.keys(this.props.bug.bugCount.category).map(item =>
                                                            <Badge className={`rp-priority-${item}-status-badge`}>
                                                                <span>{item} : </span>
                                                                <span>{this.props.bug.bugCount.category[item].total}</span>
                                                            </Badge>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Collapse>
                    </Col>
                </Row>

                <Row>
                    <Col xs="11" sm="11" md="11" lg="11" className="rp-summary-tables" style={{ 'margin-left': '1.5rem' }}>
                        <div className='rp-app-table-header' style={{ cursor: 'pointer' }} onClick={() => this.setState({ graphsOpen: !this.state.graphsOpen })}>
                            {
                                !this.state.graphsOpen &&
                                <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                            }
                            {
                                this.state.graphsOpen &&
                                <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                            }
                            <span className='rp-app-table-title'>Statistics</span>
                        </div>
                        <Collapse isOpen={this.state.graphsOpen}>
                            <Row>
                                <Col xs="11" sm="11" md="11" lg="8">
                                    <div style={{ marginLeft: '1rem', marginTop: '1rem', overflowY: 'scroll', maxHeight: '30rem' }}>

                                    </div>
                                </Col>
                                <Col xs="11" sm="11" md="11" lg="4">
                                </Col>
                            </Row>
                        </Collapse>
                    </Col>
                </Row>

            </div >)
    }
}
const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    selectedRelease: getCurrentRelease(state, state.release.current.id),
    selectedTC: state.testcase.all[state.release.current.id],
    feature: state.feature.all[state.release.current.id],
    bug: state.bug.all[state.release.current.id],
    singleFeature: state.feature.single,
    statusPage: state.app.statusPage
})
export default connect(mapStateToProps, { saveSingleFeature })(ReleaseStatus);








