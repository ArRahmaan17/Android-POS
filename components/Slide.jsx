import {Animated} from "react-native";
import {useEffect} from "react";

export default function Slide(props) {
    const [widthAnimation, setWidthAnimation] = useState(100);
    useEffect(() => {
        Animated.timing(widthAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [props.status])
    return (<Animated.View style={{width: widthAnimation}}>
        {props.children}
    </Animated.View>)
}