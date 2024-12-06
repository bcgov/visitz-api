describe('Cases OpenShift tests', { env: { hideCredentials: true } }, () => {
  it('tests the case/{rowId}/visits url', () => {
    cy.api({
      url:
        Cypress.env('CYPRESS_BASE_URL') +
        '/case/' +
        Cypress.env('CYPRESS_CASE_GET_VISITS') +
        '/visits',
      auth: Cypress.env('token'),
    }).should((response) => {
      expect(response.body).to.have.property('items');
      expect(response.body.items).to.have.length(3);
    });
  });
});
