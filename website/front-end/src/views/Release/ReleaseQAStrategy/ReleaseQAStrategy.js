// CUSTOMER USING THIS RELEASE (OPTIONAL) (M)
// Issues faced on customer side (jira - list)
// customers to be given to
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input } from 'reactstrap';
import { connect } from 'react-redux';
import AppTable from '../../../components/AppTable/AppTable';
import { getCurrentRelease } from '../../../reducers/release.reducer';
import { getTCStatusDomains } from '../../../reducers/release.reducer';
import { TABLE_OPTIONS } from '../../../constants';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { saveTestCase, saveTestCaseStatus, saveSingleTestCase } from '../../../actions';
import './ReleaseQAStrategy.scss'
class ReleaseQAStrategy extends Component {
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
            addTC: {}
        }
    }
    componentDidMount() {

    }
    save(data) {
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
        console.log('saved data ', data);
        axios.put(`/api/tcinfo/${this.props.selectedRelease.ReleaseNumber}`, { ...data })
            .then(res => {
                alert('success');
                this.props.saveSingleTestCase({ id: this.props.selectedRelease.ReleaseNumber, data: data });
                // this.props.saveReleaseBasicInfo({ id: data.ReleaseNumber, data: data });
                this.setState({ isEditing: false });
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
    doughnut = {
        labels: [
            'Red',
            'Green',
            'Yellow',
        ],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                ],
            }],
    };
    updateTestCase = (values) => {
        let added = values.add.filter(item => item)[0];
        this.save(added);
    }
    createTC = () => {
        this.props.history.push('/release/addtestcase');
    }
    render() {
        let style = {
            textUnderline: true,
            color: 'blue'
        }
        return null;
    }
}
const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    selectedRelease: getCurrentRelease(state, state.release.current.id),
    selectedTC: state.testcase.all[state.release.current.id],
    // selectedTCStatus: state.testcase.status[state.release.current.id],
    doughnuts: getTCStatusDomains(state, state.release.current.id)
})
export default connect(mapStateToProps, { saveTestCase, saveTestCaseStatus, saveSingleTestCase })(ReleaseQAStrategy);