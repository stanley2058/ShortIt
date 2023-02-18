import { Button } from "@mantine/core";
import { useState } from "react";

export default function User() {
  const [hasLogin, setHasLogin] = useState(false);
  return (
    <>
      {hasLogin ? (
        <>
          <Button variant="outline">Login</Button>
        </>
      ) : (
        <>
          <Button variant="outline">Login</Button>
        </>
      )}
    </>
  );
}
