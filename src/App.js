import React, { Component, Fragment } from 'react';

import LocationPicker from 'react-location-picker';
import Geocode from "react-geocode";

import "./App.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      position: {
        lat: null,
        lng: null
      },
      addressesSuggestion: null
    }
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  componentDidMount() {
    this.locationInitiation()
  }

  //set default location -> current location
  locationInitiation() {
    window.navigator.geolocation.getCurrentPosition(
      position => this.setState({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }, this.geoCode()),
      err => this.setState({ errorMessage: err.message })
    );
  }

  //when map picker changing
  handleLocationChange({ position, address, places }) {
    this.setState({ position, address });
    this.geoCode()
  }

  geoCode(addressInput) {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API);
    Geocode.setLanguage("id");
    Geocode.setRegion("id");

    Geocode.fromAddress("doogether").then(
      response => {
        // const { lat, lng } = response.results[0].geometry.location;

        console.log("addressesSuggestion :", response.results);

        this.setState({ addressesSuggestion: response.results })
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {
    const { position, address, addressesSuggestion } = this.state

    return (
      <div>
        {!position ? null :

          <Fragment>
            <input type="text" value={address} />
            <div>
              select from this list :
              <ul>
                {
                  !addressesSuggestion ? null :
                    addressesSuggestion.map(address =>
                      <li className="addressSelect" onClick={() => this.setState({ position: { lat: address.geometry.location.lat, lng: address.geometry.location.lng } })} >
                        {address.formatted_address}
                      </li>

                    )
                }
              </ul>
            </div>

            <h4>latitude : {position.lat}</h4>
            <h4>longitude :{position.lng}</h4>

            <div>
              <LocationPicker
                containerElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ height: '400px' }} />}
                defaultPosition={position}
                onChange={this.handleLocationChange}
              />
            </div>
          </Fragment>
        }
      </div>
    )
  }
}

export default App;
