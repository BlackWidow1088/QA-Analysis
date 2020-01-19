// CUSTOMER USING THIS RELEASE (OPTIONAL) (M)
// Issues faced on customer side (jira - list)
// customers to be given to
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getCurrentRelease } from '../../../reducers/release.reducer';
import { saveUserPendingApproval, saveSingleTestCase, saveTestCase, updateTCEdit } from '../../../actions';
import {
    Col, Row, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Collapse, UncontrolledPopover, PopoverHeader, PopoverBody
} from 'reactstrap';
import './PendingForApproval.scss';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";
import CheckBoxRenderer from '../components/CheckBoxRenderer';
// import EditTC from '../../views/Release/ReleaseTestMetrics/EditTC';

class PendingForApproval extends Component {
    editedRows = {};
    isAnyChanged = false;
    workingStatusOptions = [{ value: 'APPROVED', text: 'APPROVE' }, { value: 'UNAPPROVED', text: 'UNAPPROVE' }];
    constructor(props) {
        super(props);
        this.state = {
            multi: { Assignee: null },
            rowsChecked: {},
            rowSelect: false,
            isEditing: false,
            delete: false,
            editColumnDefs: [
                {
                    headerName: "Date", field: "Date", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Domain", field: "Domain", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "SubDomain", field: "SubDomain", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Scenario", field: "Scenario", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Tc ID", field: "TcID", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Tc Name", field: "TcName", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Card Type", field: "CardType", sortable: true, filter: true, cellStyle: this.renderEditedCell,

                },
                {
                    headerName: "Server Type", field: "ServerType", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Status", field: "Status", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "OrchestrationPlatform", field: "OrchestrationPlatform", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Description", field: "Description", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Notes", field: "Notes", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Steps", field: "Steps", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "ExpectedBehavior", field: "ExpectedBehavior", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Master", field: "Master", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Assignee", field: "Assignee", editable: true, sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Tag", field: "Tag", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },

            ],
            columnDefs: [
                // { headerName: '', field: 'checked', cellRenderer: "checkboxRenderer" },
                {
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    headerName: "Domain", field: "Domain", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100'

                },
                {
                    headerName: "Sub Domain", field: "SubDomain", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100',

                },
                {
                    headerName: "Tc ID", field: "TcID", sortable: true, filter: true, cellStyle: this.renderEditedCell
                },
                {
                    headerName: "Tc Name", field: "TcName", sortable: true, filter: true, cellStyle: this.renderEditedCell
                },
                {
                    headerName: "Card Type", field: "CardType", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100'
                },
                {
                    headerName: "Build", field: "Build", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100'
                },
                {
                    headerName: "Status", field: "CurrentStatus", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100'
                },
                {
                    headerName: "Priority", field: "Priority", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100'
                },
                {
                    headerName: "Assignee", field: "Assignee", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100'
                },
                {
                    headerName: "Server Type", field: "ServerType", sortable: true, filter: true, cellStyle: this.renderEditedCell
                }
            ],
            defaultColDef: { resizable: true },

            e2eColumnDefs: [{
                headerName: "Build", field: "e2eBuild", sortable: true, filter: true,
            },
            {
                headerName: "Date", field: "Date", sortable: true, filter: true,
            },
            {
                headerName: "Result", field: "Result", sortable: true, filter: true,
            },
            {
                headerName: "URL", field: "logURL", sortable: true, filter: true,
            },
            {
                headerName: "Notes", field: "Notes", sortable: true, filter: true,
            },
            ],
            activityColumnDefs: [{
                headerName: "Date", field: "Date", sortable: true, filter: true,
            },
            {
                headerName: "Summary", field: "Header", sortable: true, filter: true,
            },
            {
                headerName: "URL", field: "logURL", sortable: true, filter: true,
            },
            {
                headerName: "Comments", field: "StatusChangeComments", sortable: true, filter: true,
            },
            ],
            modules: AllCommunityModules
        }
    }

    getTC(e) {
        axios.get(`/test/${this.props.selectedRelease.ReleaseNumber}/tcinfo/details/id/${e.TcID}`)
            .then(res => {
                this.props.saveSingleTestCase(res.data);
                this.props.updateTCEdit({ ...res.data, errors: {}, original: res.data });
            })
            .catch(err => {
                this.deselect();
            })
    }
    deselect() {
        this.gridApi.deselectAll();
        this.props.saveSingleTestCase({});
        this.props.updateTCEdit({ Master: true, errors: {}, original: null });
    }
    // selectAll() {
    //     this.gridApi.selectAll();
    // }
    // renderCheckBox = (params) => {
    //     return (
    //         <Input type="checkbox" onChange={() => this.onCheckBoxChange(params)} />
    //     )
    //     // return `<input type='checkbox' onChange={(e) => this.onCheckBoxChange(${params})} ${params.value ? 'checked' : ''} />`
    // }
    // onCheckBoxChange = (params) => {
    //     params.value = !params.value;
    //     if (params.value) {
    //         this.rowsChecked[params.data.TcID] = true;
    //     } else {
    //         this.rowsChecked[params.data.TcID] = false;
    //     }
    // }
    renderEditedCell = (params) => {
        let editedInRow = this.editedRows[`${params.data.TcID}_${params.data.CardType}`] && this.editedRows[`${params.data.TcID}_${params.data.CardType}`][params.colDef.field] && this.editedRows[`${params.data.TcID}_${params.data.CardType}`][params.colDef.field].originalValue !== params.value;
        let restored = this.editedRows[`${params.data.TcID}_${params.data.CardType}`] && this.editedRows[`${params.data.TcID}_${params.data.CardType}`][params.colDef.field] && this.editedRows[`${params.data.TcID}_${params.data.CardType}`][params.colDef.field].originalValue === params.value;
        if (editedInRow) {
            this.isAnyChanged = true;
            this.editedRows[`${params.data.TcID}_${params.data.CardType}`].Changed = true;
            return {
                backgroundColor: 'rgb(209, 255, 82)',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: 'rgb(255, 166, 0)'
            };
        }
        if (restored) {
            this.editedRows[`${params.data.TcID}_${params.data.CardType}`].Changed = false;
        }
        return { backgroundColor: '' };
    }
    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };
    onE2EGridReady = params => {
        this.E2EGridApi = params.api;
    };
    onActivityGridReady = params => {
        this.activityGridApi = params.api;
    };
    onCellEditingStarted = params => {
        if (this.editedRows[`${params.data.TcID}_${params.data.CardType}`]) {
            if (this.editedRows[`${params.data.TcID}_${params.data.CardType}`][params.colDef.field]) {
                this.editedRows[`${params.data.TcID}_${params.data.CardType}`][params.colDef.field] =
                    { ...this.editedRows[`${params.data.TcID}_${params.data.CardType}`][params.colDef.field], oldValue: params.value }
            } else {
                this.editedRows[`${params.data.TcID}_${params.data.CardType}`] =
                    { ...this.editedRows[`${params.data.TcID}_${params.data.CardType}`], [params.colDef.field]: { oldValue: params.value, originalValue: params.value } }
            }
        } else {
            this.editedRows[`${params.data.TcID}_${params.data.CardType}`] = { [params.colDef.field]: { oldValue: params.value, originalValue: params.value } }
        }
    }
    // onCellEditing = (params, field, value) => {
    //     if (this.editedRows[`${params.TcID}_${params.CardType}`]) {
    //         if (this.editedRows[`${params.TcID}_${params.CardType}`][field]) {
    //             this.editedRows[`${params.TcID}_${params.CardType}`][field] =
    //                 { ...this.editedRows[`${params.TcID}_${params.CardType}`][field], oldValue: params[field], newValue: value }
    //         } else {
    //             this.editedRows[`${params.TcID}_${params.CardType}`] =
    //                 { ...this.editedRows[`${params.TcID}_${params.CardType}`], [field]: { oldValue: params[field], originalValue: params[field], newValue: value } }
    //         }
    //     } else {
    //         this.editedRows[`${params.TcID}_${params.CardType}`] = {
    //             TcID: { oldValue: `${params.TcID}`, originalValue: `${params.TcID}`, newValue: `${params.TcID}` },
    //             CardType: { oldValue: `${params.CardType}`, originalValue: `${params.CardType}`, newValue: `${params.CardType}` },
    //             [field]: { oldValue: params[field], originalValue: params[field], newValue: value }
    //         }
    //     }
    // }
    onCellEditing = (params, fields, values) => {
        fields.forEach((field, index) => {
            if (this.editedRows[`${params.TcID}_${params.CardType}`]) {
                if (this.editedRows[`${params.TcID}_${params.CardType}`][field]) {
                    this.editedRows[`${params.TcID}_${params.CardType}`][field] =
                        { ...this.editedRows[`${params.TcID}_${params.CardType}`][field], oldValue: params[field], newValue: values[index] }
                } else {
                    this.editedRows[`${params.TcID}_${params.CardType}`] =
                        { ...this.editedRows[`${params.TcID}_${params.CardType}`], [field]: { oldValue: params[field], originalValue: params[field], newValue: values[index] } }
                }
            } else {
                this.editedRows[`${params.TcID}_${params.CardType}`] = {
                    TcID: { oldValue: `${params.TcID}`, originalValue: `${params.TcID}`, newValue: `${params.TcID}` },
                    CardType: { oldValue: `${params.CardType}`, originalValue: `${params.CardType}`, newValue: `${params.CardType}` },
                    [field]: { oldValue: params[field], originalValue: params[field], newValue: values[index] }
                }
            }
        })

    }

