import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Header = ({ title, description }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-2xl">{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
  );
};

export default Header;
