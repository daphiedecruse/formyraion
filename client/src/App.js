import React from "react";
import CommentsSection from "./components/CommentsSection";

function App() {
  return (
    <div className="App">
      <h1>My Post</h1>
      <p>This is a sample post. People can comment below.</p>
      
      {/* Pass the post ID as a prop */}
      <CommentsSection postId="post_id_here" />
    </div>
  );
}

export default App;
