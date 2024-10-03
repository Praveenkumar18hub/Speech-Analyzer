import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";

const Header = ({ onBackPress }) => {
  return (
    <View className="flex-row px-2 py-2 mt-9 ml-2 items-center bg-primary">
      <TouchableOpacity
        onPress={onBackPress}
        className="w-20 h-10 rounded-lg items-center justify-center space-x-2 flex-row"
        activeOpacity={0.7}
      >
        <FontAwesome5 name="chevron-left" size={24} color="#FFFFFF" />
        <Text className="text-secondary opacity-90 font-psemibold text-xl"> Back </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
