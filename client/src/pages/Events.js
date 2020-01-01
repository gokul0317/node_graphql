import React, { Component } from "react";
import "./Event.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";

class EventsPage extends Component {
  state = {
    creating: false,
    events: []
  };
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    let requesBody = {
      query: `query{
            events{
                _id
                title
                decription
                date
                price
                creator{
                  _id
                  email
                }
            }
        } `
    };
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requesBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201)
          throw new Error("Request Failed");
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        const events = resData.data.events;
        this.setState({
          events: events
        });
      })
      .catch(err => console.log(err));
  };

  startCreateEventHandler = () => {
    this.setState({
      creating: true
    });
  };
  modalConfirmHandler = () => {
    this.setState({
      creating: false
    });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;
    if (
      !title.trim().length ||
      !price ||
      !date.trim().length ||
      !description.trim().length
    ) {
      return;
    }
    const event = { title, price, date, description };

    let requesBody = {
      query: `mutation{
            createEvent(eventInput: { title: "${title}", price: ${price}, date: "${date}", decription: "${description}" }){
                _id
                title
                decription
                date
                price
                creator{
                  _id
                  email
                }
            }
        } `
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requesBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201)
          throw new Error("Request Failed");
        return res.json();
      })
      .then(resData => {
         this.fetchEvents();
      })
      .catch(err => console.log(err));
  };
  modalCancelHandler = () => {
    this.setState({
      creating: false
    });
  };

  render() {
    let { creating } = this.state;
    const eventsList = this.state.events.map(event => (
      <li className="events__list-item" key={event._id}>
        {event.title}
      </li>
    ));
    return (
      <React.Fragment>
        {creating && <Backdrop />}
        {creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>

              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>

              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>

              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share Your Own Events</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">{eventsList}</ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
