import React, {Component} from 'react';

import {StatusBar, Modal, AsyncStorage} from 'react-native';

import MapboxGL from '@react-native-mapbox-gl/maps';
import {RNCamera} from 'react-native-camera';
import Geolocation from '@react-native-community/geolocation'; 

import api from '../../services/api';

import {
  Container,
  AnnotationContainer,
  AnnotationText,
  NewButtonContainer,
  ButtonsWrapper,
  CancelButtonContainer,
  SelectButtonContainer,
  ButtonText,
  Marker,
  ModalContainer,
  ModalImagesListContainer,
  ModalImagesList,
  ModalImageItem,
  ModalButtons,
  CameraButtonContainer,
  CancelButtonText,
  ContinueButtonText,
  TakePictureButtonContainer,
  TakePictureButtonLabel,
  DataButtonsWrapper,
  MarkerContainer,
  MarkerLabel,
  Form,
  Input,
  DetailsModalFirstDivision,
  DetailsModalSecondDivision,
  DetailsModalThirdDivision,
  DetailsModalBackButton,
  DetailsModaltypeOcurrency,
  DetailsModalRealtyTitle,
  DetailsModalRealtySubTitle,
  DetailsModalRealtyAddress,
} from './styles';

export default class Main extends Component {


  static navigationOptions = {
    header: null,
  };

  state = {
    locations: [],
    newRealty: false,
    cameraModalOpened: false,
    dataModalOpened: false,
    detailsModalOpened: false,
    realtyDetailed: null,
    realtyData: {
      location: {
        latitude: null,
        longitude: null,
      },
      name: 'Vamos lá',
      typeOcurrency: '10000',
      address: 'Rua zero, 10',
      images: [],
    },
  };

  async componentDidMount() {
     this.getLocation();
  }
  
  getLocation = async () => {
    try {   
      const response = await api.get('/properties', {
        params: {
          latitude: "-27.210768",
          longitude: "-49.644018",
        },
      });
      this.setState({locations: response.data});
    } catch (err) {
      alert('erro', err);
      console.tron.log(err);
    }
  };

  handleNewRealtyPress = () =>
    this.setState({newRealty: !this.state.newRealty});

  handleCameraModalClose = () =>
    this.setState({cameraModalOpened: !this.state.cameraModalOpened});

  handleDataModalClose = () =>
    this.setState({
      dataModalOpened: !this.state.dataModalOpened,
      cameraModalOpened: false,
    });

  handleDetailsModalClose = index =>
    this.setState({
      detailsModalOpened: !this.state.detailsModalOpened,
      realtyDetailed: index,
    });

  handleGetPositionPress = async () => {
    try {
      const [longitude, latitude] = await this.map.getCenter();
      this.setState({
        cameraModalOpened: true,
        realtyData: {
          ...this.state.realtyData,
          location: {
            latitude,
            longitude,
          },
        },
      });
    } catch (err) {
      console.tron.log(err);
    }
  };

  handleTakePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        forceUpOrientation: true,
        fixOrientation: true,
      };
      const data = await this.camera.takePictureAsync(options);
      const {realtyData} = this.state;
      this.setState({
        realtyData: {
          ...realtyData,
          images: [...realtyData.images, data],
        },
      });
    }
  };

  handleInputChange = (index, value) => {
    const {realtyData} = this.state;
    switch (index) {
      case 'name':
        this.setState({
          realtyData: {
            ...realtyData,
            name: value,
          },
        });
        break;
      case 'address':
        this.setState({
          realtyData: {
            ...realtyData,
            address: value,
          },
        });
        break;
      case 'typeOcurrency':
        this.setState({
          realtyData: {
            ...realtyData,
            typeOcurrency: value,
          },
        });
        break;
    }
  };

  saveRealty = async () => {
    try {
      const {
        realtyData: {
          name,
          address,
          typeOcurrency,
          location: {latitude, longitude},
          images,
        },
      } = this.state;
      const newRealtyResponse = await api.post('/properties', {
        title: name,
        address,
        typeOcurrency,
        latitude: Number(latitude.toFixed(6)),
        longitude: Number(longitude.toFixed(6)),
      });

      const imagesData = new FormData();

      images.forEach((image, index) => {
        imagesData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `${newRealtyResponse.data.title}_${index}.jpg`,
        });
      });

      await api.post(
        `/properties/${newRealtyResponse.data.id}/images`,
        imagesData,
      );

      this.getLocation();
      this.handleDataModalClose();
      this.setState({newRealty: false});
    } catch (err) {
      console.tron.log(err);
    }
  };

  renderConditionalsButtons = () =>
    !this.state.newRealty ? (
      <NewButtonContainer onPress={this.handleNewRealtyPress}>
        <ButtonText>Nova Ocorrência</ButtonText>
      </NewButtonContainer>
    ) : (
      <ButtonsWrapper>
        <SelectButtonContainer onPress={this.handleGetPositionPress}>
          <ButtonText>Selecionar localização</ButtonText>
        </SelectButtonContainer>
        <CancelButtonContainer onPress={this.handleNewRealtyPress}>
          <ButtonText>Cancelar</ButtonText>
        </CancelButtonContainer>
      </ButtonsWrapper>
    );

  renderLocations = () =>
    this.state.locations.map((location, index) => (
      <MapboxGL.PointAnnotation
        id={location.id.toString()}
        coordinate={[parseFloat(location.longitude), parseFloat(location.latitude)]}
        key={location.id.toString()}>
        <AnnotationContainer>
          <AnnotationText onPress={() => this.handleDetailsModalClose(index)}>
            {location.typeOcurrency}
          </AnnotationText>
        </AnnotationContainer>
      </MapboxGL.PointAnnotation>
    ));

  renderMarker = () =>
    this.state.newRealty &&
    !this.state.cameraModalOpened && (
      <Marker
        resizeMode="contain"
        source={require('../../images/marker.png')}
      />
    );

  renderImagesList = () =>
    this.state.realtyData.images.length !== 0 && (
      <ModalImagesListContainer>
        <ModalImagesList horizontal>
          {this.state.realtyData.images.map((image, key) => (
            <ModalImageItem key={key} source={{uri: image.uri}} resizeMode="stretch" />
          ))}
        </ModalImagesList>
      </ModalImagesListContainer>
    );

  renderDetailsImagesList = () =>
    this.state.detailsModalOpened && (
      <ModalImagesList horizontal>
        {this.state.locations[this.state.realtyDetailed].images.map((image, key) => (
          <ModalImageItem
            key={key}
            source={{uri: `http://10.0.3.2:3333/images/${image.path}`}}
            resizeMode="stretch"
          />
        ))}
      </ModalImagesList>
    );

  renderCameraModal = () => (
    <Modal
      visible={this.state.cameraModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleCameraModalClose}>
      <ModalContainer>
        <ModalContainer>
          <RNCamera
            ref={camera => {
              this.camera = camera;
            }}
            style={{flex: 1}}
            type={RNCamera.Constants.Type.back}
            autoFocus={RNCamera.Constants.AutoFocus.on}
            flashMode={RNCamera.Constants.FlashMode.off}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
          <TakePictureButtonContainer onPress={this.handleTakePicture}>
            <TakePictureButtonLabel />
          </TakePictureButtonContainer>
        </ModalContainer>
        {this.renderImagesList()}
        <ModalButtons>
          <CameraButtonContainer onPress={this.handleCameraModalClose}>
            <CancelButtonText>Cancelar</CancelButtonText>
          </CameraButtonContainer>
          <CameraButtonContainer onPress={this.handleDataModalClose}>
            <ContinueButtonText>Continuar</ContinueButtonText>
          </CameraButtonContainer>
        </ModalButtons>
      </ModalContainer>
    </Modal>
  );

  renderDataModal = () => (
    <Modal
      visible={this.state.dataModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleDataModalClose}>
      <ModalContainer>
        <ModalContainer>
          <MapboxGL.MapView
            centerCoordinate={[
              this.state.realtyData.location.longitude,
              this.state.realtyData.location.latitude,
            ]}
            style={{flex: 1}}
            styleURL={MapboxGL.StyleURL.Dark}>
            <MapboxGL.PointAnnotation
              id="center"
              coordinate={[
                this.state.realtyData.location.longitude,
                this.state.realtyData.location.latitude,
              ]}>
              <MarkerContainer>
                <MarkerLabel />
              </MarkerContainer>
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
        </ModalContainer>
        {this.renderImagesList()}
        <Form>
          <Input
            placeholder="Ocorrência"
            value={this.state.realtyData.name}
            onChangeText={name => this.handleInputChange('name', name)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            placeholder="Endereço"
            value={this.state.realtyData.address}
            onChangeText={address => this.handleInputChange('address', address)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            placeholder="Preço"
            value={this.state.realtyData.typeOcurrency}
            onChangeText={typeOcurrency => this.handleInputChange('typeOcurrency', typeOcurrency)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Form>
        <DataButtonsWrapper>
          <SelectButtonContainer onPress={this.saveRealty}>
            <ButtonText>Salvar Ocorrência</ButtonText>
          </SelectButtonContainer>
          <CancelButtonContainer onPress={this.handleDataModalClose}>
            <ButtonText>Cancelar</ButtonText>
          </CancelButtonContainer>
        </DataButtonsWrapper>
      </ModalContainer>
    </Modal>
  );

  renderDetailsModal = () => (
    <Modal
      visible={this.state.detailsModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleDetailsModalClose}>
      <ModalContainer>
        <DetailsModalFirstDivision>
          <DetailsModalBackButton
            onPress={() => this.handleDetailsModalClose(null)}>
            Voltar
          </DetailsModalBackButton>
        </DetailsModalFirstDivision>
        <DetailsModalSecondDivision>
          <DetailsModalRealtyTitle>
            {this.state.detailsModalOpened
              ? this.state.locations[this.state.realtyDetailed].title
              : ''}
          </DetailsModalRealtyTitle>
          <DetailsModalRealtySubTitle>
            Casa mobiliada com 3 quartos + quintal
          </DetailsModalRealtySubTitle>
          <DetailsModalRealtyAddress>
            {this.state.detailsModalOpened
              ? this.state.locations[this.state.realtyDetailed].address
              : ''}
          </DetailsModalRealtyAddress>
          {this.renderDetailsImagesList()}
        </DetailsModalSecondDivision>
        <DetailsModalThirdDivision>
          <DetailsModaltypeOcurrency>
            R${' '}
            {this.state.detailsModalOpened
              ? this.state.locations[this.state.realtyDetailed].typeOcurrency
              : 0}
          </DetailsModaltypeOcurrency>
        </DetailsModalThirdDivision>
      </ModalContainer>
    </Modal>
  );

  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <MapboxGL.MapView
          zoomEnabled={true}
          zoomLevel={10}
          centerCoordinate={[-49.6446024, -27.2108001]}
          style={{flex: 1}}
          styleURL={MapboxGL.StyleURL.Light}
          ref={map => {
            this.map = map;
          }}>
          {this.renderLocations()}
        </MapboxGL.MapView>
        {this.renderConditionalsButtons()}
        {this.renderMarker()}
        {this.renderCameraModal()}
        {this.renderDataModal()}
        {this.renderDetailsModal()}
      </Container>
    );
  }
}