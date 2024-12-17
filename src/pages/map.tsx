import { useEffect, useState, useRef, memo } from "react";
import { title } from "@/components/primitives";
import { Input } from "@nextui-org/input";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

export default function MapPage() {
    const [vlat, setLat] = useState(3.1474156118453926);
    const [vlang, setLang] = useState(101.6945375006577);
    const [zoom, setZoom] = useState(16);
    const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
    let [firstFetch, setFirstFetch] = useState(true);
    const [pinPlace, setPinPlace] = useState<string | undefined>(
        "No Selected Location"
    );

  const PlaceAutoComplete = ({
    onPlaceSelect,
    setLang,
    setLat,
    setPinPlace,
  }: {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
    setLang: (lng: number) => void;
    setLat: (lat: number) => void;
    setPinPlace: (address: string | undefined) => void;
  }) => {
    const [placeAutocomplete, setPlaceAutocomplete] =
      useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
    const places = useMapsLibrary("places");

    useEffect(() => {
      if (!places || !inputRef.current) return;
      const options = {
        fields: ["geometry", "name", "formatted_address"],
        componentRestrictions: {country: 'my'}
      };

      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
      if (!placeAutocomplete) return;
      placeAutocomplete.addListener("place_changed", () => {
        onPlaceSelect(placeAutocomplete.getPlace());
        const place = placeAutocomplete.getPlace();
        setLang(place?.geometry?.location?.lng() || 0);
        setLat(place?.geometry?.location?.lat() || 0);
        setPinPlace(place?.formatted_address);
        setInputValue("");
      });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
      <div className="autocomplete">
        <Input
          label="Location"
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          placeholder=""
        />
      </div>
    );
  };

  const MapHandler = ({
    place,
  }: {
    place: google.maps.places.PlaceResult | null;
  }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !place) return;

      if (place.geometry?.viewport) {
        map.fitBounds(place.geometry?.viewport);
      }
    }, [map, place]);

    return null;
  };

  const Marker = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap()
    const [markerRef, marker] = useAdvancedMarkerRef();

    const handleDrag = (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }).then((response) => {
        console.log(response.results[0])
        console.log('current zoom', map?.getZoom())
        // const currentZoom = map?.getZoom()
        // map?.setZoom(currentZoom)
        console.log('updated zoom', map?.getZoom())
        setPinPlace(response.results[0].formatted_address);
        setLang(latlng.lng);
        setLat(latlng.lat);
      });
    };

    return (
      <>
        <AdvancedMarker
          position={{ lat: lat, lng: lng }}
          ref={markerRef}
          draggable={true}
          onDragEnd={handleDrag}
        />
      </>
    );
  };

  const MyComponent = () => {
    const map = useMap()
    useEffect(() => {
        console.log('zoom after render', map?.getZoom())
        console.log('zoom after render', map?.getZoom())
        // console.log('render detected')
      if (navigator.geolocation && firstFetch) {
        navigator.geolocation.getCurrentPosition(   
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setLat(pos.lat);
            setLang(pos.lng);
            setFirstFetch(false);
            console.log(pos);
          },
          () => {
            console.warn("Geolocation service failed.");
          }
        );
      }
    }, []);

    return <></>;
  };

  const Gmap = () => (
    <>
      <Map
        mapId={"padu2025"}
        defaultZoom={16}
        defaultCenter={{ lat: vlat, lng: vlang }}
        style={{ height: "100vh", width: "100%" }}
        mapTypeId={'terrain'}
        mapTypeControl={false}
        streetViewControl={false}
      >
        <Marker lat={vlat} lng={vlang} />,
      </Map>

      <MapHandler place={selectedPlace} />
      <MyComponent />
    </>
  );

  const SelectedPlace = memo(() => {
    return (
        <div className="selPlace">
          {pinPlace}
        </div>
      );
  });

  return (
    <APIProvider
      apiKey={"AIzaSyBoHEL2r2x5C54R1ONXYWyE57uktK44j2w"}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Map Demo</h1>
        </div>

        <div className="my-5 w-full flex flex-col space-y-4 md:space-x-4 md:space-y-0">
          <div className="w-full text-center my-8">
            <b>Address: </b> <SelectedPlace/>
          </div>
          <div className="w-full ">
            <PlaceAutoComplete
              onPlaceSelect={setSelectedPlace}
              setLang={setLang}
              setLat={setLat}
              setPinPlace={setPinPlace}
            />
          </div>
          <div className="h-[80vh] pt-4 w-full">
            <Gmap />
          </div>
        </div>
      </section>
    </APIProvider>
  );
}
