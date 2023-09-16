/// <reference types="cypress" />

context('Actions', () => {
  const data = require('../data/inputs.json');

  it('Should enter user data', function() {
    // If you need to log in or set up some initial state, do so here
    cy.visit('http://localhost:3000/');
    
    cy.get('input[name=numberOfCourses]').type(data.classes.length);


    data.classes.forEach(course => {
      const index = data.classes.indexOf(course)
      console.log(index)
      // Fill in the form fields
      cy.get(`input[name=course-${index + 1}-name]`).type(course.name)
      cy.get(`textarea[name=course-${index + 1}-schedule]`).type(course.schedule.join("\n"))

      // Submit the form (assuming the button has the text 'Submit')
      // cy.contains('Submit').click();

    })
  })
})