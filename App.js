import React from 'react';
import {Image, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function App() {
    return (<SafeAreaProvider>
        <ScrollView>
            <View style={{
                flex: 1,
                flexWrap: 'wrap',
                columnGap: 3,
                flexDirection: 'column',
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white'
            }}>
                <View style={{
                    flex: 1,
                    width: '100%',
                    maxWidth: 400,
                    maxHeight: 400
                }}>
                    <Image source={require("./assets/login-image.jpg")}
                           style={{
                               objectFit: 'contain',
                               width: '100%',
                               height: '100%',
                           }}/>
                </View>
                <View style={{flex: 1, height: '100%', flexDirection: 'column', width: '100%'}}>
                    <View style={{marginBottom: 10, width: '100%'}}>
                        <Text nativeID="username">Username/Email/Phone number</Text>
                        <TextInput autoFocus={true} accessibilityLabel="input"
                                   accessibilityLabelledBy="username"
                                   placeholder="Please enter your username"
                                   inputMode="text"
                                   style={{
                                       width: '100%',
                                       borderStyle: 'solid',
                                       borderWidth: 2,
                                       borderColor: "black",
                                       borderRadius: 5,
                                   }}/>
                    </View>
                    <View style={{marginBottom: 10, width: '100%'}}>
                        <Text nativeID="password">Password</Text>
                        <TextInput accessibilityLabel="input"
                                   accessibilityLabelledBy="password"
                                   placeholder="Please enter your password"
                                   inputMode="text"
                                   style={{
                                       width: '100%',
                                       borderStyle: 'solid',
                                       borderWidth: 2,
                                       borderColor: "black",
                                       borderRadius: 7,
                                   }}/>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column', width: '100%', rowGap: 5}}>
                        <TouchableOpacity style={{
                            width: '100%',
                            borderRadius: 5,
                            paddingTop: 5,
                            paddingBottom: 5,
                            backgroundColor: 'blue',
                        }} onPress={() => {
                            ToastAndroid.show("login", ToastAndroid.SHORT);
                        }}>
                            <Text style={{textAlign: 'center', color: '#fff'}}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: '100%',
                            borderRadius: 5,
                            paddingTop: 5,
                            paddingBottom: 5,
                            backgroundColor: 'green',
                        }} onPress={() => {
                            ToastAndroid.show("register", ToastAndroid.SHORT);
                        }}>
                            <Text style={{textAlign: 'center', color: '#fff'}}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    </SafeAreaProvider>);
}