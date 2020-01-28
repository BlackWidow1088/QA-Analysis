// CUSTOMER USING THIS RELEASE (OPTIONAL) (M)
// Issues faced on customer side (jira - list)
// customers to be given to
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getCurrentRelease } from '../../reducers/release.reducer';
import { saveSingleTestCase, saveTestCase, updateTCEdit } from '../../actions';
import {
    Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button,
    UncontrolledPopover, PopoverHeader, PopoverBody,
    Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Collapse
} from 'reactstrap';
import './TestCases.scss';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";
import MoodEditor from "./moodEditor";
import MoodRenderer from "./moodRenderer";
import NumericEditor from "./numericEditor";
import SelectionEditor from './selectionEditor';
import { getDatePicker } from './datepicker';
import DatePickerEditor from './datePickerEditor';
import EditTC from '../../views/Release/ReleaseTestMetrics/EditTC';
// import { data, domains, subDomains } from './constants';
// "Description": "Enable helm", "ExpectedBehaviour": "dctl feature list should display helm as enabled", "Notes": "NOTES NOT PROVIDED"
class TestCases extends Component {
    cntr = 0;

    editedRows = {};
    isAnyChanged = false;
    constructor(props) {
        super(props);
        this.state = {
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
                    headerName: "Status", field: "CurrentStatus", sortable: true, filter: true, cellStyle: this.renderEditedCell,
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
                    headerName: "Assignee", field: "Assignee", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },
                {
                    headerName: "Tag", field: "Tag", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                },

            ],
            columnDefs: [
                {
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    headerName: "Tc ID", field: "TcID", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                    editable: false,
                    width:180
                },
                {
                    headerName: "Description", field: "Description", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                    width: '420',
                    editable: false,
                    cellClass: 'cell-wrap-text',
                    autoHeight: true
                },
                {
                    headerName: "Card Type", field: "CurrentStatus.CardType", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100',

                    cellEditor: 'selectionEditor',
                    cellClass: 'cell-wrap-text',
                    cellEditorParams: {
                        values: ['BOS', 'NYNJ', 'COMMON'],
                        multiple: true
                    }
                },
                {
                    headerName: "Build", field: "CurrentStatus.Build", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100',

                    cellEditor: 'selectionEditor',
                    cellClass: 'cell-wrap-text',
                    cellEditorParams: {
                        values: ['BOS', 'NYNJ', 'COMMON'],
                        multiple: true
                    }
                },
                {
                    headerName: "Status", field: "CurrentStatus.Result", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100',

                    cellEditor: 'selectionEditor',
                    cellClass: 'cell-wrap-text',
                    cellEditorParams: {
                        values: ['COMPLETED', 'NOT_COMPLETED']
                    }
                },
                {
                    headerName: "Priority", field: "Priority", sortable: true, filter: true, cellStyle: this.renderSmallCell, width: '100',     cellClass: 'cell-wrap-text',
                },
                {
                    headerName: "Assignee", field: "CurrentStatus.Assignee", sortable: true, filter: true, cellStyle: this.renderEditedCell, width: '100',
                    cellClass: 'cell-wrap-text',

                    cellEditor: 'selectionEditor',
                    cellEditorParams: {
                        values: this.props.users.map(item => item.email)
                    }
                },
                {
                    headerName: "Server Type", field: "ServerType", sortable: true, filter: true, cellStyle: this.renderEditedCell,

                    cellEditor: 'selectionEditor',
                    cellClass: 'cell-wrap-text',
                    cellEditorParams: {
                        values: ['UNKNOWN']
                    }
                },
                {
                    headerName: "Tc Name", field: "TcName", sortable: true, filter: true, cellStyle: this.renderEditedCell,      cellClass: 'cell-wrap-text',
                },
            ],
            defaultColDef: { resizable: true },

