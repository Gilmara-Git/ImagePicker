import styles from './styles';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const EmptyComponent = ()=>{
    return (
    <View style={styles.container}>
        <Text style={styles.emptyTextIndicator}>Gallery is Empty! {"\n"} Please click the button above to add your images.</Text>
        <Ionicons  name="images-outline" size={40} color="#A9A9A9"/> 
    </View>)
}