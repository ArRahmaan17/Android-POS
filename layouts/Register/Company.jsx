import { ScrollView, Text, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  Divider,
  List,
  MD2Colors,
  TextInput,
} from "react-native-paper";
import Wizard, { WizardRef } from "react-native-wizard";
import React, { useEffect, useRef, useState } from "react";
import { httpHelper } from "../../helpers/HttpHelper";
import { Formik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Company(props) {
  const wizard = useRef(null);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [isLastStep, setIsLastStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companyType, setCompanyType] = useState(null);
  const stepList = [
    {
      content: (
        <View style={{ flex: 1, flexDirection: "column", minWidth: "100%" }}>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your company name"
              mode="outlined"
              label="Name"
              value={props.company.name}
              onChangeText={(e) =>
                props.handleOnChange(e, "name", props.setCompany)
              }
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your company email"
              mode="outlined"
              label="Email"
              value={props.company.email}
              onChangeText={(e) =>
                props.handleOnChange(e, "email", props.setCompany)
              }
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your company phone number"
              mode="outlined"
              label="Phone number"
              value={props.company.phone_number}
              onChangeText={(e) =>
                props.handleOnChange(e, "phone_number", props.setCompany)
              }
            />
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
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your building"
              mode="outlined"
              label="Building"
              value={props.address.building}
              onChangeText={(e) =>
                props.handleOnChange(e, "place", props.setAddress)
              }
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your address"
              mode="outlined"
              label="Address"
              value={props.address.address}
              onChangeText={(e) =>
                props.handleOnChange(e, "address", props.setAddress)
              }
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your city"
              mode="outlined"
              label="City"
              value={props.address.city}
              onChangeText={(e) =>
                props.handleOnChange(e, "city", props.setAddress)
              }
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your state/province"
              mode="outlined"
              label="State/Province"
              value={props.address.province}
              onChangeText={(e) =>
                props.handleOnChange(e, "province", props.setAddress)
              }
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Please enter your zip code"
              mode="outlined"
              label="Zip code"
              value={props.address.zipCode}
              onChangeText={(e) =>
                props.handleOnChange(e, "zipCode", props.setAddress)
              }
            />
          </View>
        </View>
      ),
    },
    {
      content: (
        <>
          <Text>Business type</Text>
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
            <Button
              style={{
                borderRadius: 5,
              }}
              icon="fingerprint"
              mode="contained"
              onPress={() => {
                registerCompany();
              }}
            >
              Register
            </Button>
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
    return await httpHelper("GET", "check-company-availability", props.company);
  };
  const registerCompany = async () => {
    const statusCompany = await checkAvailabilityCompany();
    if (statusCompany.code !== 200) {
      if (Object.keys(statusCompany.data.errors)[0] !== "businessId") {
        wizard.current.goTo(0);
      }
      return;
    }
    const resultRegister = await httpHelper("POST", "register", {
      user: { ...props.user },
      company: { ...props.company },
      address: { ...props.address },
    });
    if (resultRegister.code !== 200) {
      switch (Object.keys(resultRegister.data.errors)[0].split(".")[0]) {
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
  };

  return (
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
            onPress={() => (!isLastStep ? wizard.current.next() : null)}
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
          currentStep={({ currentStep, isLastStep, isFirstStep }) => {
            if (isLastStep) {
              getCompanyTypes();
            }
            setCurrentStep(currentStep);
          }}
        />
      </View>
    </View>
    // <Formik initialValues={props.user} onSubmit={props.checkAvailabilityUser}>
    //   <View
    //     style={{
    //       flex: 1,
    //       height: "100%",
    //       flexDirection: "column",
    //       width: "100%",
    //     }}
    //   >
    //     <View style={{ width: "100%" }}>
    //       <Text style={{ fontSize: 14 }}>Company Address</Text>
    //     </View>
    //     <Divider bold={true} />
    //     <View style={{ marginBottom: 10, width: "100%" }}>
    //       <TextInput
    //         placeholder="Please enter your building"
    //         mode="outlined"
    //         label="Building"
    //         value={props.company.building}
    //         onChangeText={(e) => props.handleOnChange(e, "building")}
    //       />
    //     </View>
    //     <View style={{ marginBottom: 10, width: "100%" }}>
    //       <TextInput
    //         placeholder="Please enter your address"
    //         mode="outlined"
    //         label="Address"
    //         value={props.company.address}
    //         onChangeText={(e) => props.handleOnChange(e, props.setAddress)}
    //       />
    //     </View>
    //     <View style={{ marginBottom: 10, width: "100%" }}>
    //       <TextInput
    //         placeholder="Please enter your city"
    //         mode="outlined"
    //         label="City"
    //         value={props.company.city}
    //         onChangeText={(e) => props.handleOnChange(e, "city")}
    //       />
    //     </View>
    //     <View style={{ marginBottom: 10, width: "100%" }}>
    //       <TextInput
    //         placeholder="Please enter your state/province"
    //         mode="outlined"
    //         label="State/Province"
    //         value={props.company.province}
    //         onChangeText={(e) => props.handleOnChange(e, "province")}
    //       />
    //     </View>
    //     <View style={{ marginBottom: 10, width: "100%" }}>
    //       <TextInput
    //         placeholder="Please enter your zip code"
    //         mode="outlined"
    //         label="Zip code"
    //         value={props.company.zipCode}
    //         onChangeText={(e) => props.handleOnChange(e, "zipCode")}
    //       />
    //     </View>
    //     <View
    //       style={{ flex: 1, flexDirection: "column", width: "100%", rowGap: 5 }}
    //     >
    //       <Button
    //         style={{
    //           borderRadius: 5,
    //         }}
    //         icon="fingerprint"
    //         mode="contained"
    //         onPress={() => checkAvailabilityCompany()}
    //       >
    //         Register
    //       </Button>
    //     </View>
    //   </View>
    // </Formik>
  );
}
