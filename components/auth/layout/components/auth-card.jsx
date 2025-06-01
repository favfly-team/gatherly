import { Card, CardContent } from "@/components/ui/card";
import CardFooter from "./card-footer";
import CardHeader from "./card-header";

const AuthCard = ({
  headerTitle,
  headerDescription,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
}) => {
  return (
    <Card>
      {/* // ====== CARD HEADER ====== */}
      <CardHeader title={headerTitle} description={headerDescription} />

      {/* // ====== CARD CONTENT ====== */}
      <CardContent>
        {/* // ====== RENDER CHILDREN COMPONENTS ====== */}
        {children}

        {/* // ====== CARD FOOTER ====== */}
        <CardFooter
          text={footerText}
          linkText={footerLinkText}
          linkHref={footerLinkHref || "#"} // Default value is "#"
        />
      </CardContent>
    </Card>
  );
};

export default AuthCard;
