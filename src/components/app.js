import React, { Component } from 'react';
import { locations } from '../utils/locations.js'
import { getMarkerInfo } from '../utils/wikipediaSearch.js'
import { styles } from '../styles/mapStyle.js'
import Header from './header.js'
import Footer from './footer.js'
import SideMenu from './sideMenu.js'
import '../styles/App.css'

export default class App extends Component {
    /**
    * States of the component
    **/
    state = {
        points: locations,
        map: '',
        infowindow: '',
        currentMarker: '',
        slidemenu:false
    }

    /**
    * Invoked immediately after the component is mounted
    **/
    componentDidMount() {
        window.initMap = this.initMap;
        window.gm_authFailure = this.gm_authFailure;
        loadMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyCgxp1rwD6U87QIofJzbINWAs4UeO1c24I&callback=initMap');
    }

    /**
    * Everything related to the map loading
    **/

    initMap = () => {
        const { points } = this.state;
        let _this = this;

        let mapview = document.getElementById('map');

        const styledMapType = new window.google.maps.StyledMapType(
            styles,
            {name: 'Styled Map'}
        );

        const map = new window.google.maps.Map(mapview, {
            center: { lat: 39.2694876, lng: -8.7295444 },
            zoom: 11,
            streetViewControl: false,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'styled_map']
            }
        });


        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

        let InfoWindow = new window.google.maps.InfoWindow({});

        this.setState({ map: map, infowindow: InfoWindow });

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            _this.closeInfoWindow();
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            let center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            _this.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            _this.closeInfoWindow();
        });

        /**
        * Updates the states for every location in pointsCollection
        **/
        let pointsCollection = [];
        points.forEach(function (location) {
            let marker = new window.google.maps.Marker({
                name: location.name,
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                icon: {
                    path: 'M368 448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h352c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm-78.86-347.26a31.97 31.97 0 0 0-9.21-19.44L203.31 4.69c-6.25-6.25-16.38-6.25-22.63 0l-76.6 76.61a31.97 31.97 0 0 0-9.21 19.44L64 416h256l-30.86-315.26zM240 307.2c0 6.4-6.4 12.8-12.8 12.8h-70.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h70.4c6.4 0 12.8 6.4 12.8 12.8v38.4z',
                    fillColor: '#000',
                    fillOpacity: 10,
                    strokeWeight: 0,
                    scale: 0.045
                },
                map: map
            });

            marker.addListener('click', function () {
                _this.openInfoWindow(marker);
            });

            location.marker = marker;
            pointsCollection.push(location);
        });
        this.setState({ points: pointsCollection });
    }

    gm_authFailure = () => {
        let errorName = "map-error";
        let errorContent = "It is not possible to load the map at the moment.";
        let element = document.getElementById('map');
        element.classList.add(errorName);
        element.innerHTML = errorContent;
    }

    /**
    * Opens the infoWindow related to the marker
    **/
    openInfoWindow = (marker) => {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({ currentMarker: marker });
        this.state.infowindow.setContent('Retrieving data...');
        this.state.map.setCenter(marker.getPosition());
        getMarkerInfo(marker, this.state.infowindow);
    }

    /**
    * Close the infoWindow related to the marker
    **/
    closeInfoWindow = () => {
        if (this.state.currentMarker) {
            this.state.currentMarker.setAnimation(null);
        }
        this.setState({ currentMarker: '' });
        this.state.infowindow.close();
    }

    /**
    * Related to the state of the slide menu
    **/
    slideMenu = () => {
        this.setState({ slidemenu: !this.state.slidemenu });
    }

    render() {
        return (
            <div className="App">

                <Header
                    slidemenu={this.state.slidemenu} //gets the state of slidemenu
                    slideMenu={this.slideMenu} //gets the function of slideMenu
                />

                <div className="container">
                    <SideMenu
                        slidemenu={this.state.slidemenu} //gets the state of slidemenu, used for the tabindexes
                        points={this.state.points}
                        openInfoWindow={this.openInfoWindow}
                        closeInfoWindow={this.closeInfoWindow}
                    />
                    <div id="map"
                        aria-label="map of places"
                        role="application">
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}

function loadMap(src) {
    const catchScript = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("An error occurred while loading the map.");
    };
    catchScript.parentNode.insertBefore(script, catchScript);
}
