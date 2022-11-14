import {
  Class,
  ClassMeeting,
  ClassMeetingWithBuilding,
  Course,
  FullSection,
} from "@customTypes/models";
import React, { useContext } from "react";
import { Alert, Linking, Pressable, View } from "react-native";
import { BoldText } from "./StyledText";
import { Ionicons } from "@expo/vector-icons";
import { colors, messages } from "../constants";
import { shadow } from "../constants/styles";
import { MyPressable } from "../components";
import { ProgressContext } from "../contexts/progressContext";
import { deleteClass } from "../apiFunctions";
import { UserContext } from "../contexts/userContext";

const CoursePopUpBox = ({
  cls,
  meeting,
  closePopUp,
}: {
  cls: Class & {
    sections: FullSection[];
  } & {
    course: Course;
  };
  meeting: ClassMeetingWithBuilding;
  closePopUp: () => void;
}) => {
  // const theme = useContext(ThemeContext);

  const { spinner } = useContext(ProgressContext);
  const userContext = useContext(UserContext);

  return (
    <Pressable
      style={{
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={closePopUp}
    >
      <View
        style={{
          backgroundColor: "black",
          opacity: 0.3,
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          width: "70%",
          minHeight: "25%",
          padding: 15,
          ...shadow.hard,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <BoldText style={{ color: colors.mediumThemeColor, opacity: 0.8 }}>
              {cls.course.fullCourseDesignation}
            </BoldText>
            <BoldText
              style={{
                color: colors.mediumThemeColor,
                opacity: 0.8,
                marginBottom: 2,
              }}
            >
              {cls.course.courseDesignation}
            </BoldText>
          </View>
          <MyPressable
            hitSlop={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 10,
            }}
            onPress={async () => {
              spinner.start();
              await deleteClass(userContext, cls.id);
              spinner.stop();
              closePopUp();
            }}
          >
            <Ionicons name="trash" size={16} color={colors.mediumThemeColor} />
          </MyPressable>
        </View>
        <View
          style={{
            backgroundColor: colors.lightThemeColor,
            height: 1,
            opacity: 0.4,
            marginBottom: 2,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <BoldText
            style={{
              fontSize: 12,
              color: colors.mediumThemeColor,
              opacity: 0.8,
              maxWidth: "80%",
            }}
          >
            {cls.course.title}
          </BoldText>
          <BoldText
            style={{
              fontSize: 11,
              color: colors.mediumThemeColor,
              opacity: 0.8,
            }}
          >
            credit: {cls.course.minimumCredits}
            {cls.course.minimumCredits !== cls.course.maximumCredits
              ? " ~ " + cls.course.maximumCredits
              : ""}
          </BoldText>
        </View>
        <BoldText
          style={{
            fontSize: 12,
            color: colors.mediumThemeColor,
            opacity: 0.8,
            marginBottom: 5,
          }}
        >
          Prerequisites:
        </BoldText>
        <BoldText
          style={{
            fontSize: 11,
            color: colors.mediumThemeColor,
            opacity: 0.8,
            marginBottom: 10,
          }}
        >
          {cls.course.enrollmentPrerequisites}
        </BoldText>
        <BoldText
          style={{
            fontSize: 11,
            color: colors.mediumThemeColor,
            opacity: 0.9,
            marginBottom: 15,
          }}
        >
          {cls.sections.map(
            (sec) =>
              (sec.instructor.firstName ?? "") +
              " " +
              (sec.instructor.middleName
                ? sec.instructor.middleName + " "
                : "") +
              sec.instructor.lastName
          )}
        </BoldText>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <MyPressable
            style={{ paddingHorizontal: 5 }}
            hitSlop={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 10,
            }}
            onPress={() => {}}
          >
            <Ionicons name="reader" color={colors.mediumThemeColor} size={20} />
          </MyPressable>
          <MyPressable
            style={{
              backgroundColor: colors.lightThemeColor,
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              ...shadow.md,
            }}
            onPress={() => {
              try {
                if (
                  meeting.building &&
                  meeting.building.latitude &&
                  meeting.building.longitude
                ) {
                  Linking.openURL(
                    "https://maps.google.com/?q=@" +
                      meeting.building.latitude +
                      "," +
                      meeting.building.longitude
                  );
                } else {
                  Alert.alert(
                    messages.errorMessages.timeTable
                      .cantOpenGoogleMapsOfBuilding
                  );
                }
              } catch {
                Alert.alert(
                  messages.errorMessages.timeTable.cantOpenGoogleMaps
                );
              }
            }}
          >
            <View style={{ marginRight: 10 }}>
              <BoldText style={{ color: "white", fontSize: 12 }}>
                {meeting.building.buildingName}
              </BoldText>
              <BoldText style={{ color: "white", fontSize: 12 }}>
                {meeting.building.streetAddress}
              </BoldText>
            </View>
            <Ionicons name="location" color={"white"} size={20} />
          </MyPressable>
        </View>
      </View>
    </Pressable>
  );
};

export default CoursePopUpBox;
