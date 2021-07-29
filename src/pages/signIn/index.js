/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StatusBar , Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import 'react-native-gesture-handler';
import api from '../../services/api';
import DashboardRoutes from '../../routes/dashboard.routes';

import {
  Container,
  Logo,
  Input,
  ErrorMessage,
  Button,
  ButtonText,
  SignUpLink,
  SignUpLinkText,
  TextCoupom
} from './styles';

function GoToButton() {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => navigation.navigate('Main')}
    />
  );
}


export default class SignIn extends Component {

  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
    }).isRequired,
  };

  state = {
    email: 'fabio@oi.com.br',
    password: '123456',
    error: '',
  };

  handleEmailChange = (email) => {
    this.setState({ email });
  };

  handlePasswordChange = (password) => {
    this.setState({ password });
  };

  handleCreateAccountPress = () => {
    navigation.navigate('SignUp');
  };

  handleSignInPress = async () => { 
    alert('Teste');
    this.props.navigation.navigate('Main');
    };
  


  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <StatusBar hidden />
        <Logo source={require('../../images/logo-sop.png')} resizeMode="contain" />
        <TextCoupom>Sistema de ocorrências publicas</TextCoupom>
        <Input
          placeholder="Endereço de e-mail"
          value={this.state.email}
          onChangeText={this.handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          placeholder="Senha"
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        
        {this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
        <Button onPress={this.handleSignInPress}>
          <ButtonText>Entrar</ButtonText>
        </Button>
        <SignUpLink onPress={GoToButton}>
          <SignUpLinkText>Meu Primeiro Acesso</SignUpLinkText>
        </SignUpLink>
          <DashboardRoutes />
        </Container>
 


   
    );
  }
}