    getEditedCells() {
        var cellDefs = this.gridApi.getEditingCells();
        console.log('edited cells ', cellDefs);
    }
    onFilterTextBoxChanged(value) {
        this.deselect();
        this.setState({ domain: null, subDomain: null, CardType: null, rowSelect: false });
        this.gridApi.setQuickFilter(value);
    }
    onE2EFilterTextBoxChanged(value) {
        this.E2EGridApi.setQuickFilter(value);
    }
    onActivityFilterTextBoxChanged(value) {
        this.activityGridApi.setQuickFilter(value);
    }
    filterData({ Domain, SubDomain, CardType }) {
        return this.props.data.filter(item => {
            let domain = Domain && Domain !== '' ? Domain : item.Domain;
            let subdomain = SubDomain && SubDomain !== '' ? SubDomain : item.SubDomain;
            let card = CardType && CardType !== '' ? CardType : item.CardType;
            if (domain === item.Domain && subdomain === item.SubDomain && card === item.CardType) {
                return true;
            }
            return false;
        })
    }
    toggleDelete = () => {
        this.setState({ delete: !this.state.delete })
    };
    onSelectDomain(domain) {
        this.deselect();
        if (domain === '') {
            domain = null;
        }
        this.setState({ domain: domain, subDomain: null, data: this.filterData({ Domain: domain, SubDomain: null, CardType: this.state.CardType }), rowSelect: false });
    }
    onSelectSubDomain(subDomain) {
        this.deselect();
        if (subDomain === '') {
            subDomain = null;
        }
        this.setState({ subDomain: subDomain, data: this.filterData({ Domain: this.state.domain, SubDomain: subDomain, CardType: this.state.CardType }), rowSelect: false });
    }
    onSelectCardType(cardType) {
        this.deselect();
        if (cardType === '') {
            cardType = null;
        }
        this.setState({ CardType: cardType, data: this.filterData({ Domain: this.state.domain, SubDomain: this.state.subDomain, CardType: cardType }), rowSelect: false });
    }
    rowSelect(e) {
        console.log(console.log(e));
        this.setState({ rowSelect: true, toggleMessage: null })
        this.props.updateTCEdit({ Master: true, errors: {} });
        this.getTC(e.data);
    }
    getTcs() {
        setTimeout(() => axios.get(`/user/${this.props.selectedRelease.ReleaseNumber}/pendingApproval/${this.props.user.email} `)
            .then(res => {
                if (this.props.user && this.props.user.isAdmin) {
                    axios.get(`/user/${this.props.selectedRelease.ReleaseNumber}/pendingApproval/ADMIN`)
                        .then(admin => {
                            this.props.saveUserPendingApproval([...admin.data, ...res.data]);
                            this.deselect();
                            setTimeout(this.gridApi.refreshView(), 0);
                        })
                        .catch(err => this.props.saveUserPendingApproval(res.data))
                } else {
                    this.props.saveUserPendingApproval(res.data);
                }
            }).catch(err => this.props.saveUserPendingApproval([])), 100)
    }
    toggle = () => this.setState({ modal: !this.state.modal });
    reset() {
        this.props.updateTCEdit({ ...this.props.tcDetails, errors: {} });
        this.setState({ isEditing: false });
    }
    saveAll() {
        let items = [];
        Object.keys(this.editedRows).forEach(item => {
            if (this.editedRows[item] && this.editedRows[item].Changed) {
                items.push({ TcID: this.editedRows[item].TcID.newValue, CardType: this.editedRows[item].CardType.newValue, Assignee: this.editedRows[item].Assignee.newValue })
            }
        });
        console.log('items saved');
        console.log(items);
        axios.put(`/test/${this.props.selectedRelease.ReleaseNumber}/tcinfo/details/all`, { data: items })
            .then(res => {
                this.setState({ errors: {}, toggleMessage: `TCs Updated Successfully` });
                this.deselect();
                this.toggle();

                this.getTcs();
            }, error => {
                let message = error.response.data.message;
                console.log('caught error')
                console.log(error);
                let found = false;
                ['Domain', 'SubDomain', 'TcID', 'TcName', 'CardType', 'ServerType', 'Scenario', 'OrchestrationPlatform',
                    'Description', 'ExpectedBehavior', 'Notes', 'Steps', 'Date', 'Master', 'Assignee', 'Created', 'Tag', 'Activity']
                    .forEach((item, index) => {
                        if (!found && message.search(item) !== -1) {
                            found = true;
                            let msg = { [item]: `Invalid ${item} ` };
                            if (item === 'TcID' || item === 'TcName') {
                                msg = { [item]: `Invalid or Duplicate ${item} ` };
                            }
                            this.setState({ errors: msg, toggleMessage: `Error: ${error.message} ` });
                            this.toggle();
                        }
                    });
                if (!found) {
                    this.setState({ errors: {}, toggleMessage: `Error: ${error.message} ` });
                    this.toggle();
                }
            });
        this.props.updateTCEdit({ Master: true, errors: {} });
        this.setState({ rowSelect: false, toggleMessage: null, isEditing: false })
    }

