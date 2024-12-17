
import React, {useRef, useEffect, useState} from 'react';
import { Input } from "@nextui-org/input";
import {useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  setLang: (n?: number) => void;
  setLat: (n?: number) => void;
  setPinPlace: (p?: string) => void;
}

// This is an example of the classic "Place Autocomplete" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
export const PlaceAutoComplete = ({onPlaceSelect, setLang, setLat, setPinPlace}: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string | undefined>();
  const handleChange = (event) =>{
    setInputValue(event.target.value)
  }
  const places = useMapsLibrary('places');

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    if (!places || !inputRef.current) return;
    console.log("intial autocomplete")
    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
      componentRestrictions: {country: 'my'}
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    if (!placeAutocomplete) return;
    // console.log("kedua")
    placeAutocomplete.addListener('place_changed', () => {
        console.log('place changed')
        onPlaceSelect(placeAutocomplete.getPlace());
        const place = placeAutocomplete.getPlace()
        setLang(place?.geometry?.location?.lng())
        setLat(place?.geometry?.location?.lat())
        // console.log(place?.formatted_address)
        setPinPlace(place?.formatted_address)
        setInputValue('')
    });
  }, [onPlaceSelect, placeAutocomplete]);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return (
    <div className="autocomplete">
        <Input label="Location" type="text" ref={inputRef} value={inputValue} onChange={handleChange} placeholder=''/>
    </div>
  );
};
