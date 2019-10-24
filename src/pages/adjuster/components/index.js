import ScrollView from "../../../components/ScrollView";
import goods from "./Goods";
import logis from "./Logis";
import ItemList from "./ItemList";
import WheelPicker from "@/components/wheel-picker";
import ordState from "./ordState"
// import picker from './picker'
import {
  Popup,
  List,
  Area,
  Toast,
  PullRefresh,
  Field,
  DatetimePicker   
} from "vant";

export default {
  logis,
  goods,
  ScrollView,
  WheelPicker,
  ItemList,
  ordState,
  'van-datetime-picker':DatetimePicker,
  'van-field':Field,
  'van-pull-refresh':PullRefresh,
  "van-popup": Popup,
  "van-list": List,
  "van-area": Area,
  "van-toast": Toast
};