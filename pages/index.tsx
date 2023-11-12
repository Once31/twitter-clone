import Button from "@/components/Button";
import Form from "@/components/Form";
import Header from "@/components/Header";
import Input from "@/components/Input";
import PostFeed from "@/components/posts/PostFeed";

export default function Home() {
  return (
    <>
      <Header label="Home" />
      <Form placeholder="What's happening" />
      <PostFeed />
    </>
  );
}
