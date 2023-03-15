import styles from './styles';
import { View, Image, TouchableOpacity  } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
 
type ImageComponentProps ={
    source: string;
    onTrashPress: ()=>void;
}

export const ImageComponent =({ source,  onTrashPress }:ImageComponentProps )=>{

    return (
        <View style={styles.container}>
            <Image style={[styles.image]} source={{uri: source}}/>
         
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onTrashPress}
            >
                <FontAwesome5 style={{transform: [{translateY:5}]}} name="trash" size={18} color='#A9A9A9' />
            </TouchableOpacity>
            
        </View>
        
    )
};