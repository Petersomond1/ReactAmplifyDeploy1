# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


submitter Missing.
These is the unique iD used in place of users username so as to coversely identify users or the audience groupings they belong to or have been assigned to.
Its the 6-alphanumeric ID
of which is same as their audience ID#, which is the classes # and the userclass #. Admin is supposed to assign it at the point of approval after rank of survey.
1. @ user table, there should be submitter # listed as a column.
2. it is used at content.service.js as u.name as submitter.
3. it is used at the comments or ChatsbyContent.jsx section {msg.submitter}
4. used at ContentListings.jsx as content.submitter
5. we see it being assigned at Chatboard.jsx as class or userclass of audience.
6. there should be a listing of all userclass grouping of all audience from that of general, to individual groupings. 

Profile
Needs work.
the point where users submitter number and the userclass of a user is displayed, personal ID like name, email, phone, etc should not be displayed of linked here with the submitter name.

SEARCH.
The search system needs work. 
As a search engnine, it should be able to search out terms and phrases from all the content title and the text or description part that a user have access/approval previlledge to.

ClarionCall page upload system
Needs work.

After much stress, the logout snippet from Adminpage and Chatpage was implemented, but that from Adminpage seems to be updating late. Need to check if the crud is post or get, as i had to change it from post to get at the endpoints which i implemented through the auth/logout route instead of admin/logout ??? . 

There is this error """ Error in getAllContent: Bind parameters must not contain undefined. To pass SQL NULL specify JS null
GET /api/content 500 1.186 ms - 53""" ALso there seems to be inconsistences in the used of the variable; message or newMessage, newMessage={newMessage}, setNewMessage={setNewMessage}, sendMessage={sendMessage}, uploadFile={uploadFile}, user_id or userId, classId or class_id, through the codings and also the addition of the textarea input for "title" that is added to that for "description". Check through the codings and correct the inconsistences in the use, positions and applications of these terms. """ check for composition of  "handleSendMessage", "handleSendContent """ 