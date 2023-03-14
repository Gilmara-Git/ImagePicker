import { StatusBar } from 'react-native';
import { StyleSheet,Alert,  View,  FlatList , TouchableOpacity , Text, Image, ActivityIndicator} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';


type ImageListProps = Array<{
  id: string;
  source: string;
}>


export default function App() {
  
  const [ images, setImages ] = useState<ImageListProps>([]);
  const [ isLoading, setIsLoading ] = useState(false); 
  const [ limit, setLimit ] = useState(5)

  const getPickedImages = async()=>{
    try{
      // No permissions request is necessary for launching the image library
    
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
          
          console.log(result.assets.length)
          console.log(images.length, 'linha39')
          console.log( limit - (images.length + result.assets.length) , 'linha38')
          if(result.assets.length + images.length > limit ){
            return Alert.alert(`Total of ${limit} photos allowed`, 'Please review your selections.' )
          }
          
          const duplicated = images.find(item => `${asset.fileName}${asset.assetId}` === item.id);
        
          if(duplicated){                  
            return Alert.alert('Try again.', 'One of the images selected were duplicated');

          }
          
          setImages(prevState => [ ...prevState, { id:`${asset.fileName}${asset.assetId}`, source:asset.uri }])
          
        }      
      }
     
    }catch(error){
     Alert.alert(`${error}`);
    }
  }

  const handleImagePicker = async()=>{    
    setIsLoading(true);
    await getPickedImages();
    setIsLoading(false);
  }


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        { isLoading ? <ActivityIndicator size="large" color="#3bc20b"/> :      
        (
          <>
        
        <FlatList 
      
        showsVerticalScrollIndicator={false}
        data={images}
        keyExtractor={item => item.id}
        renderItem={({item})=> <Image style={styles.image} source={{ uri: item.source}} />}
        numColumns={2}
        contentContainerStyle={{marginTop: 20, gap: 20, width: '100%'}}
        ListHeaderComponent={
          <View>
            <TouchableOpacity 
            disabled={images.length === limit}  
            activeOpacity={0.7} 
            onPress={handleImagePicker} 
            style={[styles.buttonContainer, {backgroundColor: images.length === limit ? '#a9a9a9' : '#3bc20b'}]}>
              <Text style={styles.buttonText}>{images.length === limit ? 'Unable to upload more images' : `Choose up to ${limit} images`}</Text>              
            </TouchableOpacity> 
          </View>

        }
        />
        </>)
        
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202024',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
   image:{
    width: 100,
    height: 100,
    borderRadius: 100, 
    borderWidth:3, 
    borderColor: '#3bc20b', 
    margin: 15 
  },
  buttonContainer:{
    marginTop: 100, 
    marginBottom: 20,
    backgroundColor: '#3bc20b',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText:{
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
});
