import React, { Fragment, useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Image, Text, View } from "react-native";
import GlobalContext from "../context/Context";
import Constants from "expo-constants";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { askForPermission, pickImage, uploadImage } from "../utils";
import { auth, db } from "../firebase";
import { updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";

function Profile() {
	const {
		theme: { colors },
	} = useContext(GlobalContext);

	const [displayName, setDisplayName] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [permissionStatus, setPermissionStatus] = useState(null);
	const navigation = useNavigation();

	useEffect(() => {
		(async () => {
			const status = await askForPermission();
			setPermissionStatus(status);
		})();
	}, []);

	async function handleProfilePicture() {
		const result = await pickImage();
		console.log("result : 1", result);
		console.log("result : ", result.assets[0].uri);
		if (!result.canceled) {
			setSelectedImage(
				result.assets && result.assets.length && result.assets[0].uri,
			);
		}
	}
	console.log("selecctedImage : ", selectedImage);

	if (!permissionStatus) {
		return <Text>Loading</Text>;
	}
	if (permissionStatus !== "granted") {
		return <Text>You need to allow this permission</Text>;
	}

	async function handlePress() {
		try {
			const user = auth.currentUser;
			console.log("user :", user);
			let photoURL;
			if (selectedImage) {
				const { url } = await uploadImage(
					selectedImage,
					`images/${user.uid}`,
					"profilePicture",
				);
				photoURL = url;
			}
			const userData = {
				displayName,
				email: user.email,
			};
			if (photoURL) {
				userData.photoURL = photoURL;
			}

			await Promise.all([
				updateProfile(user, userData),
				setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid }),
			]);
			navigation.replace("home");
		} catch (error) {
			console.log("Error in update profile", error);
		}
	}

	return (
		<Fragment>
			<StatusBar style='auto' />
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					flex: 1,
					paddingTop: Constants.statusBarHeight + 20,
					padding: 20,
				}}
			>
				<Text style={{ fontSize: 22, color: colors.foreground }}>
					Profile Info
				</Text>
				<Text style={{ fontSize: 14, color: colors.text, marginTop: 20 }}>
					Please provide your name and an optional profile photo
				</Text>
				<TouchableOpacity
					onPress={handleProfilePicture}
					style={{
						marginTop: 30,
						borderRadius: 120,
						width: 120,
						height: 120,
						backgroundColor: colors.background,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{!selectedImage ? (
						<MaterialCommunityIcons
							name='camera-plus'
							color={colors.iconGray}
							size={45}
						/>
					) : (
						<Image
							source={{ uri: selectedImage && selectedImage }}
							style={{ width: "100%", height: "100%", borderRadius: 120 }}
						/>
					)}
				</TouchableOpacity>
				<TextInput
					placeholder='Type your name'
					value={displayName}
					onChangeText={setDisplayName}
					style={{
						borderBottomColor: colors.primary,
						marginTop: 40,
						borderBottomWidth: 2,
						width: "100%",
					}}
				/>
				<View style={{ marginTop: "auto", width: 80 }}>
					<Button
						title='Next'
						color={colors.secondary}
						onPress={handlePress}
						disabled={!displayName}
					/>
				</View>
			</View>
		</Fragment>
	);
}

export default Profile;