    save() {
        let data = { ...this.props.testcaseEdit };
        console.log('data for creating tc');
        console.log(data);
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
        let DateTC = new Date().toISOString();
        let release = data['Master'] ? `${this.props.selectedRelease.ReleaseNumber}, master` : this.props.selectedRelease.ReleaseNumber;

        let Status = 'UPDATED';
        if (data.original.Status === 'UNAPPROVED') {
            data.Status = 'CREATED';
        }
        if (data.Status !== data.original.Status) {
            Status = data.Status
        }
        let header = `${Status}: ${release}, REPORTER: ${this.props.user.email} `;

        let Assignee = data.Assignee ? data.Assignee : 'UNASSIGNED';

        let arrays = ['CardType', 'ServerType', 'OrchestrationPlatform'];
        let formattedArrays = {};
        arrays.forEach(item => {
            if (!data[item]) {
                formattedArrays[item] = [];
            }
            if (data[item] && !Array.isArray(data[item])) {
                formattedArrays[item] = data[item].split(',');
            }
        });
        let details = {
            old: { ...data.original, original: '', StatusChangeComments: '', Activity: '', LatestE2EBuilds: '', ManualBuilds: '', AutoBuilds: '' },
            new: { ...data, ...formattedDates, original: '', StatusChangeComments: '', ...formattedArrays, Assignee, Activity: '', LatestE2EBuilds: '', ManualBuilds: '', AutoBuilds: '' }
        }
        let Activity = {
            "Date": DateTC,
            "Header": header,
            "Details": details,
        };
        data.ManualBuilds = [];
        data.AutoBuilds = [];
        if (data.Status === 'MANUAL_COMPLETED') {
            data.StatusChangeComments = {
                ...data.StatusChangeComments,
                Result: data.StatusChangeComments.Result ? data.StatusChangeComments.Result : 'Fail',
                Assignee: this.props.user.email,
                Date: new Date().toISOString()
            }
            data.ManualBuilds = [data.StatusChangeComments];
            Activity.StatusChangeComments = 'MANUAL_COMPLETED'
        } else if (data.Status === 'AUTO_COMPLETED') {
            data.StatusChangeComments = {
                ...data.StatusChangeComments,
                Result: data.StatusChangeComments.Result ? data.StatusChangeComments.Result : 'Fail',
                Assignee: this.props.user.email,
                Date: new Date().toISOString()
            }
            data.AutoBuilds = [data.StatusChangeComments];
            Activity.StatusChangeComments = 'AUTO_COMPLETED'
        } else if (data.Status === 'REVIEWED') {
            Activity.StatusChangeComments = 'REVIEWED'
        } else {
            Activity.StatusChangeComments = data.StatusChangeComments
        }


        data = { ...data, original: '', StatusChangeComments: '', ...formattedDates, ...formattedArrays, Activity, Assignee };
        axios.put(`/test/${this.props.selectedRelease.ReleaseNumber}/tcinfo/details/id/${data.TcID}`, { ...data })
            .then(res => {
                this.setState({ addTC: { Master: true, Domain: '' }, errors: {}, toggleMessage: `TC ${this.props.testcaseEdit.TcID} Updated Successfully` });
                this.deselect();
                this.toggle();

                this.getTcs();
            }, error => {
                let message = error.response.data.message;
                let found = false;
                ['Domain', 'SubDomain', 'TcID', 'TcName', 'CardType', 'ServerType', 'Scenario', 'OrchestrationPlatform',
                    'Description', 'ExpectedBehavior', 'Notes', 'Steps', 'Date', 'Master', 'Assignee', 'Created', 'Tag', 'Activity']
                    .forEach((item, index) => {
                        if (!found && message.search(item) !== -1) {
                            found = true;
                            let msg = { [item]: `Invalid ${item} ` };
                            if (item === 'TcID' || item === 'TcName') {
                                msg = { [item]: `Invalid or Duplicate ${item} ` };
                            }
                            this.setState({ errors: msg, toggleMessage: `Error: ${error.message} ` });
                            this.toggle();
                        }
                    });
                if (!found) {
                    this.setState({ errors: {}, toggleMessage: `Error: ${error.message} ` });
                    this.toggle();
                }
            });
        this.setState({ toggleMessage: null, isEditing: false })
        // this.toggle();
    }
    confirmToggle() {
        let errors = null;
        ['Domain', 'SubDomain', 'TcID', 'CardType']
            .forEach(item => {
                if (!errors) {
                    let valid = (this.props.testcaseEdit[item] && this.props.testcaseEdit[item].length > 0);
                    if (!valid) {
                        errors = { ...this.props.testcaseEdit.errors, [item]: 'Cannot be empty' };
                    }
                }
            });
        if (!errors) {
            this.setState({ toggleMessage: null })
            this.toggle();
        } else {
            this.setState({ errors: errors })
        }
    }
    delete() {
        if (this.props.testcaseEdit.TcID) {
            axios.delete(`/test/${this.props.selectedRelease.ReleaseNumber}/tcinfo/details/id/${this.props.testcaseEdit.TcID} `)
                .then(data => {
                    this.deselect();
                    this.getTcs();
                }, error => {
                    this.setState({ errors: {}, toggleMessage: `Error: ${error.message} ` });
                    this.toggle();
                })
        }
    }
    undo() {
        this.getTcs();
        this.isAnyChanged = false;
    }
    render() {
        return (
            <div>
                <Row>
                    <Col xs="11" sm="11" md="11" lg="11" className="rp-summary-tables" style={{ 'margin-left': '1.5rem' }}>
                        <div className='rp-app-table-header' style={{ cursor: 'pointer' }}>
                            <div class="row">
                                <div class='col-lg-12'>
                                    <div style={{ display: 'flex' }}>
                                        <div onClick={() => {
                                            if (!this.state.tcOpen) {
                                                this.getTcs();
                                            }
                                            this.setState({ tcOpen: !this.state.tcOpen })
                                        }} style={{ display: 'inlineBlock' }}>
                                            {
                                                !this.state.tcOpen &&
                                                <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                                            }
                                            {
                                                this.state.tcOpen &&
                                                <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                                            }
                                            <div className='rp-icon-button'><i className="fa fa-leaf"></i></div>
                                            <span className='rp-app-table-title'>Pending For Approval</span>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <Collapse isOpen={this.state.tcOpen}>
                            <div>
                                <div style={{ width: (window.screen.width * (1 - 0.248)) + 'px', height: '250px', marginBottom: '6rem' }}>
                                    <div class="test-header">
                                        <div class="row">
                                            {
                                                this.props.data &&
                                                <div class="col-md-2">
                                                    <Input value={this.state.CardType} onChange={(e) => this.onSelectCardType(e.target.value)} type="select" name="selectCardType" id="selectCardType">
                                                        <option value=''>Select Card Type</option>
                                                        {
                                                            this.props.selectedRelease.CardType && this.props.selectedRelease.CardType.map(item => <option value={item}>{item}</option>)
                                                        }
                                                    </Input>
                                                </div>
                                            }
                                            {
                                                this.props.data &&
                                                <div class="col-md-3">
                                                    <Input value={this.state.domain} onChange={(e) => this.onSelectDomain(e.target.value)} type="select" name="selectDomain" id="selectDomain">
                                                        <option value=''>Select Domain</option>
                                                        {
                                                            this.props.selectedRelease.AvailableDomainOptions && Object.keys(this.props.selectedRelease.AvailableDomainOptions).map(item => <option value={item}>{item}</option>)
                                                        }
                                                    </Input>
                                                </div>
                                            }
                                            {
                                                this.props.data &&
                                                <div class="col-md-3">
                                                    <Input value={this.state.subDomain} onChange={(e) => this.onSelectSubDomain(e.target.value)} type="select" name="subDomains" id="subDomains">
                                                        <option value=''>Select Sub Domain</option>
                                                        {
                                                            this.state.domain && this.props.selectedRelease.AvailableDomainOptions[this.state.domain].map(item => <option value={item}>{item}</option>)
                                                        }
                                                    </Input>
                                                </div>
                                            }
                                            <div class="col-md-2">
                                                <Input type="text" id="filter-text-box" placeholder="Filter..." onChange={(e) => this.onFilterTextBoxChanged(e.target.value)} />
                                            </div>
                                            <div class="col-md-2">
                                                <span>
                                                    <Button id="PopoverPendingApproval" type="button">Choose</Button>
                                                    <UncontrolledPopover trigger="legacy" placement="bottom" target="PopoverPendingApproval" id="PendingApprovalButton">
                                                        <PopoverBody>
                                                            <FormGroup className='rp-app-table-value'>
                                                                <Label className='rp-app-table-label' htmlFor="Assignee">
                                                                    Assignee
                                                                    </Label>
                                                                <Input value={this.state.multi && this.state.multi.Assignee} onChange={(e) => {
                                                                    let selectedRows = this.gridApi.getSelectedRows();
                                                                    if (e.target.value && e.target.value !== '') {
                                                                        selectedRows.forEach(item => {
                                                                            this.onCellEditing(item, ['Assignee', 'WorkingStatus'], [e.target.value, 'MANUAL_ASSIGNED'])
                                                                            item.Assignee = e.target.value;
                                                                            item.WorkingStatus = 'MANUAL_ASSIGNED';
                                                                        })
                                                                    }
                                                                    this.setState({ multi: { ...this.state.multi, Assignee: e.target.value } })
                                                                    setTimeout(this.gridApi.refreshView(), 0);
                                                                }} type="select" name="selectMultiAssignee" id="selectMultiAssignee">
                                                                    <option value=''>Select Assignee</option>
                                                                    <option value='ADMIN'>ADMIN</option>
                                                                    {
                                                                        this.props.users && this.props.users.map(item => <option value={item.email}>{item.email}</option>)
                                                                    }
                                                                </Input>
                                                            </FormGroup>
                                                        </PopoverBody>
                                                    </UncontrolledPopover>
                                                </span>

                                                <span>
                                                    {
                                                        this.isAnyChanged &&
                                                        <Button onClick={() => this.undo()}>Undo</Button>
                                                    }
                                                </span>
                                                <span>
                                                    {
                                                        this.isAnyChanged &&
                                                        <Button onClick={() => this.saveAll()}>Save</Button>
                                                    }
                                                </span>



                                                {/* <Input type="text" id="filter-text-box" placeholder="Filter..." onChange={(e) => this.onFilterTextBoxChanged(e.target.value)} /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: "100%", height: "100%" }}>
                                        <div
                                            id="myGrid"
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                            }}
                                            className="ag-theme-balham"
                                        >
                                            <AgGridReact
                                                onRowClicked={(e) => this.rowSelect(e)}
                                                modules={this.state.modules}
                                                columnDefs={this.state.columnDefs}
                                                rowSelection='multiple'
                                                defaultColDef={this.state.defaultColDef}
                                                rowData={this.state.data ? this.state.data : this.props.data ? this.props.data : []}
                                                onGridReady={(params) => this.onGridReady(params)}
                                                onCellEditingStarted={this.onCellEditingStarted}
                                                frameworkComponents={this.state.frameworkComponents}
                                                stopEditingWhenGridLosesFocus={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Collapse isOpen={this.state.rowSelect}>
                                    {
                                        <React.Fragment>
                                            {
                                                this.state.isEditing ?
                                                    <Fragment>
                                                        <Button title="Save" size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.toggle()} >
                                                            <i className="fa fa-check-square-o"></i>
                                                        </Button>
                                                        <Button size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.reset()} >
                                                            <i className="fa fa-undo"></i>
                                                        </Button>
                                                    </Fragment>
                                                    :
                                                    <Fragment>

                                                        <Button size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.toggleDelete()} >
                                                            <i className="fa fa-trash-o"></i>
                                                        </Button>
                                                        <Button size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.setState({ isEditing: true })} >
                                                            <i className="fa fa-pencil-square-o"></i>
                                                        </Button>
                                                    </Fragment>

                                            }
                                        </React.Fragment>
                                    }
                                    {
                                        this.props.tcDetails && this.props.tcDetails.TcID &&
                                        <React.Fragment>
                                            <FormGroup row className="my-0">
                                                {
                                                    [

                                                        { field: 'Description', header: 'Description', type: 'text' },
                                                        { field: 'Steps', header: 'Steps', type: 'text' },
                                                        { field: 'ExpectedBehaviour', header: 'Expected Behaviour', type: 'text' },
                                                        { field: 'Notes', header: 'Notes', type: 'text' },

                                                    ].map((item, index) => (
                                                        <Col xs="12" md="6" lg="6" className='rp-margin-tp-btm-1'>
                                                            <FormGroup className='rp-app-table-value'>
                                                                <Label className='rp-app-table-label' htmlFor={item.field}>{item.header} {
                                                                    this.props.testcaseEdit.errors.Master &&
                                                                    <i className='fa fa-exclamation-circle rp-error-icon'>{this.props.testcaseEdit.errors.Master}</i>
                                                                }</Label>
                                                                {
                                                                    !this.state.isEditing ?
                                                                        <Input style={{ borderColor: this.props.testcaseEdit.errors[item.field] ? 'red' : '', backgroundColor: 'white' }} className='rp-app-table-value' type='textarea' rows='9' value={this.props.tcDetails && this.props.tcDetails[item.field]}></Input>
                                                                        :
                                                                        <Input style={{ borderColor: this.props.testcaseEdit.errors[item.field] ? 'red' : '' }} className='rp-app-table-value' placeholder={'Add ' + item.header} type="textarea" rows='4' id={item.field} value={this.props.testcaseEdit && this.props.testcaseEdit[item.field]}
                                                                            onChange={(e) => this.setState({ addTC: { ...this.props.testcaseEdit, [item.field]: e.target.value }, errors: { ...this.props.testcaseEdit.errors, [item.field]: null } })} >

                                                                        </Input>
                                                                }
                                                            </FormGroup>
                                                        </Col>
                                                    ))
                                                }
                                            </FormGroup>
                                            {/* <EditTC isEditing={this.state.isEditing}></EditTC> */}


                                            <Row>
                                                <Col lg="6">
                                                    <div className='rp-app-table-title'>Test Status</div>

                                                    <div class="test-header">
                                                        <div class="row">
                                                            <div class="col-md-3">
                                                                <Input type="text" id="filter-text-box" placeholder="Filter..." onChange={(e) => this.onE2EFilterTextBoxChanged(e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: (window.screen.width * ((1 - 0.418) / 2)) + 'px', height: '150px', marginBottom: '3rem' }}>
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <div
                                                                id="e2eGrid"
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                }}
                                                                className="ag-theme-balham"
                                                            >
                                                                <AgGridReact
                                                                    modules={this.state.modules}
                                                                    columnDefs={this.state.e2eColumnDefs}
                                                                    defaultColDef={this.state.defaultColDef}
                                                                    rowData={this.props.tcDetails ? this.props.tcDetails.LatestE2EBuilds : []}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>


