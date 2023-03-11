import { StatusBar } from 'react-native';
import { StyleSheet,Alert,  View, Button , Image, useWindowDimensions, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';


type ImageListProps = Array<{    
      id: string;
      url: string;
}>;


export default function App() {
  const [ images, setImages ] = useState<ImageListProps>([]);
  const [ isLoading, setIsLoading ] = useState(true);
  
  const handleImagePicker = async()=>{
    const limit: number = 10;
    let remaining: number;
    remaining = limit - images.length;

   
    if(images.length === 10 ){
      Alert.alert('No more images', 'You have reach the 5 images limit')
    }
     // No permissions request is necessary for launching the image library
     try{
       let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true, **does not work for multiple images** 
        allowsMultipleSelection: true,
        selectionLimit: 5,
        aspect: [4, 3 ],
        quality: 1
       })
      
       if(!result.canceled){
         for(let asset of result.assets){  
          setImages(prevState => [ ...prevState, { id:`${asset.fileName}${asset.assetId}`, url:asset.uri }])
      
       }
  
       }
      

     }catch(error){
      Alert.alert(`${error}`);
     }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

       <View style={styles.buttonContainer}>
        <Button
          onPress={handleImagePicker}
          title="Choose up to 10 images"/>
      </View> 

        <FlatList 
          showsVerticalScrollIndicator={false}
          data={images}
          keyExtractor={item => item.id}
          renderItem={({item})=> <Image style={styles.image} src={item.url} />}
          numColumns={2}
          contentContainerStyle={{marginTop: 20, gap: 20}}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202024',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image:{
    width: 100,
    height: 100,
    borderRadius: 100, 
    borderWidth:2, 
    borderColor: '#F7A5A6', 
    margin: 15 
  },
  buttonContainer:{
    marginTop: 100, 
    marginBottom: 20
  }
});
