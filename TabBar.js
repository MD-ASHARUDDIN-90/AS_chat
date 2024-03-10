import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Context from "./context/Context";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import Photo from "./screens/Photo";
import Chats from "./screens/Chats";
import { Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

function TabBar() {
	const {
		theme: { colors },
	} = useContext(Context);
	return (
		<Tab.Navigator
			screenOptions={({ route }) => {
				return {
					tabBarLabel: () => {
						if (route.name === "photo") {
							return <Ionicons name='camera' size={20} color={colors.white} />;
						} else {
							return (
								<Text style={{ color: colors.white }}>
									{route.name.toLocaleUpperCase()}
								</Text>
							);
						}
					},
					tabBarShowIcon: true,
					tabBarLabelStyle: {
						color: colors.white,
					},
					tabBarIndicatorStyle: {
						backgroundColor: colors.white,
					},
					tabBarStyle: {
						backgroundColor: colors.foreground,
					},
				};
			}}
			initialRouteName='chats'
		>
			<Tab.Screen name='photo' component={Photo} />
			<Tab.Screen name='chats' component={Chats} />
		</Tab.Navigator>
	);
}

export default TabBar;
