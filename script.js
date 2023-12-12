const rootElement = document.querySelector(".root");

let currentUserId = localStorage.getItem("userId") || 1;

async function fetchData(userId) {
  try {
    const userResponse = await fetch(`https://dummyjson.com/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error("Пользователя с таким id нет");
    }

    const postsResponse = await fetch(
      `https://dummyjson.com/posts/user/${userId}`
    );
    if (!postsResponse.ok) {
      throw new Error("Не удалось получить посты пользователя");
    }

    const [userData, postsData] = await Promise.all([
      userResponse.json(),
      postsResponse.json(),
    ]);

    const { firstName, email } = userData;
    const { posts } = postsData;
    renderData(firstName, email, posts);
  } catch (error) {
    console.error("my error: ", error.message);
  }
}

function renderData(firstName, email, posts) {
  rootElement.innerHTML = "";

  const userCard = document.createElement("div");

  const nameHeader = document.createElement("h1");
  nameHeader.textContent = `Name: ${firstName}`;
  userCard.appendChild(nameHeader);

  const emailParagraph = document.createElement("p");
  emailParagraph.textContent = `Email: ${email}`;
  userCard.appendChild(emailParagraph);

  if (posts && posts.length > 0) {
    const postsList = document.createElement("ul");

    posts.forEach((post) => {
      const postItem = document.createElement("li");
      postItem.textContent = post.body;
      postsList.appendChild(postItem);
    });

    userCard.appendChild(postsList);
  }
  rootElement.appendChild(userCard);

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous User";
  prevButton.type = "button";
  prevButton.addEventListener("click", prevUser);
  rootElement.appendChild(prevButton);

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next User";
  nextButton.type = "button";
  nextButton.addEventListener("click", nextUser);
  rootElement.appendChild(nextButton);
}

function saveUserIdToLocalStorage(userId) {
  localStorage.setItem("userId", userId);
}

function nextUser() {
  currentUserId++;
  saveUserIdToLocalStorage(currentUserId);
  fetchData(currentUserId);
}

function prevUser() {
  if (currentUserId > 1) {
    currentUserId--;
    saveUserIdToLocalStorage(currentUserId);
    fetchData(currentUserId);
  }
}

fetchData(currentUserId);
