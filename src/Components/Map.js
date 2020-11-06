import React from 'react'
import '../Components-css/Map.css'
import {Map as LeafletMap, TileLayer} from "react-leaflet";
import { showDataMap } from '../util';
function Map({countries,casesType,center,zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution = '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {showDataMap(countries,casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
