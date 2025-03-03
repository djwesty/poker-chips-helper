import { ButtonProps, Button } from "react-native";
import { COLORS } from "@/styles/styles";

// More styling can be done, or swap this out with more flexible component like a TouchableOpacity if needed
const AppButton = (props: ButtonProps) => (
  <Button color={COLORS.PRIMARY} {...props} />
);

export default AppButton;
