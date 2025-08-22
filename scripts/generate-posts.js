const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), '_posts');
const targetFile = path.join(process.cwd(), 'src', 'posts.json');

function generatePostData() {
  const fileNames = fs.readdirSync(postsDir);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      if (!data.title || !data.date) {
        console.warn(`WARN: Post "${fileName}" is missing 'title' or 'date' in its front-matter.`);
      }

      const thumbnailMatch = content.match(/\!\[.*?\]\((.*?)\)/);
      const thumbnail = thumbnailMatch ? thumbnailMatch[1] : null;

      return {
        slug,
        ...data,
        thumbnail,
        content,
      };
    });

  // Sort posts by date in descending order
  const sortedPosts = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  fs.writeFileSync(targetFile, JSON.stringify(sortedPosts, null, 2));
  console.log(`Successfully generated ${sortedPosts.length} posts into ${targetFile}`);
}

try {
  generatePostData();
} catch (error) {
  console.error('Error generating post data:', error);
  process.exit(1);
}
