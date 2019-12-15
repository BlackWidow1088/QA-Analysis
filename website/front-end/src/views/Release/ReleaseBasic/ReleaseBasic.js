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
import BasicReleaseInfo from '../components/BasicReleaseInfo';
import ChatBox from './../../../components/ChatBox/ChatBox';
import './ReleaseBasic.scss';

class ReleaseBasic extends Component {
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
            updatedValues: {},
            toggle: true
        });
    }
    save() {
        let data = { ...this.props.basicReleaseInfo, ...this.state.updatedValues }
        let dates = [
            'TargetedReleaseDate', 'ActualReleaseDate', 'TargetedCodeFreezeDate',
            'UpgradeTestingStartDate', 'QAStartDate'
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
        axios.post(`/api/release/${this.props.basicReleaseInfo.ReleaseNumber}`, { ...data })
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
    render() {
        return (
            <div>
                <Card>
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
                                <BasicReleaseInfo id={this.props.id} isEditing={this.state.isEditing}
                                    handleUpdate={(value) => this.setState({ updatedValues: { ...this.state.updatedValues, ...value } })} />
                            </Col>
                        </Row>
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
                    </CardBody>
                </Card>
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
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    basicReleaseInfo: state.release.all.filter(item => {
        if (item.ReleaseNumber === ownProps.id) {
            return true;
        } else {
            return false;
        }
    })[0] //.filter(item => item.name === ownProps.match.params.id)
})

export default connect(mapStateToProps, { saveReleaseBasicInfo })(ReleaseBasic);
