import app from "./app";

const port = process.env.PORT;

if (!port) {
  throw new Error("PORT is required.");
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
