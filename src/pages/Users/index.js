import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken("pk.eyJ1IjoiZmFiaW9zYW50YW5hZ2lmIiwiYSI6ImNrcG44bHE3bTAwbXkybnFjdTVlejV0NGsifQ.7Td1_OWsFDZZjj5wcK1l1g");

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: 800,
    width: 400,
    backgroundColor: "tomato"
  },
  map: {
    flex: 1
  },
  
});
const initialRegion = {
  latitude: 49.2576508,
  longitude: -123.2639868,
  latitudeDelta: 100,
  longitudeDelta: 100,
};

export default class App extends Component {
  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }
  render() {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView
          centerCoordinate={[-49.6446024, -27.2108001]}
          initialRegion={initialRegion}

          style={styles.map} />
        </View>
      </View>
    );
  }
}