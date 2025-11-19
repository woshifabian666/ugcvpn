import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <SignUp />
    </div>
  );
}
