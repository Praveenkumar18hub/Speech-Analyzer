import { View, Text, TextInput, Image, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import icons from '../constants/icons';

const FormField  = ({ title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-[#eeebe3] font-pmedium"> {title} </Text>

      <View className="h-16 px-4 bg-black-200 border-2 border-[#eeebe3] rounded-2xl focus:border-secondary items-center flex-row">

        <TextInput 
         className="flex-1 text-[#eeebe3] font-psemibold text-base"
         value={value}
         placeholder={placeholder}
         placeholderTextColor="#FFFFFF"
         onChangeText={handleChangeText}
         secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword (!showPassword) }>
                <Image source={showPassword ? icons.hide : icons.eye } 
                style={{tintColor:'#eeebe3'}}
                className="w-6 h-6 text-[#eeebe3]"
                resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField 