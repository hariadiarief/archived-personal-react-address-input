import React, { Component, Fragment } from 'react';

import LocationPicker from 'react-location-picker';
import Geocode from "react-geocode";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      position: {
        lat: null,
        lng: null
      }
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

  geoCode() {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API);
    Geocode.setLanguage("en");
    Geocode.setRegion("id");

    const { position } = this.state
    Geocode.fromLatLng(position.lat, position.lng).then(
      response => {
        const address = response.results[0].formatted_address;
        console.log(address);
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {
    const { position, address } = this.state

    console.log("tipe:", typeof position.lng);


    return (
      <div>
        {!position ? null :

          <Fragment>
            <h1>{address}</h1>
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