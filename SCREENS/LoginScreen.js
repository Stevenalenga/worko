import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserApi } from "../Api/UserApi";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(true);
  const [checkValidEmail, setCheckValidEmail] = useState(false);

  const handleCheckEmail = (text) => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  const checkPasswordValidity = (value) => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return "Password must not contain Whitespaces.";
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return "Password must have at least one Uppercase Character.";
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return "Password must have at least one Lowercase Character.";
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return "Password must contain at least one Digit.";
    }

    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(value)) {
      return "Password must be 8-16 Characters Long.";
    }

    return null;
  };
  /*
  const handleLogin = () => {
    const checkPassowrd = checkPasswordValidity(password);
    if (!checkPassowrd) {
      // Replace the UserApi call with your own login logic
       
      // Simulating a successful login
      navigation.replace("Home");
    } else {
      alert(checkPassowrd);
    }
  };

  */
  /*

  const handleLogin = async () => {
    const checkPassword = checkPasswordValidity(password);

    if (!checkPassword) {
      try {
        await UserApi({
          username: email.toLowerCase(),
          password: password,
        });

        alert("Login Success");
        // Simulating a successful login
        navigation.replace("Home");
      } catch (error) {
        console.error(error);
        // Handle error if the API call fails
        alert("Login failed");
      }
    } else {
      alert(checkPassword);
    }
  };

  */
  const handleLogin = async () => {
    const checkPassword = checkPasswordValidity(password);

    if (!checkPassword) {
      try {
        const result = await UserApi({
          username: email.toLowerCase(),
          password: password,
        });

        if (result.status === 200) {
          await AsyncStorage.setItem("access_token", result.data.access_token);
          alert("Login Success");
          // Simulating a successful login
          navigation.replace("Home");
        }
      } catch (error) {
        console.error(error);
        alert("Login failed");
      }
    } else {
      alert(checkPassowrd);
    }
  };
  /*

const handleLogin = () => {
    const checkPassowrd = checkPasswordValidity(password);
    if (!checkPassowrd) {
      user_login({
        email: email.toLocaleLowerCase(),
        password: password,
      })
        .then(result => {
          if (result.status == 200) {
            AsyncStorage.setItem('AccessToken', result.data.token);
            navigation.replace('Home');
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      alert(checkPassowrd);
    }
  };

  /*
  const handleLogin = async () => {
    // Add async keyword
    const checkPassword = checkPasswordValidity(password);
    if (!checkPassword) {
      try {
        const result = await UserApi({
          username: email.toLocaleLowerCase(),
          password: password,
        });
        const data = await result
        if (data.status === 200) {
          const accessToken = data.access_token;
          AsyncStorage.setItem("access_token", accessToken);
          navigation.replace("Home");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert(checkPassword);
    }
  };
  */

  return (
    <View style={styles.container}>
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => handleCheckEmail(text)}
        />
      </View>
      {checkValidEmail ? (
        <Text style={styles.textFailed}>Wrong format email</Text>
      ) : (
        <Text style={styles.textFailed}> </Text>
      )}
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry={seePassword}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.wrapperIcon}
          onPress={() => setSeePassword(!seePassword)}
        >
          <Text>Show/Hide</Text> {/* Changed the text to "Show/Hide" */}
        </TouchableOpacity>
      </View>
      {email == "" || password == "" || checkValidEmail == true ? (
        <TouchableOpacity
          disabled
          style={styles.buttonDisable}
          onPress={handleLogin}
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "grey",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 10,
    width: "100%",
  },
  wrapperIcon: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 24,
  },
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
    borderRadius: 5,
    marginTop: 25,
  },
  buttonDisable: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
    borderRadius: 5,
    marginTop: 25,
  },
  text: {
    color: "white",
    fontWeight: "700",
  },
  textFailed: {
    alignSelf: "flex-end",
    color: "red",
  },
});
