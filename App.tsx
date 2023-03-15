import { useState  } from 'react';
import { StatusBar } from 'react-native';
import { ImageComponent } from './src/components/ImageComponent';
import { EmptyComponent } from './src/components/EmptyComponent';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, 
  Alert, 
  View,  
  FlatList , 
  TouchableOpacity , 
  Text, 
  ActivityIndicator} from 'react-native';


type ImageListProps = Array<{
  id: string;
  source: string;
}>


export default function App() {
  
  const [ images, setImages ] = useState<ImageListProps>([]);
  const [ isLoading, setIsLoading ] = useState(false); 
  const [ limit, setLimit ] = useState(6);


  const getPickedImages = async()=>{
    try{
      // No permissions request is necessary for launching the image library
    
      let result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //  allowsEditing: true,
       allowsMultipleSelection: true,
       selectionLimit: 5,
       aspect: [4, 3 ],
       quality: 1
      })
      
      
      if(!result.canceled){  
        console.log(result)       
        for(let asset of result.assets){ 
          
          if(result.assets.length + images.length > limit ){           
            return Alert.alert(`Total of ${limit} photos allowed`, 'Please review your selections.' )
          }
          
          const duplicated = images.find(item => `${asset.assetId}` === item.id);
            
          if(duplicated){                  
            return Alert.alert('Try again.', 'Duplicated image selected.');

          }
          
          setImages(prevState => [ ...prevState, { id:`${asset.assetId}`, source:asset.uri }])
          
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

  const handleImageRemove =(imageId: string)=>{
    Alert.alert("Remove image","Are you sure you want to remove this image?", [{
      text: 'Yes',
      onPress: ()=>proceedRemoval(imageId)
    },{
      text: 'No', style:"cancel"
    }])
    
  }   
    const proceedRemoval =(imageId:string)=>{
      const updatedImages = images.filter(item => item.id !== imageId); 
      setImages(updatedImages);
    
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
        renderItem={({item})=> <ImageComponent onTrashPress={()=>handleImageRemove(item.id)} source={item.source} />}
        numColumns={2}
        contentContainerStyle={{marginTop: 20, gap: 20, alignItems: 'center', paddingBottom: 100 }}
        ListEmptyComponent={<EmptyComponent />}
        ListHeaderComponent={
          <View>
            <TouchableOpacity 
            disabled={images.length === limit}  
            activeOpacity={0.7} 
            onPress={handleImagePicker} 
            style={[styles.buttonContainer, {backgroundColor: images.length === limit ? '#FF7779' : '#3bc20b'}]}>
              <Text style={styles.buttonText}>{images.length === limit ? `Limit of ${limit} images reached` : `Choose up to ${limit} images`}</Text>              
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
    margin: 15,
 
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
