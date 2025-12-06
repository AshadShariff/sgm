import Header from "./components/header"
import HomePage from "./components/home-page"

export const metadata = {
  title: "Signature Global Media — AI Video Cloning & Production",
  description:
    "Create professional AI video clones in just 30 minutes. No camera, no editing, no tech skills required. Join 50,000+ creators.",
}

export default function Home() {
  return (
    <>
      <Header />
      <HomePage />
    </>
  )
}
