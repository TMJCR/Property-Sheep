# Property Sheep
Property Sheep is a full stack javascript application built for a property letting agency. The site enables landlords to sign up to the service by filling out a questionnaire to input all relevant information so their portfolio of properties can be suitably managed by the letting agent. A user can then login to the service to access their online portal and securely manage their account.

<img src="./Thumbnail.png">

## How I built this:
* This project was built for a newly formed property letting agency so I first spoke to the client in order to get a list of specifications for how the site should operate.
* The first stage was to build a secure login/account process which I built in node.js using bcrypt for secure encryption. I also used Json web tokens to authenticate the user and these tokens are stored in browser cookies with each subsequent request passed through an authentication middleware.
* Then I began building out a React front-end, starting with the questionnaire where certain sections are conditionally rendered based on the answers to earlier questions. At each stage of the questionnaire the application state is updated so a user can navigate back and forth through the questionnaire without losing their progress.
* All of the questionnaire data is then stored in a MongoDB database and the users can then securely login and access their 'Landlord Portal' from where they have full CRUD functionality over their account. 

## What I learnt:
* Security is an important part of the application as the bulk of information stored in the database is private information. Through research, I gained a good understanding of encryption, private & public key cryptography and hashing and salting. I settled on the NPM package BCrypt to securely store the hashed passwords and for account verification.
* I learnt how to implement Json Web Tokens (JWT) to sign and verify a user once they are logged into the website. This also involved writing custom authentication middleware in Express to intercept and authenticate any requests by checking these tokens. I used the NPM package cookie-parser to pass the tokens back and forth between the browser and the server.
* I discovered more advanced concepts in database schemas such as the difference between statics and methods on an object data model and linking schemas using virtual references.
* I gained experience of working directly with a client to understand their requirements and then go about designing and implementing the solution independently. I also worked collaboratively with a designer/illustrator to make the website design coherent with the company branding.
* The client's preference was to use Material-UI and there were many instances where I had to customise the Material-UI components both in terms of logic and style.
* Including an address lookup was part of the client's specification so I decided to use the Google Places API. To stay within API request limits I researched Throttle and Debouncing to reduce the number of requests that are sent when a user types in a postcode. Ultimately, I decided to only send the request to the API once three letters of a postcode have been typed which greatly reduced the API calls. 
* An important part of the questionnaire was to conditionally render the questions based on previous answers which I managed using state to store answered questions.
 
## What I would do differently if I were to do it again:
* The application itself is relatively large compared to other React projects I have worked on and there are many components. This results in passing props through many levels of the component tree, which can be difficult to trace through. I believe this would have been a good opportunity to use the React Context API, as much of the data in the application needs to be accessed by various components, all at different nested levels.
* In hindsight, while I did save the questionnaire responses in state so that a user can navigate back and forth between the questionnaire pages, I may have been better saving the responses in local storage so that the progress will not be lost if the page is refreshed for any reason.
* Although I found Material-UI easy to work with (and was using it was part of the brief), had I built this for myself I would probably opt to build custom components as the Material-UI components had a lot of additional structure that I didnt need for my purpose and some components needed quite a bit of customisation to work in the way that I needed.



