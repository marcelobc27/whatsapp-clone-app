import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useDispatch } from "react-redux"
import colors from "../../constants/colors"
import commonStyles from "../../constants/commonStyles"
import { authenticate, setDidTryAutoLogin } from "../store/authSlice"
import { getUserData } from "../utils/Actions/userActions"

const StartUpScreen = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem('userData')

      if(!storedAuthInfo){
        dispatch(setDidTryAutoLogin())
        return;
      }

      const parseData = JSON.parse(storedAuthInfo)
      const { token, userId, expiryDate: expiryDateString} = parseData

      const expiryDate = new Date(expiryDateString)
      if(expiryDate <= new Date() || !token || !userId){
        dispatch(setDidTryAutoLogin())
        return;
      }

      const userData = await getUserData(userId)
      dispatch(authenticate({token: token, userData}))

    }

    tryLogin()
  }, [dispatch])

  return(
    <View style={commonStyles.center}>
      <ActivityIndicator size="large" color={colors.primary}/>
    </View>
  )
}

const styles = StyleSheet.create({

})

export default StartUpScreen