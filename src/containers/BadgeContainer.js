import React, { Component } from 'react';
import axios from 'axios';
import BadgeHeader from '../components/BadgeHeader/BadgeHeader';
import BadgeContent from '../components/BadgeContent/BadgeContent';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class BadgeContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            badgeToken: '',
            badgeData: {},
            email: '',
            modalIsOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(e) {
        e.preventDefault();
        this.setState({ modalIsOpen: true });
    }    

    closeModal() {
        this.setState({ modalIsOpen: false });
    }    

    handleEmailChange = (e) => {
        this.setState({email: e.target.value})
    }

    handleEmailSubmit = async(e) => {
        e.preventDefault()
        await axios.
            post(
                `/email`, {email: this.state.email}
            )
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        const { match: {params}} = this.props
        this.setState({
            badgeToken: params.badge_token
        })
        axios
            .get(`/badge/${params.badge_token}`)
            .then(res => {
                this.setState({
                    badgeData: res.data.result[0]
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}                    
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h1 className="h3 mb-3 font-weight-normal" ref={subtitle => this.subtitle = subtitle}>Claim this badge</h1>
                    <form onSubmit={this.handleEmailSubmit}>
                        <p>Badge Owner Text</p>
                        <input onChange={this.handleEmailChange} type="email" className="form-control mb-3" placeholder="Email Address" />
                        <button className="btn btn-lg btn-primary btn-block search-button">Claim Badge</button>
                    </form>
                </Modal>
                <BadgeHeader imageSource={this.state.badgeData.image} badgeName={this.state.badgeData.name} badgeDescription={this.state.badgeData.description} openModal={this.openModal}/>

                <div className="container-fluid">
                    <BadgeContent criteriaNarrative={this.state.badgeData.criteriaNarrative} criteriaURL={this.state.badgeData.criteriaUrl} />
                </div>
            </div>
        )
        
    }
}

export default BadgeContainer;