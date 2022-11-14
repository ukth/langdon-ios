import {
  Class,
  ClassMeeting,
  ClassWithSections,
  Course,
  FullSection,
} from "@customTypes/models";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { getMeetingTimeString, nestedSection } from "../util";
import ClassInfoBox from "./ClassInfoBox";
import MyPressable from "./MyPressable";
import { BoldText } from "./StyledText";

export const getClassFromNested = (nested: nestedSection) => {
  let section = nested;
  let maxLoop = 10;
  while (Array.isArray(section.value) && maxLoop > 0) {
    section = section.value[0];
    maxLoop--;
  }
  return section.value as ClassWithSections;
};

const SectionBox = ({
  section,
  onPress,
  enrolledClasses,
  updateEnrolledClasses,
}: {
  section: nestedSection;
  onPress: (id: number) => void;
  enrolledClasses: (Class & {
    sections: FullSection[];
  } & {
    course: Course;
  })[];
  updateEnrolledClasses: () => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const cls = getClassFromNested(section);
  cls.sections[0].type;
  cls.sections[0].sectionNumber;
  const [type, sectionNumber] = section.code.split(" ");

  let meeting: ClassMeeting | undefined = undefined;

  for (let i = 0; i < cls.sections.length; i++) {
    const sect = cls.sections[i];
    if (!sect.classMeetings) {
      break;
    }
    if (sect.type === type && sect.sectionNumber == sectionNumber) {
      for (let j = 0; j < sect.classMeetings.length; j++) {
        let meet = sect.classMeetings[j];
        if (meet.meetingType === "CLASS") {
          meeting = meet;
        }
      }
      // sect.classMeetings;
    }
  }

  return (
    <View
      style={{
        justifyContent: "center",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <MyPressable
          style={{
            height: 22,
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => setShowDetails(!showDetails)}
        >
          <BoldText style={{ marginRight: 5, color: "white" }}>
            {section.code}{" "}
            {meeting
              ? `( ${meeting.meetingDays} ${getMeetingTimeString(meeting)} )`
              : ""}
          </BoldText>
          <Ionicons
            name="triangle"
            size={14}
            color={"white"}
            style={{
              transform: [{ rotate: showDetails ? "180deg" : "90deg" }],
            }}
          />
        </MyPressable>
      </View>
      {showDetails ? (
        Array.isArray(section.value) ? (
          <View style={{ paddingLeft: 30 }}>
            {section.value.map((sect) => (
              <SectionBox
                key={sect.code}
                section={sect}
                onPress={onPress}
                enrolledClasses={enrolledClasses}
                updateEnrolledClasses={updateEnrolledClasses}
              />
            ))}
          </View>
        ) : (
          <View style={{ paddingVertical: 10 }}>
            <ClassInfoBox
              id={section.value.id}
              enrolledClasses={enrolledClasses}
              updateEnrolledClasses={updateEnrolledClasses}
            />
          </View>
        )
      ) : null}
    </View>
  );
};

export default SectionBox;
