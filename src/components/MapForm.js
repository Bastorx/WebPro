'use strict';

import React from 'react';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import _ from 'lodash';

const DEFAULT_LOCATION = {lat: 48.867439, lng: 2.343644};

export default class MapForm extends React.Component {
    constructor(props) {
        super(props);

        const { defaultLocation } = this.props;

        this.state = {
            location        : defaultLocation || DEFAULT_LOCATION,
            map             : null,
            marker          : null,
            markerHasMoved  : false
        };
    }

    static contextTypes = {
        getGoogleMapsScript: React.PropTypes.func.isRequired
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            location        : nextProps.defaultLocation,
            markerHasMoved  : true
        });
    }

    render() {
        this.updateMap();

        return (
            <Paper {...this.props}>
                <div ref="map" style={{width: '100%', minHeight: '200px'}}/>
            </Paper>
        );
    }

    componentDidMount() {
        this.createMap(this.refs.map.getDOMNode())
            .then(function (map) {
                this.setState({map: map});
                return this.createMarker(map, this.onMarkerMoved);
            }.bind(this))
            .then(function (marker) {
                this.setState({marker: marker});
            }.bind(this));
    }

    updateMap() {

        if (this.state.map && !this.state.markerHasMoved) {
            this.state.map.panTo(this.state.location);
        }
        if (this.state.marker) {
            this.state.marker.setPosition(this.state.location);
            this.state.map.panTo(this.state.location);
        }
    }

    onMarkerMoved = (marker) => {

        this.setState({
            markerHasMoved: true,
            location      : {
                lat: this.state.marker.position.lat(),
                lng: this.state.marker.position.lng()
            }
        });
    }

    getLocation() {
        return {
            lat: this.state.marker.position.lat(),
            lng: this.state.marker.position.lng()
        }
    }

    createMap(el) {
        var options = {};
        options.zoom = 16;
        return this.context.getGoogleMapsScript()
            .then(function (google) {
                return new google.maps.Map(el, options);
            });
    }

    createMarker(map, onMoved) {
        var options = {};
        options.map = map;
        options.position = map.getCenter();
        options.draggable = true;

        return this.context.getGoogleMapsScript()
            .then(function (google) {
                var marker = new google.maps.Marker(options);
                google.maps.event.addListener(marker, 'dragend', onMoved);
                return marker;
            });
    }
}