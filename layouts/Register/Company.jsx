import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  HelperText,
  MD2Colors,
  TextInput,
} from "react-native-paper";
import Wizard, { WizardRef } from "react-native-wizard";
import React, { useEffect, useRef, useState } from "react";
import { httpHelper } from "../../helpers/HttpHelper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

export default function Company(props) {
  const wizard = useRef(null);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [isLastStep, setIsLastStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companyType, setCompanyType] = useState(null);
  const [errorsCompany, setErrorsCompany] = useState({
    name: null,
    email: null,
    phone_number: null,
  });
  const [statusCompany, setStatusCompany] = useState(false);
  const companySchema = yup.object({
    name: yup.string().required().min(5).max(10),
    email: yup.string().required().email(),
    phone_number: yup
      .string()
      .required()
      .matches(
        /628\d{9,10}$/,
        "phone_number is must indonesian phone number format"
      ),
  });
  const [errorsAddress, setErrorsAddress] = useState({
    place: null,
    address: null,
    city: null,
    province: null,
    zipCode: null,
  });
  const addressSchema = yup.object({
    place: yup.string().required().min(5).max(20),
    address: yup.string().required().min(5).max(20),
    city: yup.string().required().min(5).max(20),
    province: yup.string().required().min(5).max(20),
    zipCode: yup.string().required().min(5).max(20),
  });
  const stepList = [
    {
      content: (
        <View style={{ flex: 1, flexDirection: "column", minWidth: "100%" }}>
          <Text style={{ fontSize: 17 }}>Company</Text>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your company name"
              mode="outlined"
              label="Name"
              value={props.company.name}
              onChangeText={(e) =>
                props.handleOnChange(e, "name", props.setCompany)
              }
            />
            <HelperText type="error" visible={errorsCompany.name !== null}>
              {errorsCompany?.name}
            </HelperText>
          </View>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your company email"
              mode="outlined"
              label="Email"
              value={props.company.email}
              onChangeText={(e) =>
                props.handleOnChange(e, "email", props.setCompany)
              }
            />
            <HelperText type="error" visible={errorsCompany.email !== null}>
              {errorsCompany?.email}
            </HelperText>
          </View>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your company phone number"
              mode="outlined"
              label="Phone number"
              value={props.company.phone_number}
              onChangeText={(e) =>
                props.handleOnChange(e, "phone_number", props.setCompany)
              }
            />
            <HelperText
              type="error"
              visible={errorsCompany.phone_number !== null}
            >
              {errorsCompany.phone_number &&
                errorsCompany.phone_number.split("_").join(" ")}
            </HelperText>
          </View>
        </View>
      ),
    },
    {
      content: (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            minWidth: "100%",
          }}
        >
          <Text style={{ fontSize: 17 }}>Address</Text>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your building"
              mode="outlined"
              label="Building"
              value={props.address.place}
              onChangeText={(e) =>
                props.handleOnChange(e, "place", props.setAddress)
              }
            />
            <HelperText type="error" visible={errorsAddress.building !== null}>
              {errorsAddress?.building}
            </HelperText>
          </View>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your address"
              mode="outlined"
              label="Address"
              value={props.address.address}
              onChangeText={(e) =>
                props.handleOnChange(e, "address", props.setAddress)
              }
            />
            <HelperText type="error" visible={errorsAddress.address !== null}>
              {errorsAddress?.address}
            </HelperText>
          </View>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your city"
              mode="outlined"
              label="City"
              value={props.address.city}
              onChangeText={(e) =>
                props.handleOnChange(e, "city", props.setAddress)
              }
            />
            <HelperText type="error" visible={errorsAddress.city !== null}>
              {errorsAddress?.city}
            </HelperText>
          </View>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your state/province"
              mode="outlined"
              label="State/Province"
              value={props.address.province}
              onChangeText={(e) =>
                props.handleOnChange(e, "province", props.setAddress)
              }
            />
            <HelperText type="error" visible={errorsAddress.province !== null}>
              {errorsAddress?.province}
            </HelperText>
          </View>
          <View>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              placeholder="Please enter your zip code"
              mode="outlined"
              label="Zip code"
              value={props.address.zipCode}
              onChangeText={(e) =>
                props.handleOnChange(e, "zipCode", props.setAddress)
              }
            />
            <HelperText type="error" visible={errorsAddress.zipCode !== null}>
              {errorsAddress?.zipCode}
            </HelperText>
          </View>
        </View>
      ),
    },
    {
      content: (
        <>
          <Text style={{ fontSize: 17 }}>Business type</Text>
          <View
            style={{
              flex: 1,
              flexDirection: isLoading ? "column" : "row",
              justifyContent: isLoading ? "center" : "start",
              gap: 4,
              flexShrink: 1,
              flexWrap: "wrap",
              marginVertical: 5,
            }}
          >
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  flexShrink: 1,
                  width: "100%",
                  rowGap: 5,
                }}
              >
                <ActivityIndicator
                  size={"large"}
                  animating={true}
                  color={MD2Colors.indigo700}
                />
              </View>
            ) : (
              <>
                {companyTypes &&
                  companyTypes.map((item, index) => (
                    <Chip
                      style={{ flexGrow: 1 }}
                      selectedColor={MD2Colors.indigo700}
                      mode={companyType === item.id ? "flat" : "outlined"}
                      icon={companyType === item.id ? "check" : "cancel"}
                      key={index}
                      selected={!companyType && item.id === companyType}
                      onPress={() => {
                        if (item.id === companyType) {
                          setCompanyType(0);
                          props.handleOnChange(
                            0,
                            "businessId",
                            props.setCompany
                          );
                        } else {
                          setCompanyType(item.id);
                          props.handleOnChange(
                            item.id,
                            "businessId",
                            props.setCompany
                          );
                        }
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>{item.name}</Text>
                    </Chip>
                  ))}
              </>
            )}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              minWidth: "100%",
              rowGap: 5,
            }}
          >
            {!statusCompany ? (
              <Button
                style={{
                  borderRadius: 5,
                }}
                icon="office-building"
                mode="elevated"
                onPress={async () => {
                  await checkAvailabilityCompany();
                }}
              >
                Check Company Availability
              </Button>
            ) : (
              <Button
                style={{
                  borderRadius: 5,
                }}
                icon="fingerprint"
                mode="elevated"
                onPress={async () => {
                  await registerCompany();
                }}
              >
                Register
              </Button>
            )}
          </View>
        </>
      ),
    },
  ];
  const getCompanyTypes = async () => {
    setIsLoading(true);
    let dataCompanyType = await httpHelper("GET", "company-types");
    setCompanyTypes(dataCompanyType.data.data);
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  };
  const checkAvailabilityCompany = async () => {
    try {
      await httpHelper("GET", "check-company-availability", props.company);
      setStatusCompany(true);
    } catch (error) {
      if (
        error?.data?.errors &&
        Object.keys(error.data.errors)[0] !== "businessId"
      ) {
        wizard.current.goTo(0);
      }
    }
    return;
  };
  const registerCompany = async () => {
    try {
      let data = {
        user: { ...props.user },
        company: { ...props.company },
        address: { ...props.address },
      };
      let resultRegister = await httpHelper("POST", "register", { ...data });
      let user = { ...props.user };
      props.setCompany({});
      props.setAddress({});
      props.setUser({});
      props.navigation.replace("Login", { user: user });
    } catch (error) {
      if (error.code !== 200) {
        switch (
          error.data.errors &&
          Object.keys(error.data.errors)[0].split(".")[0]
        ) {
          case "user":
            props.setAvailableUser(false);
            break;
          case "company":
            wizard.current.goTo(0);
            break;
          case "address":
            wizard.current.goTo(1);
            break;
          default:
            break;
        }
      }
    }
  };
  useEffect(() => {
    getCompanyTypes();
  }, [props.availableUser]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          maxHeight: "100%",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <SafeAreaView>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#FFF",
            }}
          >
            <Button
              buttonColor={
                !isFirstStep ? MD2Colors.indigo300 : MD2Colors.indigo100
              }
              textColor={MD2Colors.white}
              rippleColor={MD2Colors.indigo100}
              mode="elevated"
              onPress={() => (!isFirstStep ? wizard.current.prev() : null)}
            >
              Prev
            </Button>
            <Text>{currentStep + 1}. Step</Text>
            <Button
              buttonColor={
                !isLastStep ? MD2Colors.indigo300 : MD2Colors.indigo100
              }
              textColor={MD2Colors.white}
              rippleColor={MD2Colors.indigo100}
              mode="elevated"
              onPress={async () => {
                if (!isLastStep) {
                  if (currentStep === 0) {
                    setErrorsCompany({
                      name: null,
                      email: null,
                      phone_number: null,
                    });
                    try {
                      await companySchema.validate(
                        { ...props.company },
                        {
                          abortEarly: false,
                        }
                      );
                      wizard.current.next();
                    } catch (error) {
                      error.errors.map((err) => {
                        const key = err.match(/(\w{1,})\ /);
                        setErrorsCompany((prevState) => ({
                          ...prevState,
                          [key[1]]: err,
                        }));
                      });
                    }
                  } else if (currentStep === 1) {
                    setErrorsAddress({
                      place: null,
                      address: null,
                      city: null,
                      province: null,
                      zipCode: null,
                    });
                    try {
                      await addressSchema.validate(
                        { ...props.address },
                        {
                          abortEarly: false,
                        }
                      );
                      wizard.current.next();
                    } catch (error) {
                      error.errors.map((err) => {
                        const key = err.match(/(\w{1,})\ /);
                        setErrorsAddress((prevState) => ({
                          ...prevState,
                          [key[1]]: err,
                        }));
                      });
                    }
                  }
                } else {
                  null;
                }
              }}
            >
              Next
            </Button>
          </View>
        </SafeAreaView>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Wizard
            ref={wizard}
            steps={stepList}
            isFirstStep={(val) => setIsFirstStep(val)}
            isLastStep={(val) => setIsLastStep(val)}
            nextStepAnimation="slideRight"
            prevStepAnimation="slideLeft"
            currentStep={async ({ currentStep, isLastStep, isFirstStep }) => {
              setCurrentStep(currentStep);
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
