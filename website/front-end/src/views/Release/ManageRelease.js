import React, { Component } from 'react';
import axios from 'axios';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Fade,
    Form,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    InputGroupText,
    Label,
    Row,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { connect } from 'react-redux';
import { saveReleaseBasicInfo, updateNavBar, removeFromNavBar, deleteRelease } from '../../actions';
import BasicReleaseInfo from './components/BasicReleaseInfo';
import './ManageRelease.scss';
import { api } from '../../utils/API.utils';

class ManageRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            release: this.props.allReleases[0] ? this.props.allReleases[0].ReleaseNumber : '',
            updatedValues: {}
        }
    }
    reset() {
        this.setState({
            updatedValues: {}
        })
    }
    delete() {
        axios.delete(`/api/release/${this.state.release}`)
            .then(res => {
                alert(`successfully deleted ${this.state.release}`);
                this.props.removeFromNavBar({ id: this.state.release });
                this.props.deleteRelease({ id: this.state.release });
            }, error => {
                alert('error deleting release');
            });
        this.delToggle();
    }
    save() {
        let data = { ...this.state.updatedValues }
        console.log('saved data ', data);
        axios.post(`/api/release`, { ...data })
            .then(res => {
                alert('success');
                this.props.updateNavBar({ id: data.ReleaseNumber });
                this.props.saveReleaseBasicInfo({ id: data.ReleaseNumber, data: data });
                this.reset();
            }, error => {
                alert('error adding new release');
            });
        if (this.state.modal) {
            this.toggle();
        }
        if (this.state.momModal) {
            this.momToggle();
        }
    }
    toggle = () => this.setState({ modal: !this.state.modal });
    delToggle = () => this.setState({ delModal: !this.state.delModal });
    render() {
        return (
            (
                <div>
                    <Row>
                        <Col xs="4">
                            <FormGroup>
                                <Label htmlFor="selectRelease">Release</Label>
                                <Input onChange={(e) => this.setState({ release: e.target.value })} type="select" name="selectRelease" id="selectRelease">
                                    {
                                        this.props.allReleases.map(release => <option value={release.ReleaseNumber}>{release.ReleaseNumber}</option>)
                                    }
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col xs="4">
                            <Button onClick={() => this.delToggle()} size="sm" color="danger" className="rp-mr-del-button"><i className="fa fa-ban"></i> Delete</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12" lg="12">
                            <Card>
                                <CardHeader>
                                    <strong>Add New Release</strong>
                                </CardHeader>
                                <CardBody>
                                    <FormGroup>
                                        <Label htmlFor="release">Release</Label>
                                        <Input type="text" id="release" placeholder="Enter Release Name" value={this.state.updatedValues.ReleaseNumber} onChange={(e) => this.setState({ updatedValues: { ...this.state.updatedValues, ReleaseNumber: e.target.value } })} />
                                    </FormGroup>
                                    <BasicReleaseInfo id={this.props.id} isEditing={true} handleUpdate={(value) => this.setState({ updatedValues: { ...this.state.updatedValues, ...value } })} />
                                </CardBody>
                                <CardFooter>
                                    <div className="form-actions">
                                        <Button color="primary" onClick={() => this.toggle()}>Save changes</Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
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
                    <Modal isOpen={this.state.delModal} toggle={() => this.delToggle()}>
                        <ModalHeader toggle={() => this.delToggle()}>Confirmation</ModalHeader>
                        <ModalBody>
                            {`Are you sure you want to delete release ${this.state.release}?`}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.delete()}>Delete</Button>{' '}
                            <Button color="secondary" onClick={() => this.delToggle()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )
        )
    }
}
const mapStateToProps = (state, ownProps) => ({
    currentUser: state.auth.currentUser,
    allReleases: state.release.all
})

export default connect(mapStateToProps, { saveReleaseBasicInfo, updateNavBar, removeFromNavBar, deleteRelease })(ManageRelease);