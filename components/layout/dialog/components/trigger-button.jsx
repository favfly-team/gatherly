import { DialogTrigger } from "@/components/ui/dialog";

const TriggerButton = ({ button }) => {
  return <DialogTrigger asChild>{button}</DialogTrigger>;
};

export default TriggerButton;
