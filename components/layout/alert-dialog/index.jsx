// import {
//   AlertDialog as AlertDialogComponent,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

const AlertDialog = ({
  children,
  trigger,
  title,
  description,
  isOpen,
  setIsOpen,
}) => {
  return (
    <></>
    // <AlertDialogComponent open={isOpen} onOpenChange={setIsOpen}>
    //   <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

    //   <AlertDialogContent>
    //     {/* ===== HEADER ===== */}
    //     <AlertDialogHeader>
    //       <AlertDialogTitle>{title}</AlertDialogTitle>
    //       <AlertDialogDescription>{description}</AlertDialogDescription>
    //     </AlertDialogHeader>

    //     {/* ===== CONTENT ===== */}
    //     {children}
    //   </AlertDialogContent>
    // </AlertDialogComponent>
  );
};

export default AlertDialog;
