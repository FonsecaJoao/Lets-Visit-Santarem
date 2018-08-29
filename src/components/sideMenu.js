import React, { Component } from 'react'
import '../styles/sideMenu.css'
import ListLocations from './listLocations.js'

class SideMenu extends Component {
    render() {
        return (
            <div className="sideMenu">
                <ListLocations
                    slidemenu={this.props.slidemenu}
                    points={this.props.points}
                    openInfoWindow={this.props.openInfoWindow}
                    closeInfoWindow={this.props.closeInfoWindow}
                />
            </div>
        );
    }
}

export default SideMenu
