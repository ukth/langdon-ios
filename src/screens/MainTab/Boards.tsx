import { Board } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../constants/urls";
import { getData, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "src/navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";

const Boards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const { accessToken } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const data = await postData(API_URL + "board/getBoards", { accessToken });
      console.log(data);
      if (data?.ok) {
        setBoards(data?.boards);
      }
    })();
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: 100,
        display: "flex",
        marginBottom: 10,
      }}
    >
      {boards.map((board) => (
        <Pressable
          key={board.id}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            },
            {
              borderBottomColor: "#505050",
              borderBottomWidth: 1,
            },
          ]}
          onPress={() =>
            navigation.push("Board", { id: board.id, title: board.title })
          }
        >
          <Text>{board.title}</Text>
        </Pressable>
      ))}
    </KeyboardAwareScrollView>
  );
};

export default Boards;