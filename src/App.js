import React, { useEffect, useState } from 'react';

import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData } from './api';

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null);

    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [bounds, setBounds] = useState(null);

    const [loading, setLoading] = useState(false);

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    
    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating);
        setFilteredPlaces(filteredPlaces);
    }, [rating])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, []);

    useEffect(() => {
        setLoading(true);
        if (bounds) {
            getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
                setPlaces(data);
                setFilteredPlaces([]);
            });
        }
        setLoading(false);
    }, [coordinates, bounds, type]);

    return (
        <>
            <CssBaseline />
            <Header />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places} 
                        childClicked={childClicked} 
                        loading={loading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating} />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setCoordinates={setCoordinates} 
                        setBounds={setBounds}
                        coordinates={coordinates}
                        setChildClicked={setChildClicked} />   
                </Grid>
            </Grid>
        </>
    )
}

export default App;
