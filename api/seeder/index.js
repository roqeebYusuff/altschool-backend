const { faker } = require("@faker-js/faker/locale/en_NG");
const User = require("../models/user");
const Blog = require("../models/blog");
const { readingTime } = require("../utils/func");

module.exports.seeders = async () => {
  await userSeeder();
  await blogSeeder();
};

const userSeeder = async () => {
  const userCount = await User.count({});

  let userArray = [];

  if (userCount === 0) {
    console.log("Running User Seeder");
    // run a loop 50 times
    for (let i = 0; i < 50; i++) {
      const first_name = faker.name.firstName();
      const last_name = faker.name.lastName();
      userArray.push(
        new User({
          first_name,
          last_name,
          email: faker.helpers.unique(faker.internet.email, [
            first_name,
            last_name,
          ]), // unique email
          username: faker.helpers.unique(faker.name.middleName), //unique username
          password: first_name,
        })
      );
    }

    await User.insertMany(userArray);

    console.log(`${userArray.length} Users inserted`);
  }
};

const blogSeeder = async () => {
  const blogCount = await Blog.count({});

  let blogArray = [];

  // Get all authors
  const allAuthors = await User.find({});

  if (blogCount === 0) {
    console.log("Running blog seeder");
    for (let i = 0; i < 50; i++) {
      let body = faker.lorem.paragraphs(5); // Generate 5 paragraphs for blog body
      let authorId =
        allAuthors[Math.floor(Math.random() * allAuthors.length)]._id; // Pick a rondom author id

      blogArray.push(
        new Blog({
          title: faker.lorem.sentence(5), // Generate 5 sentences for blog title
          body,
          description: faker.lorem.sentence(10),
          state: faker.helpers.arrayElement(["draft", "published"]),
          read_count: 0,
          reading_time: readingTime(body),
          tags: faker.helpers.uniqueArray(faker.random.word, 5),
          author: authorId,
        })
      );
    }

    await Blog.insertMany(blogArray);
    console.log(`${blogArray.length} Blogs inserted`);
  }
};
