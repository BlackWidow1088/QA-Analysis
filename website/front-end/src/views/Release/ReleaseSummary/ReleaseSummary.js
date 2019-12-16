import React, { Component, Fragment } from 'react';
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
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { connect } from 'react-redux';
import { saveReleaseBasicInfo } from '../../../actions';
import { getCurrentRelease } from '../../../reducers/release.reducer';
import { getTestSummary } from '../../../reducers/testcase.reducer';
import BasicReleaseInfo from '../components/BasicReleaseInfo';
import ChatBox from '../../../components/ChatBox/ChatBox';
import AppTable from '../../../components/AppTable/AppTable';
import './ReleaseSummary.scss';
import { TABLE_OPTIONS } from '../../../constants';

class ReleaseSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            modal: false,
            toggleModal: false,
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
            toggle: true,

        });
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
        axios.post(`/api/release/${this.props.selectedRelease.ReleaseNumber}`, { ...data })
            .then(res => {
                alert('success');
                this.props.saveReleaseBasicInfo({ id: data.ReleaseNumber, data: data });
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
        [0, 1, 2].forEach((index) => {
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
                default:
                    break;
            }
        });
        this.save(currentData);
    }
    updateQA = (values) => {
        let currentData = this.props.selectedRelease;
        [1, 2, 3, 4].forEach((index) => {
            switch (index) {
                case 1:
                    if (values.edit[index]) {
                        currentData.HardwareSupport = values.edit[index].new.value.split(',');
                    }
                    break;
                case 2:
                    if (values.edit[index]) {
                        currentData.SetupsUsed = values.edit[index].new.value.split(',');
                    }
                    break;
                case 3:
                    if (values.edit[index]) {
                        currentData.UpgradeTestingStartDate = values.edit[index].new.value;
                    }
                    break;
                case 4:
                    if (values.edit[index]) {
                        currentData.UpgradeMetrics = values.edit[index].new.value.split(',');
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
        console.log('saving features')
        console.log(currentData.Features);
        this.save(currentData);
    }
    render() {
        return (
            <div>
                <Row>
                    <Col xs="12" sm="12" md="4" lg="3" className="rp-summary-tables">
                        <AppTable
                            onUpdate={(values) => this.updateDate(values)}
                            title="Dates"
                            editOptions={this.props.currentUser && this.props.currentUser.isAdmin ? [TABLE_OPTIONS.EDIT, TABLE_OPTIONS.DELETE] : []}
                            currentUser={this.props.currentUser}
                            fieldAndHeader={[
                                { field: 'name', header: 'Name', type: 'text', restrictUpdate: true },
                                { field: 'target', header: 'Target', type: 'date' },
                                { field: 'actual', header: 'Actual', type: 'date' }
                            ]}
                            data={
                                [
                                    { name: 'Release', target: this.props.selectedRelease.TargetedReleaseDate, actual: this.props.selectedRelease.ActualReleaseDate },
                                    { name: 'Code Freeze', target: this.props.selectedRelease.TargetedCodeFreezeDate, actual: this.props.selectedRelease.ActualCodeFreezeDate },
                                    { name: 'QA Start', target: this.props.selectedRelease.TargetedQAStartDate, actual: this.props.selectedRelease.QAStartDate },
                                ]}
                        />
                    </Col>
                    <Col xs="12" sm="12" md="4" lg="3" className="rp-summary-tables">
                        <AppTable
                            onUpdate={(values) => this.updateFinal(values)}
                            title="System Information"
                            editOptions={this.props.currentUser && this.props.currentUser.isAdmin ? [TABLE_OPTIONS.EDIT] : []}
                            currentUser={this.props.currentUser}
                            fieldAndHeader={[
                                { field: 'key', header: 'Key', type: 'text', restrictUpdate: true },
                                { field: 'value', header: 'Value', type: 'text' },
                            ]}
                            headless={true}
                            data={
                                [
                                    { key: 'Operating System', value: this.props.selectedRelease.FinalOS },
                                    { key: 'Docker Core RPM Number', value: this.props.selectedRelease.FinalDockerCore },
                                    { key: 'UBoot Number', value: this.props.selectedRelease.UbootVersion },
                                ]}
                        />
                    </Col>
                    <Col xs="12" sm="12" md="4" lg="5" className="rp-summary-tables">
                        <AppTable
                            onUpdate={(values) => this.updateFeatures(values)}
                            title="Features"

                            editOptions={this.props.currentUser && this.props.currentUser.isAdmin ? [TABLE_OPTIONS.EDIT, TABLE_OPTIONS.ADD, TABLE_OPTIONS.DELETE] : []}
                            currentUser={this.props.currentUser}
                            fieldAndHeader={[
                                { field: 'Name', header: 'Name', type: 'text', },
                                { field: 'JiraID', header: 'JIRA ID', type: 'text' },
                                { field: 'Description', header: 'Description', type: 'text' },
                            ]}
                            data={
                                this.props.selectedRelease && this.props.selectedRelease.Features
                            }
                            restrictHeight={true}
                        />

                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" md="12" lg="3" className="rp-summary-tables">
                        <AppTable
                            onUpdate={(values) => this.updateQA(values)}
                            title="QA"
                            editOptions={this.props.currentUser && this.props.currentUser.isAdmin ? [TABLE_OPTIONS.EDIT] : []}
                            currentUser={this.props.currentUser}
                            fieldAndHeader={[
                                { field: 'key', header: 'Key', type: 'text', restrictUpdate: true },
                                { field: 'value', header: 'Value', type: 'text' },
                            ]}
                            headless={true}
                            restrictRowIndexForUpdate={[0]}
                            exceptionTypeForRowIndex={{ 3: 'date' }}
                            data={
                                [
                                    { key: 'Total Builds', value: this.props.selectedRelease.BuildNumberList ? this.props.selectedRelease.BuildNumberList.length : 0 },
                                    { key: 'Hardware Support', value: this.props.selectedRelease.HardwareSupport ? this.props.selectedRelease.HardwareSupport.join(',') : '' },
                                    { key: 'Setups Used', value: this.props.selectedRelease.SetupsUsed ? this.props.selectedRelease.SetupsUsed.join(',') : '' },
                                    { key: 'Upgrade Testing Start Date', value: this.props.selectedRelease.UpgradeTestingStartDate },
                                    { key: 'Upgrade Metrics', value: this.props.selectedRelease.UpgradeMetrics ? this.props.selectedRelease.UpgradeMetrics.join(',') : '' },
                                ]}
                        />
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="3" className="rp-summary-tables">
                        <AppTable
                            onUpdate={(values) => this.updateTC(values)}
                            title="Test Cases"
                            currentUser={this.props.currentUser}
                            fieldAndHeader={[
                                { field: 'key', header: 'Key', type: 'text', restrictUpdate: true },
                                { field: 'value', header: 'Value', type: 'text', exceptionTypeForIndex: { 3: 'date' } },
                            ]}
                            headless={true}
                            restrictRowIndexForUpdate={[0]}
                            data={
                                [
                                    { key: 'Total Test Cases', value: this.props.testSummary.totalTests },
                                    { key: 'Total Bugs', value: this.props.testSummary.totalBugs },
                                    { key: 'Total Passed', value: this.props.testSummary.totalPassed },
                                ]}
                        />
                    </Col>
                </Row>
                {/* <Card>
                    <CardHeader>
                        <strong>Basic Info</strong>
                        {
                            this.props.currentUser && this.props.currentUser.isAdmin ?
                                this.state.isEditing ?
                                    <Fragment>
                                        <Button size="sm" color="primary" className="float-right" onClick={() => this.reset()} >Reset</Button>
                                        {' '}
                                        <Button size="sm" color="primary" className="float-right rp-rb-save-btn" onClick={() => this.toggle()} >Save</Button>
                                    </Fragment>
                                    :
                                    <Button size="sm" color="primary" className="float-right" onClick={() => this.edit()} >Edit</Button>
                                : null
                        }
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <BasicReleaseInfo id={this.props.selectedRelease && this.props.selectedRelease.ReleaseNumber} isEditing={this.state.isEditing}
                                    handleUpdate={(value) => this.setState({ updatedValues: { ...this.state.updatedValues, ...value } })} />
                            </Col>
                        </Row> */}
                {/* <Row>
                            <Col xs="12" sm="12">
                                <Row>
                                    <Col xs="12">
                                        <div>Minutes of Syncup Meetings</div>
                                        <ChatBox data={this.props.basicReleaseInfo && this.props.basicReleaseInfo.mom} />
                                        {
                                            this.props.currentUser && this.props.currentUser.isAdmin &&
                                            <Fragment>
                                                <FormGroup>
                                                    <Label htmlFor="mom">Add Minutes of Meeting</Label>
                                                    <Input type="textarea" className="rp-rb-add-mom" name="mom" id="mom" rows="12"
                                                        placeholder="Content..."
                                                        value={this.state.updatedValues && this.state.updatedValues.mom}
                                                        onChange={(e) => this.setState({ updatedValues: { ...this.state.updatedValues, mom: e.target.value } })} />
                                                </FormGroup>
                                                <div className="form-actions">
                                                    <Button disabled={true} onClick={() => this.momToggle()} color="primary">Add</Button>
                                                </div>
                                            </Fragment>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row> */}
                {/* </CardBody>
                </Card> */}
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
                {/* <Modal isOpen={this.state.momModal} toggle={() => this.momToggle()}>
                    <ModalHeader toggle={() => this.momToggle()}>Confirmation</ModalHeader>
                    <ModalBody>
                        Are you sure you want to add Minutes of Meeting?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.save()}>Ok</Button>{' '}
                        <Button color="secondary" onClick={() => this.momToggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal> */}
            </div >
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    selectedRelease: getCurrentRelease(state),//.filter(item => item.name === ownProps.match.params.id)
    testSummary: getTestSummary(state)
})

export default connect(mapStateToProps, { saveReleaseBasicInfo })(ReleaseSummary);
