import {
  CardDescription,
  CardHeader as HeaderComponent,
  CardTitle,
} from "@/components/ui/card";

const CardHeader = ({ title, description }) => {
  return (
    <HeaderComponent>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </HeaderComponent>
  );
};

export default CardHeader;
