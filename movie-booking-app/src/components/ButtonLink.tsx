import React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { Link, LinkProps } from "react-router-dom";

// Type that combines ButtonProps and LinkProps
type ButtonLinkProps = Omit<ButtonProps, "as"> & LinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, to, ...props }, ref) => (
    <Button
      as={Link as any} // This bypasses the type issue by using `any`
      to={to}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  )
);

export default ButtonLink;
