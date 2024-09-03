const allPostContainer = document.getElementById("allPostContainer");
const latestPostContainer = document.getElementById("latestPostContainer");

let countReadPost = 0;
let allPost = [];

const fetchFunc = async (url) => {
  try {
    const response = await fetch(url);
    const { posts } = await response.json();
    return posts;
  } catch (error) {
    return error;
  }
};

const showPost = (post) => {
  const {
    title,
    description,
    author,
    image,
    category,
    comment_count,
    view_count,
    posted_time,
    isActive,
  } = post;

  const newPost = document.createElement("div");

  newPost.innerHTML = `<div class="flex items-start gap-4 bg-[#F3F3F5] rounded-lg p-8">
        <figure class="w-16 h-16 relative">
            <img src=${image} alt="post-image"
                class="w-full h-full rounded-2xl">
            <span id="activeIcon"
                class="px-2 py-2 ${
                  isActive ? "bg-green-500" : "bg-red-500"
                } rounded-full absolute  right-0 top-0 z-10"></span>
        </figure>
        <div class="flex flex-col text-start">
            <div class=" border-b-2 border-dashed pb-4">
                <div class="flex flex-col sm:flex-row items-start sm:gap-4">
                    <span># ${category}</span>
                    <span>Author : ${author.name}</span>
                </div>
                <h1 class="font-bold text-xl">${title}</h1>
                <p class="max-w-md">${description}</p>

            </div>
            <div class="flex items-center justify-between gap-4 py-4">
                <div class="flex items-start justify-start gap-4 flex-wrap">
                    <div class="flex items-center justify-center gap-2">
                        <img src="./images/card-icon/comment.svg" alt="">
                        <span>${comment_count}</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <img src="./images/card-icon/eye.svg" alt="">
                        <span>${view_count}</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <img src="./images/card-icon/timer.svg" alt="">
                        <span>${posted_time} min</span>
                    </div>
                </div>
                <div>
                    <img src="./images/card-icon/email 1.svg" class="cursor-pointer" alt="" onclick='handlePostClick(${
                      post.id
                    })'
                    >
                </div>
            </div>
        </div>

    </div>`;

  allPostContainer.appendChild(newPost);
};

const fetchPosts = async (query) => {
  let isLoading = true;
  const loading = document.createElement("div");
  loading.innerHTML = `<div class="flex items-center justify-center ">
  <span class="loading loading-bars loading-lg"></span>
</div>`;
  if (query) {
    allPost = [];
    allPostContainer.innerHTML = "";
    isLoading && allPostContainer.appendChild(loading);
    const posts = await fetchFunc(query);
    allPost = posts;
    console.log({posts})
    setTimeout(() => {
      isLoading = false;
      allPostContainer.innerHTML = "";
      for (const post of posts) {
        showPost(post);
      }
    }, 2000);
  } else {
    const url = "https://openapi.programming-hero.com/api/retro-forum/posts";
    allPostContainer.innerHTML = "";
    isLoading && allPostContainer.appendChild(loading);
    const posts = await fetchFunc(url);
    allPost = posts;

    setTimeout(() => {
      isLoading = false;
      allPostContainer.innerHTML = "";
      for (const post of posts) {
        showPost(post);
      }
    }, 2000);
  }
};

const handlePostClick = (postId) => {
  countReadPost++;

  const post = allPost.find((post) => post.id === postId);

  console.log(postId, post);
  const { title, view_count } = post;

  const readPostContainer = document.getElementById("readPostContainer");
  const readNumber = document.getElementById("readNumber");
  readNumber.innerText = countReadPost;

  const newPost = document.createElement("div");
  newPost.innerHTML = `<div class="flex items-center justify-center gap-4 bg-white py-4 px-2 rounded-lg">
  <h1 class="max-w-sm text-xl font-medium text-start">${title}</h1>
  <div class="flex items-center justify-center gap-2">
      <img src="./images/card-icon/eye.svg" alt="">
      <span>${view_count}</span>
  </div>
</div>`;

  readPostContainer.appendChild(newPost);
};

const getLatestPost = async () => {
 

  const url =
    "https://openapi.programming-hero.com/api/retro-forum/latest-posts";
  try {
    let isLoading = true;

    const loading = document.createElement("div");
    
    loading.innerHTML = `<div class="flex items-center justify-center ">
    <span class="loading loading-bars loading-lg"></span>
  </div>`;


    isLoading && latestPostContainer.appendChild(loading);
    
    const response = await fetch(url);
    const posts = await response.json();

    setTimeout(() => {
      isLoading = false;
      latestPostContainer.innerHTML = "";
      for (const post of posts) {
        console.log(post);
        const { cover_image, author, description, profile_image, title } = post;
        const { posted_date, name, designation } = author;
  
        const newPost = document.createElement("div");
        newPost.innerHTML = ` <div class="card w-full bg-base-100 shadow-xl">
              <figure><img src=${cover_image}
                      alt="latest post cover image" /></figure>
              <div class="card-body text-start items-start">
                  <div class="flex items-center justify-center gap-2">
                      <img src="./images/card-icon/Frame (1).svg" alt="">
                      <span>${
                        posted_date ? posted_date : "No publish date"
                      }</span>
                  </div>
                  <h2 class="card-title font-bold text-2xl">${title}</h2>
                  <p>${description}</p>
                  <div class="flex justify-center gap-2 items-center">
                     <div class="w-16 h-16 rounded-full"><img src=${profile_image} alt="" class="w-16 h-16 rounded-full"></div>
                      <div class="flex flex-col">
                          <h1 class="text-lg lg:text-lg font-bold">${name}</h1>
                          <p>${designation ? designation : "Unknown"}</p>
                      </div>
                  </div>
              </div>`;
  
        latestPostContainer.appendChild(newPost);
      }
    }, 2000);





   
   
  } catch (error) {}
};

const searchInput = document.getElementById("searchInput");

const handleSearch = () => {
  const query = searchInput.value;
  fetchPosts(
    `https://openapi.programming-hero.com/api/retro-forum/posts?category=${query}`
  );
};

fetchPosts();
getLatestPost();
