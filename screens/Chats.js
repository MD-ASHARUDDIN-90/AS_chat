import React, { useContext, useEffect } from "react";
import { Text } from "react-native";
import { auth, db } from "../firebase";
import GlobalContext from "../context/Context";
import { collection, onSnapshot, query, where } from "firebase/firestore";

function Chats() {
	const { currentUser } = auth;
	const { rooms, setRooms } = useContext(GlobalContext);
	// const contacts = useContacts();
	const chatsQuery = query(
		collection(db, "rooms"),
		where("participantsArray", "array-contains", currentUser.email),
	);
	useEffect(() => {
		const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
			const parsedChats = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
				userB: doc
					.data()
					.participants.find((p) => p.email !== currentUser.email),
			}));
			// setUnfilteredRooms(parsedChats);
			setRooms(parsedChats.filter((doc) => doc.lastMessage));
		});
		return () => unsubscribe();
	}, []);
	return <Text>Chats</Text>;
}

export default Chats;