            e2eColumnDefs: [{
                headerName: "Build", field: "Build", sortable: true, filter: true,
            },
            {
                headerName: "Result", field: "Result", sortable: true, filter: true,
            },
            {
                headerName: "Date", field: "Date", sortable: true, filter: true,
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
                headerName: "Comments", field: "StatusChangeComments", sortable: true, filter: true,
            },
            ],
            modules: AllCommunityModules,
            frameworkComponents: {
                moodRenderer: MoodRenderer,
                moodEditor: MoodEditor,
                numericEditor: NumericEditor,
                selectionEditor: SelectionEditor,
                datePicker: DatePickerEditor
            },
        }
    }
    getRowHeight = (params) =>  {
        if(params.data && params.data.Description) {
            return 28 * (Math.floor(params.data.Description.length / 60) + 1);
        }
        // assuming 50 characters per line, working how how many lines we need
        return 28;
    }
    getTC(e) {
        axios.get(`/api/tcinfo/${this.props.selectedRelease.ReleaseNumber}/id/${e.TcID}/card/${e.CardType}`)
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
    renderSmallCell = (params) => {
        return {
            backgroundColor: '', maxWidth: '50px'
        }
    }
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
    numberParser(params) {
        var newValue = params.newValue;
        var valueAsNumber;
        if (newValue === null || newValue === undefined || newValue === "") {
            valueAsNumber = null;
        } else {
            valueAsNumber = parseFloat(params.newValue);
        }
        return valueAsNumber;
    }
    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
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
        this.setState({ rowSelect: true, toggleMessage: null })
        this.getTC(e.data);
    }
    getTcs() {
        axios.get(`/api/wholetcinfo/${this.props.selectedRelease.ReleaseNumber}`)
            .then(all => {
                if (all.data && all.data.length) {
                    this.setState({ domain: null, subDomain: null, CardType: null, data: null, rowSelect: false })
                    this.props.saveTestCase({ data: all.data, id: this.props.selectedRelease.ReleaseNumber });
                    this.deselect();
                    setTimeout(this.gridApi.refreshView(), 0)

                }
            })
        // .then(all => {

        // })
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
                let assignee = this.editedRows[item].Assignee.newValue && this.editedRows[item].Assignee.newValue !== 'ADMIN' 
                ? this.editedRows[item].Assignee.newValue : 'ADMIN';
                let ws = assignee === 'ADMIN' ? 'UNASSIGNED' : 'MANUAL_ASSIGNED'
                items.push({
                    TcID: this.editedRows[item].TcID.newValue, CardType: this.editedRows[item].CardType.newValue, Assignee: assignee,
                    WorkingStatus: ws, 
                    Activity: {   "Date": new Date().toISOString(),
                    "Header": `${ws}: ${this.props.selectedRelease.ReleaseNumber}, master, REPORTER: ${this.props.user.email} `,
                    "Details": {},
                    "StatusChangeComments": 'MANUAL_ASSIGNED'}
                })
            }
        });
        axios.put(`/api/${this.props.selectedRelease.ReleaseNumber}/tcinfo/all`, { data: items })
            .then(res => {
                this.setState({ errors: {}, toggleMessage: `TCs Updated Successfully` });
                this.toggle();
                this.undo();
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

    textFields = [
        'TcID', 'TcName','Scenario','Tag', 'Assignee','Tag','Priority',
        'Description', 'Steps', 'ExpectationBehavior', 'Notes',
    ];
    arrayFields = ['CardType','ServerType', 'OrchestrationPlatform']
    whichFieldsUpdated(old, latest) {
        let changes = {};
        this.textFields.forEach(item => {
            if(old[item] !== latest[item]) {
                changes[item] = {old: old[item], new: latest[item]}
            }
        });
        this.arrayFields.forEach(item => {
            if(!old[item] && latest[item]) {
                changes[item] = {old: '', new: latest[item]}
            } else if(!latest[item] && old[item]) {
                changes[item] = {old: old[item], new: ''}
            } else if(old[item] && latest[item]){
                let arrayChange = latest[item].filter(each => old[item].includes(each));
                if(arrayChange.length > 0) {
                    changes[item] = {old: old[item], new: latest[item]}
                }
            }
        });
        return changes;
    }
    joinArrays(array) {
        if (!array) {
            array = [];
        }
        if (array && !Array.isArray(array)) {
            array = array.split(',');
        }
        return array;
    }
    statusUpdate() {
        let data = {};
    }
    detailsUpdate() {
        let data = {};
    }
    save() {
        let data = {};
        // tc info meta fields
        // tc info fields
        this.textFields.map(item => data[item] = this.props.testcaseEdit[item]);
        this.arrayFields.forEach(item => data[item] = this.joinArrays(this.props.testcaseEdit[item]));
        data.Activity={
            "UserName": this.props.user.email,
            "LogData": `UPDATED: ${this.props.selectedRelease.ReleaseNumber}, master, REPORTER: ${this.props.user.email}`,
            "RequestType": 'PUT',
            "URL": `/api/tcinfoput/${this.props.selectedRelease.ReleaseNumber}/id/${data.TcID}/card/${this.props.testcaseEdit.CardType}`      
        };
        if(this.props.testcaseEdit.CurrentStatus === 'Pass' || this.props.testcaseEdit.CurrentStatus === 'Fail') {
            let status = {};
            status.Build =  this.props.testcaseEdit.Build;
            status.Result =  this.props.testcaseEdit.CurrentStatus;
            status.CardType=this.props.tcDetails.CardType;
            status.TcID = this.props.tcDetails.TcID;
            status.Activity = {
                "UserName": this.props.user.email,
                "LogData": `UPDATED: ${this.props.selectedRelease.ReleaseNumber}, master, REPORTER: ${this.props.user.email}`,
                "RequestType": 'POST',
                "URL": `/api/tcstatus/${this.props.selectedRelease.ReleaseNumber}`      
            }
                    axios.post(`/api/tcstatus/${this.props.selectedRelease.ReleaseNumber}`, { ...status })
            .then(res => {
                console.log('updated status')
            }, error => {
                console.log('failed updating status')
            });
        }
        axios.put(`/api/tcinfoput/${this.props.selectedRelease.ReleaseNumber}/id/${data.TcID}/card/${this.props.tcDetails.CardType}`, { ...data })
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
                        if (!found && message && message.search(item) !== -1) {
                            found = true;
                            let msg = { [item]: `Invalid ${item}` };
                            if (item === 'TcID' || item === 'TcName') {
                                msg = { [item]: `Invalid or Duplicate ${item}` };
                            }
                            this.setState({ errors: msg, toggleMessage: `Error: ${error.message}` });
                            this.toggle();
                        }
                    });
                if (!found) {
                    this.setState({ errors: {}, toggleMessage: `Error: ${error.message}` });
                    this.toggle();
                }
            });
        this.setState({ toggleMessage: null, isEditing: false })
        // this.toggle();
    }
    confirmToggle() {
        let errors = null;
        this.changeLog = {};
        ['Domain', 'SubDomain', 'TcID', 'CardType']
            .forEach(item => {
                if (!errors) {
                    let valid = (this.props.testcaseEdit[item] && this.props.testcaseEdit[item].length > 0);
                    if (!valid) {
                        errors = { ...this.props.testcaseEdit.errors, [item]: 'Cannot be empty' };
                    }
                }
            });
            if (!isNaN(this.props.testcaseEdit['TcID'])) {
                errors = { ...this.props.testcaseEdit.errors, TcID: 'Cannot be a number' };
            }
            if (!errors) {
                this.changeLog = this.whichFieldsUpdated(this.props.tcDetails, this.props.testcaseEdit);
                this.setState({ toggleMessage: null })
                this.toggle();
            } else {
                this.setState({ errors: errors })
            }
    }
    delete() {
        if (this.props.testcaseEdit.TcID) {
            axios.delete(`/api/${this.props.selectedRelease.ReleaseNumber}/tcinfo/id/${this.props.testcaseEdit.TcID}`)
                .then(data => {
                    this.deselect();
                    this.getTcs();
                }, error => {
                    this.setState({ errors: {}, toggleMessage: `Error: ${error.message}` });
                    this.toggle();
                })
        }
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
                                        <div onClick={() => this.setState({ tcOpen: !this.state.tcOpen })} style={{ display: 'inlineBlock' }}>
                                            {
                                                !this.state.tcOpen &&
                                                <i className="fa fa-angle-down rp-rs-down-arrow"></i>
                                            }
                                            {
                                                this.state.tcOpen &&
                                                <i className="fa fa-angle-up rp-rs-down-arrow"></i>
                                            }
                                            <div className='rp-icon-button'><i className="fa fa-leaf"></i></div>
                                            <span className='rp-app-table-title'>Test Cases</span>
                                           
                                        </div>
                                        {/* {
                                            this.state.rowSelect &&
                                            <React.Fragment>
                                                {
                                                    this.props.user && this.state.isEditing ?
                                                        <Fragment>
                                                            <Button style={{ position: 'absolute', right: '1rem' }} title="Save" size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.toggle()} >
                                                                <i className="fa fa-check-square-o"></i>
                                                            </Button>
                                                            <Button style={{ position: 'absolute', right: '3rem' }} size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.reset()} >
                                                                <i className="fa fa-undo"></i>
                                                            </Button>
                                                        </Fragment>
                                                        :
                                                        <Button style={{ position: 'absolute', right: '1rem' }} size="md" color="transparent" className="float-right rp-rb-save-btn" onClick={() => this.setState({ isEditing: true })} >
                                                            <i className="fa fa-pencil-square-o"></i>
                                                        </Button>
                                                }
                                            </React.Fragment>
                                        } */}

                                    </div>
                                </div>

                            </div>
                        </div>
                        <Collapse isOpen={this.state.tcOpen}>
                            <div>
                                {/* <div style={{ width: (window.screen.width * (1 - 0.248) - 20) + 'px', height: '250px', marginBottom: '6rem' }}> */}
                                <div style={{ width: '100%', height: '250px', marginBottom: '6rem' }}>
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
                                                <div class="col-md-2">
                                                    <Input value={this.state.domain} onChange={(e) => this.onSelectDomain(e.target.value)} type="select" name="selectDomain" id="selectDomain">
                                                        <option value=''>Select Domain</option>
                                                        {
                                                            this.props.selectedRelease.TcAggregate && this.props.selectedRelease.TcAggregate.AvailableDomainOptions && Object.keys(this.props.selectedRelease.TcAggregate.AvailableDomainOptions).map(item => <option value={item}>{item}</option>)
                                                        }
                                                    </Input>
                                                </div>
                                            }
                                            {
                                                this.props.data &&
                                                <div class="col-md-2">
                                                    <Input value={this.state.subDomain} onChange={(e) => this.onSelectSubDomain(e.target.value)} type="select" name="subDomains" id="subDomains">
                                                        <option value=''>Select Sub Domain</option>
                                                        {
                                                            this.state.domain && this.props.selectedRelease.TcAggregate && this.props.selectedRelease.TcAggregate.AvailableDomainOptions[this.state.domain].map(item => <option value={item}>{item}</option>)
                                                        }
                                                    </Input>
                                                </div>
                                            }
                                            <div class="col-md-3">
                                                <Input type="text" id="filter-text-box" placeholder="Filter..." onChange={(e) => this.onFilterTextBoxChanged(e.target.value)} />
                                            </div>
                                            {/* <div class="col-md-2">
                                                <span>
                                                    <Button id="PopoverAssign" type="button">Apply Multiple</Button>
                                                    <UncontrolledPopover trigger="legacy" placement="bottom" target="PopoverAssign" id="PopoverAssignButton">
                                                        <PopoverBody>
                                                            {
                                                                [
                                                                    { header: 'Priority', labels: 'Priority' }
                                                                ].map(each => <FormGroup className='rp-app-table-value'>
                                                                    <Label className='rp-app-table-label' htmlFor={each.labels}>
                                                                        {each.header}
                                                                    </Label>
                                                                    <Input value={this.state.multi && this.state.multi[each.labels]} onChange={(e) => {
                                                                        let selectedRows = this.gridApi.getSelectedRows();
                                                                        if (e.target.value && e.target.value !== '') {
                                                                            selectedRows.forEach(item => {
                                                                                item.Priority = e.target.value;

                                                                                let ws = e.target.value && e.target.value !== 'ADMIN'? 'MANUAL_ASSIGNED' : 'UNASSIGNED';
                                                                                this.onCellEditing(item, ['Assignee', 'WorkingStatus'], [
                                                                                    e.target.value,
                                                                                    ws
                                                                                ])
                                                                                item.Assignee = e.target.value;
                                                                                item.WorkingStatus = ws;
                                                                            })
                                                                        }
                                                                        this.setState({ multi: { ...this.state.multi, [each.labels]: e.target.value } })
                                                                        setTimeout(this.gridApi.refreshView(), 0);
                                                                    }} type="select" id={`select_${each.labels}`}>
                                                                        {
                                                                            ['P0','P1','P2','P3','P4','P5','P6','P7','P8','P9'].map(item => <option value={item}>{item}</option>)
                                                                        }
                                                                        <option value='ADMIN'>ADMIN</option>
                                                                        {
                                                                            this.props.users && this.props.users.map(item => <option value={item.email}>{item.email}</option>)
                                                                        }
                                                                    </Input>
                                                                </FormGroup>)
                                                            }


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



                                              
                                            </div> */}


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
                                                getRowHeight={this.getRowHeight}
                                                defaultColDef={this.state.defaultColDef}
                                                rowData={this.state.data ? this.state.data : this.props.data ? this.props.data : []}
                                                onGridReady={(params) => this.onGridReady(params)}
                                                onCellEditingStarted={this.onCellEditingStarted}
                                                frameworkComponents={this.state.frameworkComponents}
                                                stopEditingWhenGridLosesFocus={true}
                                            />
                                        </div>
                                        {/* {
                                            !this.state.open &&
                                            this.state.rowSelect &&
                                            this.props.tcDetails && this.props.tcDetails.TcID &&
                                            <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                                                <i className="fa fa-angle-down rp-save-tc-icon" onClick={() => this.setState({ open: !this.state.open })}> More</i>
                                            </div>
                                        }
                                        {
                                            this.state.open &&
                                            this.state.rowSelect &&
                                            this.props.tcDetails && this.props.tcDetails.TcID &&
                                            <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                                                <i className="fa fa-angle-up rp-save-tc-icon" onClick={() => this.setState({ open: !this.state.open })}> Less</i>
                                            </div>
                                        } */}
                                    </div>
                                </div>
                                <Collapse isOpen={this.state.rowSelect}>
                                    {
                                        this.props.user && this.props.user.email &&
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
                                                                    <div class="row">
                            <div class='col-md-12'>
                            <div class="row">
                                                <div class="col-sm-3">
                                                    <div className={`c-callout c-callout-total`}>
                                                        <small class="text-muted">TC ID</small><br></br>
                                                        <strong class="h4">{this.props.tcDetails.TcID}</strong>
                                                    </div>
                                                </div>
                                                {
                                                    this.props.tcDetails && this.props.tcDetails.StatusList[0] && this.props.tcDetails.StatusList[0].Result ?
                                                    <div class="col-sm-3">
                                                    <div className={`c-callout c-callout-${this.props.tcDetails.StatusList[0].Result.toLowerCase()}`}>
                                                        <small class="text-muted">Current Status</small><br></br>
                                                        <strong class="h4">{this.props.tcDetails.StatusList[0].Result}</strong>
                                                    </div>
                                                    </div> :
                                                    <div class="col-sm-3">
                                                    <div className={`c-callout c-callout-nottested`}>
                                                        <small class="text-muted">Current Status</small><br></br>
                                                        <strong class="h4">NOT TESTED</strong>
                                                    </div>
                                                    </div> 
                                                }
    { this.props.tcDetails && this.props.tcDetails.StatusList[0] && this.props.tcDetails.StatusList[0].Build ?
        <div class="col-sm-3">
                                                <div className={`c-callout c-callout-total`}>
                                                        <small class="text-muted">Current Build</small><br></br>
                                                        <strong class="h4">{this.props.tcDetails.StatusList[0].Build}</strong>
                                                    </div>
                                                </div> :
                                                                                                    <div class="col-sm-3">
                                                                                                    <div className={`c-callout c-callout-nottested`}>
                                                                                                        <small class="text-muted">Current Build</small><br></br>
                                                                                                        <strong class="h4">NOT AVAILABLE</strong>
                                                                                                    </div>
                                                                                                    </div> 
    }
        { this.props.tcDetails && this.props.tcDetails.StatusList[0] && this.props.tcDetails.StatusList[0].CardType ?
        <div class="col-sm-3">
                                                <div className={`c-callout c-callout-total`}>
                                                        <small class="text-muted">Card Type</small><br></br>
                                                        <strong class="h4">{this.props.tcDetails.StatusList[0].CardType}</strong>
                                                    </div>
                                                </div> :
                                                                                                    <div class="col-sm-3">
                                                                                                    <div className={`c-callout c-callout-nottested`}>
                                                                                                        <small class="text-muted">CardType</small><br></br>
                                                                                                        <strong class="h4">NOT AVAILABLE</strong>
                                                                                                    </div>
                                                                                                    </div> 
    }
                                                

                                            </div>
                                {/* <span className='rp-app-table-value'>TC ID: {this.props.tcDetails.TcID}</span>
                                <span style={{marginLeft: '2rem'}} className='rp-app-table-value'>Current Status: {this.props.tcDetails.StatusList[0].Result}</span>
                                <span style={{marginLeft: '2rem'}} className='rp-app-table-value'>Current Build: {this.props.tcDetails.StatusList[0].Build}</span>
                                <span style={{marginLeft: '2rem'}} className='rp-app-table-value'>Card Type: {this.props.tcDetails.StatusList[0].CardType}</span> */}
                                {/* <div style={{ display: 'inline', marginLeft: '2rem' }}>
                                    <div style={{ display: 'inline' }}>
                                        <span>Created on </span><span style={{
                                            fontSize: '16px',
                                            color: '#04381a',
                                            marginRight: '1rem'
                                        }}>{this.props.tcDetails.Date}</span>
                                        <span>Created by</span><span style={{
                                            fontSize: '16px',
                                            color: '#04381a',
                                            marginRight: '1rem'
                                        }}> {this.props.tcDetails.Created}</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                                            <FormGroup row className="my-0">
                                                {
                                                    [

                                                        { field: 'Description', header: 'Description', type: 'text' },
                                                        { field: 'Steps', header: 'Steps', type: 'text' },
                                                        { field: 'ExpectedBehaviour', header: 'Expected Behaviour', type: 'text' },
                                                        { field: 'Notes', header: 'Notes', type: 'text' },

                                                    ].map((item, index) => (
                                                        <Col xs="12" md="6" lg="6">
                                                            <FormGroup className='rp-app-table-value'>
                                                                <Label className='rp-app-table-label' htmlFor={item.field}>{item.header} {
                                                                    this.props.testcaseEdit.errors.Master &&
                                                                    <i className='fa fa-exclamation-circle rp-error-icon'>{this.props.testcaseEdit.errors.Master}</i>
                                                                }</Label>
                                                                {
                                                                    !this.state.isEditing ?
                                                                        <Input style={{ borderColor: this.props.testcaseEdit.errors[item.field] ? 'red' : '', backgroundColor: 'white' }} className='rp-app-table-value' type='textarea' rows='3' value={this.props.tcDetails && this.props.tcDetails[item.field]}></Input>
                                                                        :
                                                                        <Input style={{ borderColor: this.props.testcaseEdit.errors[item.field] ? 'red' : '' }} className='rp-app-table-value' placeholder={'Add ' + item.header} type="textarea" rows='4' id={item.field} value={this.props.testcaseEdit && this.props.testcaseEdit[item.field]}
                                                                        onChange={(e) => this.props.updateTCEdit({
                                                                            ...this.props.testcaseEdit, [item.field]: e.target.value,
                                                                            errors: { ...this.props.testcaseEdit.errors, [item.field]: null }
                                                                            })} >

                                                                        </Input>
                                                                }
                                                            </FormGroup>
                                                        </Col>
                                                    ))
                                                }
                                            </FormGroup>
                                            <EditTC isEditing={this.state.isEditing}></EditTC>


                                            <Row>
                                                <Col lg="6">
                                                    <div className='rp-app-table-title'>Test Status</div>
                                                    <div style={{ width: '80%', height: '150px', marginBottom: '3rem' }}>
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
                                                                    rowData={this.props.tcDetails ? this.props.tcDetails.StatusList : []}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>


                                                </Col>
                                                <Col lg="6">
                                                            <div className='rp-app-table-title'>Test Case History</div>
                                                            {/* <div style={{ width: (window.screen.width * ((1 - 0.418) / 2)) + 'px', height: '150px', marginBottom: '3rem' }}> */}
                                                            <div style={{ width: '80%', height: '150px', marginBottom: '3rem' }}>
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
                                                                            rowData={[]}
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
                            this.state.toggleMessage ? this.state.toggleMessage : `Are you sure you want to make the changes?`
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
    users: state.user.users.map(item => item.email),
    selectedRelease: getCurrentRelease(state, state.release.current.id),
    data:state.testcase.all[state.release.current.id],
    tcDetails: state.testcase.testcaseDetail,
    testcaseEdit: state.testcase.testcaseEdit
})
export default connect(mapStateToProps, { saveTestCase, getCurrentRelease, saveSingleTestCase, updateTCEdit })(TestCases);





                // {
                //     headerName: "Assignee", field: "Assignee", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                //     editable: true,
                //     cellEditor: 'selectionEditor',
                //     cellEditorParams: {
                //         values: ['achavan@diamanti.com']
                //     }
                // },
                // {
                //     headerName: "Orchestration Platform", field: "OrchestrationPlatform", sortable: true, filter: true, cellStyle: this.renderEditedCell,
                //     editable: true,
                //     cellEditor: 'selectionEditor',
                //     cellEditorParams: {
                //         values: ['dcx-k8s']
                //     }
                // },
                // {
                //     headerName: 'Mood', field: "mood", cellRenderer: "moodRenderer",
                //     cellEditorParams: {
                //         values: ['Toyota', 'Ford', 'Porsche']
                //     },
                //     cellEditor: "moodEditor",
                //     editable: true,
                // },
                // {
                //     headerName: 'Date', field: "date",
                //     cellEditor: "datePicker",
                //     filter: 'agDateColumnFilter',
                //     sortable: true,
                //     editable: true,
                // },
                // {
                //     headerName: "Model", field: "model", sortable: true, filter: true, editable: true, cellStyle: this.renderEditedCell,
                //     cellEditor: 'agLargeTextCellEditor',
                //     cellEditorParams: {
                //         maxLength: '300',   // override the editor defaults
                //         cols: '50',
                //         rows: '6'
                //     }
                // },
                // {
                //     headerName: "Price", field: "price", sortable: true, filter: 'agNumberColumnFilter', valueParser: this.numberParser,
                //     cellStyle: this.renderEditedCell, editable: true,
                //     cellEditor: 'numericEditor'
                // }