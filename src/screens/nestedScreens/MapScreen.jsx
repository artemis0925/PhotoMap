import { Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const MapPostScreen = ({ route }) => {
  const {
    params: {
      locationParams,
    },
  } = route;

  const isAvailable = typeof locationParams === "object" && (("latitude" in locationParams && locationParams.latitude !== undefined ) || ("longitude" in locationParams && locationParams.longitude !== undefined ));
  let latitude, longitude;
  if(isAvailable) {
    latitude = locationParams.latitude;
    longitude = locationParams.longitude;
  }

  return (
    (isAvailable ? <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="This photo was taken here!"
        />
      </MapView>
    </View> : <Text>Unable</Text>)
  );
};

export default MapPostScreen;
