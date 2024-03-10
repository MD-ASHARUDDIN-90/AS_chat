import React, { useContext, useState } from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import Context from "../context/Context";
import { TextInput } from "react-native-gesture-handler";
import { signIn, signUp } from "../firebase";

function SignIn() {
	const {
		theme: { colors },
	} = useContext(Context);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState("signUp");

	async function handlePress() {
		if (mode === "signUp") {
			try {
				const res = await signUp(email, password);
				console.log("Sign Up", res);
			} catch (error) {
				console.log("signUpError", error);
			}
		}
		if (mode === "signIn") {
			try {
				const res = await signIn(email, password);
				console.log("signIn", res);
			} catch (error) {
				console.log("SignInError", error);
			}
		}
	}

	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				flex: 1,
				backgroundColor: colors.white,
			}}
		>
			<Text
				style={{ color: colors.foreground, fontSize: 24, marginBottom: 20 }}
			>
				Welcome to Sipla Chat
			</Text>
			<Image
				source={require("../assets/welcome-img.png")}
				style={{ width: 180, height: 180 }}
				resizeMode='cover'
			/>

			<View style={{ marginTop: 20 }}>
				<TextInput
					style={{
						borderBottomColor: colors.primary,
						borderBottomWidth: 2,
						width: 200,
					}}
					placeholder='Email'
					value={email}
					onChangeText={setEmail}
				/>
				<TextInput
					placeholder='Password'
					value={password}
					onChangeText={setPassword}
					secureTextEntry={true}
					style={{
						borderBottomColor: colors.primary,
						borderBottomWidth: 2,
						width: 200,
						marginTop: 20,
					}}
				/>
				<View style={{ marginTop: 20 }}>
					<Button
						title={mode === "signUp" ? "Sign Up" : "Sign in"}
						disabled={!password || !email}
						color={colors.secondary}
						onPress={handlePress}
					/>
				</View>
				<TouchableOpacity
					style={{ marginTop: 20, alignSelf: "center" }}
					onPress={() => {
						if (mode === "signUp") {
							setMode("signIn");
						} else {
							setMode("signUp");
						}
					}}
				>
					<Text style={{ color: colors.secondaryText, fontWeight: "bold" }}>
						{mode === "signUp"
							? `Already have and account? Sign-In`
							: `Don't have an account? Sign-Up`}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default SignIn;
