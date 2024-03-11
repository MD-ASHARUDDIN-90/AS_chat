import { Text, LogBox } from "react-native";
import { useAssets } from "expo-asset";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./screens/SignIn";
import ContextWrapper from "./context/ContextWrapper";
import Context from "./context/Context";
import Profile from "./screens/Profile";
import Home from "./TabBar";
import Contacts from "./screens/Contacts";
import Chat from "./screens/Chat";
import ChatHeader from "./components/ChatHeader";

LogBox.ignoreLogs([
	"Setting a timer",
	"AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);

const Stack = createStackNavigator();

function App() {
	const [currUser, setCurrUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const {
		theme: { colors },
	} = useContext(Context);

	console.log("currentUser", currUser);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setLoading(false);
			if (user) {
				setCurrUser(user);
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<NavigationContainer>
			{!currUser ? (
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name='signIn' component={SignIn} />
				</Stack.Navigator>
			) : (
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: colors.foreground,
							shadowOpacity: 0,
							elevation: 0,
						},
						headerTintColor: colors.white,
					}}
				>
					{!currUser.displayName && (
						<Stack.Screen
							name='profile'
							component={Profile}
							options={{ headerShown: false }}
						/>
					)}
					<Stack.Screen
						name='home'
						options={{ title: "Home" }}
						component={Home}
					/>
					<Stack.Screen
						name='contacts'
						options={{ title: "Select Contacts" }}
						component={Contacts}
					/>
					<Stack.Screen
						name='chat'
						component={Chat}
						options={{ headerTitle: (props) => <ChatHeader {...props} /> }}
					/>
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
}

export default function Main() {
	const [assets] = useAssets(
		require("./assets/icon-square.png"),
		require("./assets/chatbg.png"),
		require("./assets/user-icon.png"),
		require("./assets/welcome-img.png"),
	);
	if (!assets) return <Text>Loading...</Text>;
	return (
		<ContextWrapper>
			<App />
		</ContextWrapper>
	);
}
