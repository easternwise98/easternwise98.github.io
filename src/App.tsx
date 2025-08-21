import { Routes, Route } from 'react-router-dom';
import { PostListPage } from './pages/PostListPage';
import { PostPage } from './pages/PostPage';
import posts from './posts.json';

// Define the Post type based on the structure of posts.json
export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  summary: string;
  content: string;
  category?: string; // Optional fields from original design
  subcategory?: string; // Add subcategory field
  readTime?: string;
  views?: number;
  likes?: number;
  imageUrl?: string;
  isNew?: boolean;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostListPage posts={posts as Post[]} />} />
      <Route path="/post/:slug" element={<PostPage />} />
    </Routes>
  );
}

export default App;
