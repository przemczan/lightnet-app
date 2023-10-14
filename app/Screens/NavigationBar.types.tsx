import { ParamListBase, Route } from '@react-navigation/native';
import { NativeStackNavigationOptions, NativeStackNavigationProp } from '@react-navigation/native-stack';

export type NavigationBarProps = {
  back?: { title: string } | undefined;
  options: NativeStackNavigationOptions;
  route: Route<string, object | undefined>;
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
};
