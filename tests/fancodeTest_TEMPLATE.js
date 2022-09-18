'use strict';

const { validateFancodeTodosList, validateUserFromFanCodeCity, validateCompletedTaskFromUsers } = require("./api/fancodeTestAPI");
const params = process.env.URL;

const tags = {
  appName: 'FanCode API',
  scriptName: 'Template',
  product: 'FanCode',
  testType: 'app',
  detailsCount: 1,
};


describe("All the users of City `FanCode` should have more than half of their todos task completed.", function () {

  this.timeout(360000);
  this.slow(10000);

    it('User has the todo tasks', async function (done) {
      await validateFancodeTodosList(done);
    });

    it('User belongs to the city FanCode', async function (done) {
      await validateUserFromFanCodeCity(done);
    });

    it('User Completed task percentage should be greater than 50%', async function (done) {
      await validateCompletedTaskFromUsers(done);
    });

});