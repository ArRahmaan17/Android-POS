import React, { useRef, useState, useEffect } from "react";
import { Animated } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function AnimatedButton({ handleClick, errorMessage, color }) {
  const theme = useTheme();
  const [step, setStep] = useState(3);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const buttonColor = color || theme.colors.primary;
  const steps = [
    "Validating...",
    "Add To Product...",
    "Prepare Another Product...",
    "Add More Product",
  ];
  const handleAddProduct = () => {
    console.log(errorMessage, "errorsMessage animated button");
    setClicked(true);
    setLoading(true);
    handleClick();
    setStep(0);
  };
  useEffect(() => {
    if (step < steps.length - 1 && clicked) {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          if (errorMessage) {
            setStep(steps.length - 1);
          } else {
            setStep((s) => s + 1);
          }
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
      setClicked(false);
      setStep(steps.length - 1);
    }
  }, [step]);
  return (
    <Button
      buttonColor={buttonColor}
      textColor="white"
      loading={loading}
      disabled={loading}
      mode="contained"
      onPress={() => handleAddProduct()}
      style={{
        flex: 1,
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <Animated.Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          opacity: fadeAnim,
        }}
      >
        {steps[step] ? steps[step] : steps[steps.length - 1]}
      </Animated.Text>
    </Button>
  );
}
