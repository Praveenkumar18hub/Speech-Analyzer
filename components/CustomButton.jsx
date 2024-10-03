import { ActivityIndicator, TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.6}
      className={`bg-secondary opacity-80 rounded-xl min-h-[50px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} 
      disabled={isLoading}
    >

        <Text className={`text-prime font-psemibold text-xl ${textStyles}`}>
            {title}
        </Text>

        {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
        )}

    </TouchableOpacity>
  )
}

export default CustomButton