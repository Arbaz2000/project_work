import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
  handleHead,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { decode } from "base-64";
import { jwtDecode } from "jwt-decode";
import React, { useState, useContext } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const QupScreen = () => {
  const richText = React.useRef();
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");

  //testing
  const handlePostSubmit = () => {
    const postData = {
      userId,
    };

    if (content) {
      postData.content = content;
    }

    axios
      .post("http://10.0.2.2:3000/create-post", postData)
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        console.log("error creating post", error);
      });
  };
  //testing
  const TagInputComponent = () => {
    const [tags, setTags] = useState([]);
    const [text, setText] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    const addTag = () => {
      if (text.trim() !== "") {
        if (editIndex !== null) {
          // If editing an existing tag
          const newTags = [...tags];
          newTags[editIndex] = text.trim();
          setTags(newTags);
          setEditIndex(null);
        } else {
          // If adding a new tag
          setTags([...tags, text.trim()]);
        }
        setText("");
      }
    };
    

    const removeTag = (index) => {
      const newTags = [...tags];
      newTags.splice(index, 1);
      setTags(newTags);
    };

    const editTag = (index) => {
      const tagToEdit = tags[index];
      setText(tagToEdit);
      setEditIndex(index);
    };
    
    return (
      <View style={styles.container}>
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagWrapper}>
              <TouchableOpacity
                onPress={() => editTag(index)}
                style={styles.tag}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeTag(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a tag"
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTag}
          />
          <TouchableOpacity onPress={addTag} style={styles.addButton}>
            <Text style={styles.buttonText}>
              {editIndex !== null ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ padding:5,margin:8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 2,
          marginVertical: 20,
          rowGap:2

        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Text>{userId}</Text>

      </View>
      <View style={{ flexDirection: "row", marginLeft:5,paddingLeft:10 }}>
      <KeyboardAvoidingView>
      <View style={{ alignItems:"flex-start", marginTop: 10 ,marginRight:50}}>
        <View>
          <Text style={{ marginLeft:70,fontWeight: 200, fontSize: 30, color: "black"}}>
            Ask a question
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 400, marginLeft: 30 }}>
            Title:
          </Text>
          <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
            style={{
              height: 40,
              width: 300,
              fontSize: 14,
              borderRadius: 10,
              borderColor: "gray",
              borderWidth: 1,
              backgroundColor: "#fafafa",
              paddingLeft: 10,
              marginLeft: 20,
              marginRight: 10,
            }}
            placeholder="add title"
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 400, paddingLeft: 10,
              marginLeft: 25,
              marginRight: 160,}}>
            Body:
          </Text>
        </View>
        <SafeAreaView style={{ marginTop: 5, marginLeft:20,height:350,widhth:500}}>
          <ScrollView>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{
                borderRadius: 10,
                borderColor: "gray",
                borderWidth: 1,
                backgroundColor: "#fafafa",
                paddingLeft: 10,
                height: 300,
                width: 310,
              }}
            >
              <Text >Description:</Text>
              <RichEditor
              
                ref={richText}
                onChange={(descriptionText) => {
                  console.log("descriptionText:", descriptionText);
                }}
                
              />
            </KeyboardAvoidingView>
          </ScrollView>
          
          <RichToolbar style={{width:300,color:"black"}}
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.keyboard,
              actions.code,
              actions.setStrikethrough,
              actions.setUnderline,
              actions.blockquote,
              actions.insertVideo,
              actions.checkboxList,
              actions.undo,
              actions.redo,
            ]}
            // onPress={() => {
            //   pickImage();
            // }}
            iconMap={{ [actions.heading1]: handleHead }}
          />
          </SafeAreaView>
      
        <View style={{ flexDirection:"row",paddingLeft:20, marginBottom: 20,rowGap:10}}>
          <Text style={{ fontSize: 20, fontWeight: 400,marginLeft:25 }}>
            Tags:
          </Text>
          <View>
            <TagInputComponent />
          </View>
        </View>
      </View>
      
      {/* <Button title="Done" /> */}
    </KeyboardAvoidingView>
      </View>

      <View style={{ marginTop: 20 }} />

      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
    
    
  );
};

export default QupScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 10,
  },
  root: {
    flex:1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#eaeaea",
    marginRight: 300,
    width: 50,
    marginBottom: 200,
  },
  editor: {
    flexDirection: "row",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: "white",
  },
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  container: {
    width: "100%",
    paddingHorizontal: 20,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    marginRight: 5,
  },
  tag: {
    backgroundColor: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  tagText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  removeButton: {
    marginLeft: 1,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "black",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  input: {
    height: 40,
    
    borderColor: "#CCCCCC",
    borderWidth: 1,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "black",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
