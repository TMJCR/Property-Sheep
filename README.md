Property Sheep is a full stack javascript application built for a property letting agency. The site enables landlords to sign up to the service by filling out a questionaire to input all relavant information so their portfolio of properties can be suitably managed by the letting agent. They can then login to the service to securely access their online portal and make any admendments to their account. 

<img src="./Thumbnail.png">

-How I built this:
* This was for a real client so sat with the owner to discuss exactly what he wanted from the application.
* Built the sign up process using bcrypt for secure password storage
* Also assigned a JWT which is stored in cookies
* Began with building the questionaire site which uses conditioinal rendering
* At each stage the information gets stored in the state so that you can navigate through the steps of the questionaire
* Once completed, this gets added to the database and appears in the users portal 
* Authentication and CRUD functionality are handled with JSON web tokens whilst MongoDB is used for storage.

-What I learnt:
* Worked with a client to work out what they want
* The preference was to use materialise UI for easy maintenance so learnt how to customise materialise UI components such as checkbox to fit the brand.
* Worked collaboratively with a designer/illustrator to come up with the branding of the company
* Used JWT and using auth middleware
* USed Session cookies
* Used BCrypt
* Conditional Rendering
* Google Places API and amend the places lookup 
* with a debounce function
* Image storage using base64 ecoding
* Linking schemas using virtual references
* statics and methods in models

-What I would do differently if I were to do it again:
* Redux
* Save in local storage rather than state
* Materialise came with quite a lot of extras that could have been stripped out



