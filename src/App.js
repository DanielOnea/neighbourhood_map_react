import React from 'react'
import scriptLoader from 'react-async-script-loader'
import List from './List'
import './App.css'


class App extends React.Component {

    state = {
        locations: [],
        success: true,
        marker: [],
        map: '',
        infoWindows: '',
        venueWindows: [],
        center: {lat: 44.433925, lng: 26.098342}
    };

  updatequery =(query) => {
    this.setState({query: query})
  }

  
  updateData = (newData) => {
    this.setState({
      data:newData,
    });
  }

    // Check if maps api loads
    componentWillReceiveProps({isScriptLoadSucceed}) {
        if (isScriptLoadSucceed) {

            let mapContainer = document.getElementById('map'),
                map = new window.google.maps.Map(mapContainer, {
                    zoom: 15,
                    center: {lat: 44.433925, lng: 26.098342}
                });

            // Initialize info windows
            let infowindow = new window.google.maps.InfoWindow({});

            this.setState({map: map, infoWindows: infowindow});

            // Fetch food restaurants around my area via Foursquare
            fetch('https://api.foursquare.com/v2/venues/search?ll=44.433925,26.098342&query=food&radius=1000&categoryId=4d4b7105d754a06374d81259&client_id=ZBDNRUXL2PBLUFEJ5MWCZCFTCY0RKOBJGBWZGCK0DNCXC5F5&client_secret=GQCOWQNQOPZ3BT4USWW3WX4NJHOD40NLOHI0SCV31FUKHWPX&v=20201215&limit=50')
                .then(
                    res => {
                        if (res.status !== 200) {
                            alert("Places API failed");
                            throw res;
                        }
                        return res.json()
                    })
                .then(res => {
                    let venues = res.response.venues;
                    this.setState({locations: venues})
                })
                .then(res => this.setMarker(map))
                .catch(error => console.log(error));
        }
        else {
            console.log("google maps API couldn't load.");
            this.setState({success: false})
        }
    }

    // Function to add markers to the map
    setMarker = (map) => {
        let self = this;
        let locs = this.state.locations;

        locs.forEach(loc => {
            let marker = new window.google.maps.Marker({
                position: {lat: loc.location.lat, lng: loc.location.lng},
                map: map,
                title: loc.name
            });

            // Event listener to open info window
            marker.addListener('click', function () {
                self.showInfoWindow(marker, loc);
            });
            let markers = this.state.marker;
            markers.push(marker);
            this.setState({marker: markers})
        });
    };

    // Show info window when marker is clicked
    showInfoWindow = (marker, loc) => {
        document.getElementById('searchContainer').style.zIndex = 1;
        document.getElementById('map').style.zIndex = 2;
        document.getElementById('searchButton').style.zIndex = 3;
        // Close any opened info windows
        this.state.infoWindows.close();
        let markers = this.state.infoWindows.marker,
            venueWins = [];
        if (markers !== marker) {
            markers = marker;

            // Set bounce animation to markers
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1000);
            this.state.infoWindows.open(this.state.map, marker);
            this.showDetails(loc);
            venueWins.push(this.state.infoWindows)
            this.setState({venueWindows: venueWins})
        }

    };

    // Function to populate info window
    showDetails = (loc) => {

        // Get additional data about location from fetched data
        let currentAddress, currentCity, currentCountry;
        loc.location.address ? currentAddress = loc.location.address : currentAddress = '';
        loc.location.city ? currentCity = loc.location.city : currentCity = '';
        loc.location.country ? currentCountry = loc.location.country : currentCountry = '';

        // Create new info window for marker click event
        let contentString = '<div id="venueInfo">' +
            '<h3>' + loc.name + '</h3>' +
            '<div tabindex="0" role="contentinfo" aria-label="venue details" id="bodyContent">' +
            '<P tabindex="0">' + currentAddress + '</P>' +
            '<P tabindex="0">' + currentCity + '</P>' +
            '<P tabindex="0">' + currentCountry + '</P>' +
            '</div>' +
            '</div>';
        this.state.infoWindows.setContent(contentString);
    };

    componentDidMount() {
        // Global function for Google map error handling
        window.gm_authFailure = this.gm_authFailure;
    }

    // Global function for Google map error handling
    gm_authFailure() {
        window.alert("Google Maps failed to Load")
    }

// for mobile
    showSearch = (e) => {
        // document.getElementById('searchContainer').style.display = 'block';
        document.getElementById('searchContainer').style.zIndex = 1000;
        document.getElementById('map').style.zIndex = -1;
        document.getElementById('searchButton').style.zIndex = -1;
    };


    render() {
        return (
            <div className='container'>

                {this.state.success ? (
                    <div id="map" role="application" aria-label="map" tabIndex={0} ref={(map) => {
                        this.mapArea = map;
                    }}>
                    </div>
                ) : (
                    <div>
                        Problem Loading Map
                    </div>

                )}
                <List
                    marker={this.state.marker}
                    infoWindows={this.state.infoWindows}
                    showInfo={this.showInfoWindow}
                    map={this.state.map}
                    locations={this.state.locations}
                />
                <button tabIndex={0} id='searchButton' className='searchButton' onClick={e => this.showSearch(e)}>
                    <i className="fa fa-bars fa-2x"></i>
                </button>
            </div>
        )
    }

}

export default scriptLoader(['https://maps.googleapis.com/maps/api/js?key=AIzaSyDc1klZr0qyB8xonLcQPLIfZTEirq3TPWQ'])(App);