                                                </Col>
                                                <Col lg="6">
                                                    <div className='rp-app-table-title'>Activity</div>
                                                    <div style={{ width: (window.screen.width * ((1 - 0.418) / 2)) + 'px', height: '150px', marginBottom: '3rem' }}>
                                                        <div class="test-header">
                                                            <div class="row">
                                                                <div class="col-md-3">
                                                                    <Input type="text" id="filter-text-box" placeholder="Filter..." onChange={(e) => this.onActivityFilterTextBoxChanged(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <div
                                                                id="activityGrid"
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                }}
                                                                className="ag-theme-balham"
                                                            >
                                                                <AgGridReact
                                                                    onRowClicked={(e) => this.setState({ activity: e.data })}
                                                                    modules={this.state.modules}
                                                                    columnDefs={this.state.activityColumnDefs}
                                                                    defaultColDef={this.state.defaultColDef}
                                                                    rowData={this.props.tcDetails ? this.props.tcDetails.Activity : []}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    }
                                </Collapse>
                            </div >
                        </Collapse>

                    </Col>
                </Row>

                <Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                    {
                        !this.state.toggleMessage &&
                        <ModalHeader toggle={() => this.toggle()}>{
                            'Confirmation'
                        }</ModalHeader>
                    }
                    <ModalBody>
                        {
                            this.state.toggleMessage ? this.state.toggleMessage : `Are you sure you want to make the changes ? `
                        }
                        {
                            !this.state.toggleMessage && this.props.testcaseEdit.original &&
                            < React.Fragment >
                                <Row>
                                    <Col xs="11" md="11" lg="11">
                                        <div>Original</div>
                                        <div style={{ width: '450px', height: '150px', marginBottom: '3rem' }}>
                                            <div style={{ width: "100%", height: "100%" }}>
                                                <div
                                                    id="e2eGrid"
                                                    style={{
                                                        height: "100%",
                                                        width: "100%",
                                                    }}
                                                    className="ag-theme-balham"
                                                >
                                                    <AgGridReact
                                                        modules={this.state.modules}
                                                        columnDefs={this.state.editColumnDefs}
                                                        defaultColDef={this.state.defaultColDef}
                                                        rowData={[this.props.testcaseEdit.original]}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs="11" md="11" lg="11">
                                        <div>Updated</div>
                                        <div style={{ width: '450px', height: '150px', marginBottom: '3rem' }}>
                                            <div style={{ width: "100%", height: "100%" }}>
                                                <div
                                                    id="e2eGrid"
                                                    style={{
                                                        height: "100%",
                                                        width: "100%",
                                                    }}
                                                    className="ag-theme-balham"
                                                >
                                                    <AgGridReact
                                                        modules={this.state.modules}
                                                        columnDefs={this.state.editColumnDefs}
                                                        defaultColDef={this.state.defaultColDef}
                                                        rowData={[this.props.testcaseEdit]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </React.Fragment>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.state.toggleMessage ? this.toggle() : this.save()}>Ok</Button>{' '}
                        {
                            !this.state.toggleMessage &&
                            <Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                        }
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.delete} toggle={() => this.toggleDelete()}>
                    {
                        <ModalHeader toggle={() => this.toggleDelete()}>{
                            'Delete Confirmation'
                        }</ModalHeader>
                    }
                    <ModalBody>
                        {
                            `Are you sure you want to delete ${this.props.testcaseEdit.TcID} ?`
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.delete(); this.toggleDelete(); }}>Ok</Button>{' '}
                        {
                            <Button color="secondary" onClick={() => this.toggleDelete()}>Cancel</Button>
                        }
                    </ModalFooter>
                </Modal>
            </div >

        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.auth.currentUser,
    users: state.user.users,
    selectedRelease: getCurrentRelease(state, state.release.current.id),
    data: state.user.pendingApproval,
    tcDetails: state.testcase.testcaseDetail,
    testcaseEdit: state.testcase.testcaseEdit,
})
export default connect(mapStateToProps, { saveUserPendingApproval, saveTestCase, getCurrentRelease, saveSingleTestCase, updateTCEdit })(PendingForApproval);
