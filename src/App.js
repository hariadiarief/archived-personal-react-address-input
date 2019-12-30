import React, { Component, Fragment } from 'react';

import LocationPicker from 'react-location-picker';
import Geocode from "react-geocode";

import "./App.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null, //alamat yg sedang digunakna
      position: {
        lat: null, //koordinat latitude yg sedang digunakna
        lng: null //koordinat longitude yg sedang digunakna
      },
      addressesSuggestion: null // daftar saran alamat yg didapatkan dari geocode
    }
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  componentDidMount() {
    this.locationInitiation()
  }

  //set default location -> current location -> sehingga pada saat awal membuka apps korrdinat awal ialah koordinat pengguna saat ini note : browser harus memperbolehkan get location
  locationInitiation() {
    window.navigator.geolocation.getCurrentPosition(
      position => this.setState({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }),
      err => this.setState({ errorMessage: err.message })
    );
  }

  //when map picker changing
  handleLocationChange({ position, address, places }) {
    this.setState({ position, address });
  }

  //handling ketika input address berubah dan memberikan keluaran berupa daftar alamat yg disimpan di state -> addressesSuggestion
  geoCode(addressInput) {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API);
    Geocode.setLanguage("id");
    Geocode.setRegion("id");

    Geocode.fromAddress(addressInput).then(
      response => {
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
            <input type="text" value={address} onChange={(event) => this.setState({ address: event.target.value }, this.geoCode(event.target.value))} />
            <div>
              select from this list :
              <ul>
                {/* implementasi dari react geocode */}
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

            {/* implementasi dari LocationPicker  */}
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
