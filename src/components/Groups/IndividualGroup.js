import React from "react";
import {
  getOneGroup,
  addUserToGroup,
} from "../../../functions/FirebaseU/FirebaseUtils";
import { Link } from "react-router-dom";
import { WebhookFire } from "../Webhooks/WebhookEngine";
import Modal from "react-bootstrap/Modal";
import { UserTable } from "../UserTable";
import { Loader } from "../Loader";

class IndividualGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      desc: "",
      users: null,
      pathways: [],
      open: false,
      email: "",
    };
    this.handleModal = this.handleModal.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  handleModal() {
    this.setState({ open: !this.state.open });
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.setState({ id: params.id });
    getOneGroup(params.id).on("value", (snapshot) => {
      try {
        if (snapshot.val()) {
          const { name, description, users, pathways } = snapshot.val();
          this.setState({
            name: name,
            desc: description,
            users: users,
            pathways: pathways,
          });
        }
      } catch (error) {
        console.log("NO GROUP", error);
      }
    });
  }

  onChangeText = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  addUser() {
    addUserToGroup(this.state.id, this.state.email);
    WebhookFire("2mE3WXrJT1KEdqousLHhFw","group_invitation",{email: this.state.email, name: this.state.name});
  }

  render() {
    return (
      <div>
        <div className="badge-summary jumbotron row d-flex justify-content-around">
          <div>
            <h1>{this.state.name}</h1>
            <p>{this.state.desc}</p>
          </div>
          <div>
            <Link
              to={{
                pathname: `/groups/edit/${this.state.id}`,
                aboutProps: {
                  name: this.state.name,
                  desc: this.state.description,
                  id: this.state.id,
                },
              }}
              className="btn btn-primary"
            >
              Edit
            </Link>
          </div>
        </div>
        <div className="body-app">
          <button
            className="btn btn-secondary"
            onClick={() => this.handleModal()}
          >
            Add user to Group
          </button>
          <div>
            <div>
              {this.state.users ? (
                <UserTable users={Object.entries(this.state.users)} />
              ) : (
                <Loader />
              )}
            </div>
          </div>
          <Modal show={this.state.open} onHide={this.handleModal}>
            <Modal.Header>
              <h4 class="modal-title">Add new user to group</h4>
            </Modal.Header>
            <Modal.Body>
              <input
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.onChangeText}
                type="email"
                required
              ></input>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-secondary"
                onClick={() => this.handleModal()}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => this.addUser()}
              >
                Add User
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
export default IndividualGroup;