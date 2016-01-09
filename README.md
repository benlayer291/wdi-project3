# WDI-project3

## Spoken
Spoken is a dating application based on missed connections. It was made for the group project of the General Assembly WDI course.

Team members: Alex Bringazen (prosecco75), Barney Goff (bg181), Ben Layer (benlayer291) and Guillame Vial-Pailler (gvialpai).

You can see Spoken online here: <http://spoken-dating.herokuapp.com>

## Motivation
The idea behind Spoken is that you do not need to search for 'the one' because you've already met them, unfortunately you didn't realise this at the time or do anything about it. 

Quite often people meet and for some reason or other, it is only after you have left them that you realise how great they were and that you should have asked to see them again. This could happen in any number of situations: in a queue in a coffee shop, waiting for a train or lunch at a conference for example. 

Spoken provides a platform for a user to post about their missed connection with what they spoke about and where they spoke about it. A user's image is not displayed so that the content focuses on the deeper emotional connection from a conversation than just a physical connection based on appearance.

## Installation
If you wish to run Spoken locally on your machine you will need to:

1. Ensure you have Node.js installed
2. Clone the repository
 * ``git@github.com:benlayer291/wdi-project3.git``
3. Install the dependecies:
 * ``cd wdi-project3``
 * ``npm install``
4.Open your browser and visit <http://localhost:3000>

### How to use

* On the landing page, the user is greeted by a search box. Here the user can search for the location where their Spoken event took place.

* If no Spoken event exists at the location, the user can create a new Spoken event, but in order to do so they must register or login. This can be done either via their email or using facebook.

* If a spoken event does exist then the user is taken to results page where Spoken events are sorted by relevance to the location the user has searched. Here the user can make a request to an existing Spoken event if they feel it is about them. To do so they will also need to say what they spoke about when the Spoken event happened. 

* A user can see on their profile page all of the Spoken events that they have posted about as well as any requests they have received regarding one of their posted Spoken events. 

* At this point the user will then have the requester's email address for future contact.

## Build
This app was built using:

- Node.js, Express, AngularJS and MongoDB (MEAN stack)

- Google Maps and Places API

- OAuth facebook login, using hello.js

- HTML5, CSS, jQuery are also used on the front end

## Approach
The group pitched various ideas until Spoken was settled upon. This was then followed by an initial planning stage. Trello was used extensively, wireframes and user stories conceived using Adobe Illustrator.

Different coding tasks were split amongst the group with twice daily meetings held to check on progress.

## Challenges

This was a challenging project as it was the first time we had worked as a group together on the same git workflow. 

Handling the amount of code on the front end, particularly in the HTML files, was tricky without a front end framework such as AngularJS.

## Developments

- Redo the front-end using AngularJS

- Add in a chat application so that users who connect can carry on their conversation via the app

- Link new posts to a twitter feed

