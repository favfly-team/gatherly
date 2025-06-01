import Link from "next/link";

const CardFooter = ({ text, linkText, linkHref }) => {
  return (
    <div className="mt-4 text-center text-sm">
      {text}{" "}
      <Link href={linkHref} className="underline-offset-4 hover:underline">
        {linkText}
      </Link>
    </div>
  );
};

export default CardFooter;
