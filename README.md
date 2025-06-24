This is a simple chat application with request feature.
Users can chat with their friends and share photos.
User can connect to friends by sending a Chat Request. If that friend accept it then they both will get connected and can chat.

<!-- Add .env file inside server folder with below given content -->
MONGODB_URI = "your mongodb uri"
PORT = server port number
JWT_SECRET = "your jwt secret"

CLOUDINARY_CLOUD_NAME = "your cloudinary cloud name"
CLOUDINARY_API_KEY = "your cloudinary api key"
CLOUDINARY_API_SECRET = "your cloudinary api secret"

<!-- Add .env file inside client folder with below content -->
VITE_BACKEND_URL = "your backend(server) url"
